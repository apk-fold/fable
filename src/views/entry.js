// Saisie / modification d'une journée, avec aperçu du calcul en direct.
import * as store from '../core/store.js';
import { computeMission, normalizeMission, span } from '../core/calc.js';
import { todayIso, fmtDateLong, cap, parseHM, fmtHM, fmtDuration, weekStart, addDays, weekday, DAYS_SHORT, isValidIso, ymd, MONTHS_SHORT } from '../core/time.js';
import { holidayName } from '../core/holidays.js';
import { icon } from '../ui/icons.js';
import { esc, money, num2, pct, toast, confirmSheet, sheet } from '../ui/dom.js';
import { subHead, missionChips, bindChips, seg, bindSeg } from '../ui/components.js';
import { back } from '../ui/nav.js';
import { haptic } from '../platform.js';

export const liveRefresh = false;

const PAUSES = [0, 15, 20, 30, 45, 60];

export function render(root, route) {
  const s = store.get();
  const id = route.parts[1];
  const isNew = id === 'new';
  const existing = isNew ? null : store.entry(id);
  if (!isNew && !existing) {
    root.innerHTML = `${subHead('Journée')}<div class="empty"><h3>Journée introuvable</h3><p>Elle a peut-être été supprimée.</p></div>`;
    return;
  }
  const active = store.activeMissions();
  if (!s.missions.length) {
    root.innerHTML = `${subHead('Nouvelle journée')}<div class="empty"><h3>Crée d'abord une mission</h3><p>Le taux horaire et les majorations viennent de la mission.</p><button class="btn primary" data-go="#/mission/new">${icon('plus', 18)} Créer une mission</button></div>`;
    return;
  }

  // ---- état du formulaire
  let f;
  if (existing) f = { ...existing };
  else {
    const q = route.query;
    const mId = [q.mission, s.settings.lastMissionId, active[0]?.id, s.missions[0].id].find((x) => x && store.mission(x));
    const m = normalizeMission(store.mission(mId));
    const last = s.entries.filter((e) => e.missionId === m.id).sort((a, b) => (a.date < b.date ? 1 : -1))[0];
    f = {
      missionId: m.id,
      date: isValidIso(q.date) ? q.date : todayIso(),
      start: last?.start || m.defaultStart,
      end: last?.end || m.defaultEnd,
      pause: last ? last.pause : m.defaultPause,
      meal: 'auto',
      note: '',
    };
  }
  let repeat = new Set();
  const choices = active.some((m) => m.id === f.missionId) ? active : [...active, store.mission(f.missionId)];

  root.innerHTML = `${subHead(isNew ? 'Nouvelle journée' : 'Modifier la journée', {
    actions: isNew ? '' : `<button class="ic-btn" data-act="dup" aria-label="Dupliquer">${icon('copy', 22)}</button><button class="ic-btn" data-act="del" aria-label="Supprimer">${icon('trash', 22)}</button>`,
  })}
  <div class="form">
    ${missionChips(choices, f.missionId)}
    <section class="card">
      <label class="date-card tap">
        <input type="date" name="date" value="${esc(f.date)}" required>
        <span class="date-ic">${icon('calendar', 22)}</span>
        <span class="date-txt"><b data-date-label></b><small data-date-tags></small></span>
        ${icon('chevronDown', 18, 'muted')}
      </label>
      <div class="time-pair">
        <label class="time-box tap"><input type="time" name="start" value="${esc(f.start)}"><b class="display num" data-t="start"></b><small>Début</small></label>
        <span class="time-arrow">${icon('arrow', 22)}</span>
        <label class="time-box end tap"><input type="time" name="end" value="${esc(f.end)}"><b class="display num" data-t="end"></b><small>Fin <em data-next hidden>le lendemain</em></small></label>
      </div>
      <div class="quick">
        <span class="quick-label">${icon('plusCircle', 18)} Heures sup.</span>
        <div class="quick-btns">
          <button type="button" data-add="-15">−15</button>
          <button type="button" data-add="15">+15 min</button>
          <button type="button" data-add="30">+30 min</button>
          <button type="button" data-add="60">+1 h</button>
        </div>
      </div>
      <p class="hint">Ajoute du temps à l'heure de fin. Il n'est majoré que si ta semaine dépasse le seuil de la mission.</p>
    </section>

    <section class="card">
      <div class="card-head"><h3>${icon('coffee', 20)} Pause</h3><span class="muted small" data-pause-label></span></div>
      <div class="chips wrap" data-pauses>
        ${PAUSES.map((p) => `<button type="button" class="chip" data-p="${p}">${p ? fmtDuration(p) : 'Aucune'}</button>`).join('')}
        <label class="chip chip-input"><input name="pauseCustom" inputmode="numeric" placeholder="Autre" maxlength="3"><span>min</span></label>
      </div>
    </section>

    <section class="card">
      <div class="inline-row"><span class="inline-label">${icon('meal', 20)} Panier repas</span>${seg('meal', [['auto', 'Auto'], ['yes', 'Oui'], ['no', 'Non']], f.meal, 'small')}</div>
      <p class="hint" data-meal-hint></p>
      <label class="note-field"><textarea name="note" rows="2" maxlength="500" placeholder="Note (facultatif) : chantier, remplacement, client…">${esc(f.note || '')}</textarea></label>
    </section>

    ${isNew ? `<section class="card"><div class="card-head"><h3>${icon('copy', 20)} Répéter cette semaine</h3></div><div class="chips days" data-repeat></div><p class="hint">Crée aussi la même journée sur les jours cochés.</p></section>` : ''}

    <section class="card preview" data-preview></section>
    <div class="form-actions"><button class="btn primary big" data-act="save">${icon('check', 20)} ${isNew ? 'Enregistrer la journée' : 'Enregistrer'}</button></div>
  </div>`;

  const q = (sel) => root.querySelector(sel);
  const inputs = { date: q('[name=date]'), start: q('[name=start]'), end: q('[name=end]'), note: q('[name=note]'), pauseCustom: q('[name=pauseCustom]') };

  for (const inp of [inputs.date, inputs.start, inputs.end]) {
    inp.closest('label').addEventListener('click', (e) => {
      if (e.target === inp) return;
      try {
        inp.showPicker();
      } catch {
        inp.focus();
      }
    });
  }

  const update = () => {
    const m = normalizeMission(store.mission(f.missionId));
    q('[data-date-label]').textContent = isValidIso(f.date) ? cap(fmtDateLong(f.date)) : 'Choisir une date';
    const tags = [];
    if (isValidIso(f.date)) {
      if (weekday(f.date) === 6) tags.push(`<span class="t-sun">Dimanche${m.sunday.enabled ? ` +${pct(m.sunday.pct)}` : ''}</span>`);
      const h = holidayName(f.date, m.holiday.alsace);
      if (h) tags.push(`<span class="t-hol">${esc(h)}${m.holiday.enabled ? ` +${pct(m.holiday.pct)}` : ''}</span>`);
      if (f.date === todayIso()) tags.push('<span>Aujourd’hui</span>');
    }
    q('[data-date-tags]').innerHTML = tags.join(' · ');
    q('[data-t=start]').textContent = f.start;
    q('[data-t=end]').textContent = f.end;
    const sp = span(f);
    q('[data-next]').hidden = !sp?.overnight;
    root.querySelectorAll('[data-p]').forEach((b) => b.classList.toggle('on', Number(b.dataset.p) === f.pause));
    const custom = !PAUSES.includes(f.pause);
    q('.chip-input').classList.toggle('on', custom);
    if (custom && document.activeElement !== inputs.pauseCustom) inputs.pauseCustom.value = String(f.pause);
    if (!custom && document.activeElement !== inputs.pauseCustom) inputs.pauseCustom.value = '';
    q('[data-pause-label]').textContent = f.pause ? `${fmtDuration(f.pause)} non payée${f.pause > 1 ? 's' : ''}` : 'Pas de pause';
    q('[data-meal-hint]').textContent = !m.meal.enabled
      ? f.meal === 'yes'
        ? `Panier forcé pour ce jour (${money(m.meal.amount)}).`
        : 'Le panier repas est désactivé pour cette mission.'
      : f.meal === 'auto'
        ? `Règle de la mission : ${money(m.meal.amount)} ${m.meal.rule === 'day' ? 'chaque jour travaillé' : `dès ${num2(m.meal.minHours).replace(',00', '')} h travaillées`}.`
        : f.meal === 'yes'
          ? 'Panier compté ce jour, quelle que soit la durée.'
          : 'Pas de panier ce jour.';
    if (isNew) drawRepeat();
    drawPreview(m, sp);
  };

  function drawRepeat() {
    const box = q('[data-repeat]');
    if (!isValidIso(f.date)) {
      box.innerHTML = '';
      return;
    }
    const ws = weekStart(f.date);
    repeat = new Set([...repeat].filter((d) => weekStart(d) === ws && d !== f.date));
    box.innerHTML = Array.from({ length: 7 }, (_, i) => {
      const d = addDays(ws, i);
      const [, mo, dd] = ymd(d);
      const dis = d === f.date;
      return `<button type="button" class="chip day ${repeat.has(d) || dis ? 'on' : ''} ${dis ? 'fixed' : ''}" data-r="${d}" ${dis ? 'disabled' : ''}><b>${DAYS_SHORT[i].slice(0, 3)}</b><small>${dd} ${MONTHS_SHORT[mo - 1]}</small></button>`;
    }).join('');
  }

  function drawPreview(m, sp) {
    const box = q('[data-preview]');
    if (!sp || !isValidIso(f.date)) {
      box.innerHTML = '<p class="muted">Renseigne la date et les horaires.</p>';
      return;
    }
    if (sp.net <= 0) {
      box.innerHTML = `<p class="warn">${icon('info', 18)} La journée doit durer plus longtemps que la pause.</p>`;
      return;
    }
    const others = store.get().entries.filter((e) => e.id !== f.id);
    const draft = { ...f, id: '__draft' };
    const r = computeMission(m, [...others, draft]).get('__draft');
    const warn = [];
    const overlap = others.find((e) => {
      const o = span(e);
      return o && o.start < sp.end && sp.start < o.end;
    });
    if (overlap) warn.push(`Chevauche une autre journée (${esc(store.mission(overlap.missionId)?.name || '')} ${overlap.start} → ${overlap.end}).`);
    if (sp.net > 13 * 60) warn.push('Plus de 13 h travaillées : vérifie les horaires.');
    const ln = (label, val, cls = '') => `<div class="pv-line ${cls}"><span>${label}</span><b class="num">${val}</b></div>`;
    const lines = [];
    if (m.rate) {
      lines.push(ln(`Base · ${fmtDuration(r.net)} × ${money(m.rate)}`, money(r.base)));
      if (r.sup1 >= 0.5) lines.push(ln(`Heures sup. +${pct(m.overtime.t1.pct)} · ${fmtDuration(r.sup1)}`, `+${money(r.majo.sup1)}`, 't-sup'));
      if (r.sup2 >= 0.5) lines.push(ln(`Heures sup. +${pct(m.overtime.t2.pct)} · ${fmtDuration(r.sup2)}`, `+${money(r.majo.sup2)}`, 't-sup'));
      if (r.night >= 0.5) lines.push(ln(`Nuit +${pct(m.night.pct)} · ${fmtDuration(r.night)}`, `+${money(r.majo.night)}`, 't-night'));
      if (m.sunday.enabled && r.sunday >= 0.5) lines.push(ln(`Dimanche +${pct(m.sunday.pct)} · ${fmtDuration(r.sunday)}`, `+${money(r.majo.sunday)}`, 't-sun'));
      if (m.holiday.enabled && r.holiday >= 0.5) lines.push(ln(`Férié +${pct(m.holiday.pct)} · ${fmtDuration(r.holiday)}`, `+${money(r.majo.holiday)}`, 't-hol'));
      if (m.stacking === 'max' && lines.length > 2) lines.push('<p class="hint">Cumul : seule la majoration la plus forte compte pour chaque heure.</p>');
    }
    const extras = [];
    if (r.meal) extras.push(ln(`${icon('meal', 15)} Panier repas`, money(r.meal)));
    if (r.travel) extras.push(ln(`${icon('car', 15)} Trajet`, money(r.travel)));
    box.innerHTML = `<div class="pv-top">
        <div><span class="kpi display num">${fmtDuration(r.net)}</span><small>travaillées${sp.pause ? ` · ${fmtDuration(sp.gross)} sur place` : ''}</small></div>
        ${m.rate ? `<div class="right"><span class="kpi display num accent">${money(r.amount)}</span><small>brut estimé</small></div>` : ''}
      </div>
      ${lines.length ? `<div class="pv-lines">${lines.join('')}</div>` : ''}
      ${extras.length ? `<div class="pv-lines extra">${extras.join('')}<p class="hint">Indemnités en plus du brut, en général non soumises à cotisations.</p></div>` : ''}
      ${!m.rate ? `<p class="hint">Ajoute un taux horaire à la mission pour voir les montants.</p>` : ''}
      ${warn.map((w) => `<p class="warn">${icon('info', 18)} ${w}</p>`).join('')}`;
  }

  // ---- événements
  bindChips(root, 'mission', (v) => {
    f.missionId = v;
    haptic('select');
    update();
  });
  bindSeg(root, 'meal', (v) => {
    f.meal = v;
    update();
  });
  inputs.date.addEventListener('change', () => {
    if (isValidIso(inputs.date.value)) f.date = inputs.date.value;
    update();
  });
  for (const k of ['start', 'end']) {
    inputs[k].addEventListener('input', () => {
      if (parseHM(inputs[k].value) !== null) f[k] = inputs[k].value;
      update();
    });
  }
  root.querySelectorAll('[data-add]').forEach((b) => {
    b.onclick = () => {
      const e = parseHM(f.end);
      f.end = fmtHM(e + Number(b.dataset.add));
      inputs.end.value = f.end;
      haptic('select');
      update();
    };
  });
  q('[data-pauses]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-p]');
    if (!b) return;
    f.pause = Number(b.dataset.p);
    inputs.pauseCustom.value = '';
    haptic('select');
    update();
  });
  inputs.pauseCustom.addEventListener('input', () => {
    const v = parseInt(inputs.pauseCustom.value, 10);
    f.pause = Number.isFinite(v) ? Math.min(Math.max(v, 0), 600) : 0;
    update();
  });
  inputs.note.addEventListener('input', () => {
    f.note = inputs.note.value;
  });
  q('[data-repeat]')?.addEventListener('click', (e) => {
    const b = e.target.closest('[data-r]');
    if (!b || b.disabled) return;
    const d = b.dataset.r;
    if (repeat.has(d)) repeat.delete(d);
    else repeat.add(d);
    haptic('select');
    drawRepeat();
  });

  q('[data-act=save]').onclick = () => {
    const sp = span(f);
    if (!isValidIso(f.date) || !sp) return toast('Date ou horaires invalides.', { kind: 'err' });
    if (sp.net <= 0) return toast('La pause est plus longue que la journée.', { kind: 'err' });
    store.saveEntry(f);
    if (isNew && repeat.size) {
      store.saveEntries([...repeat].map((d) => ({ ...f, id: undefined, date: d })));
    }
    haptic('success');
    toast(isNew ? (repeat.size ? `${repeat.size + 1} journées enregistrées` : 'Journée enregistrée') : 'Modifications enregistrées');
    back('#/history');
  };

  q('[data-act=del]')?.addEventListener('click', async () => {
    if (!(await confirmSheet({ title: 'Supprimer cette journée ?', text: esc(cap(fmtDateLong(f.date))), ok: 'Supprimer', danger: true }))) return;
    const removed = store.deleteEntry(f.id);
    back('#/history');
    toast('Journée supprimée', { action: 'Annuler', onAction: () => store.saveEntry(removed) });
  });

  q('[data-act=dup]')?.addEventListener('click', () => {
    sheet({
      title: 'Dupliquer la journée',
      html: `<p class="sheet-text">Mêmes horaires (${esc(f.start)} → ${esc(f.end)}, pause ${fmtDuration(f.pause, { zero: 'aucune' })}) à une autre date.</p>
        <label class="field"><span class="field-label">Date</span><span class="field-box"><input type="date" name="d" value="${esc(addDays(f.date, 1))}"></span></label>
        <div class="sheet-actions"><button class="btn primary" data-ok>${icon('copy', 18)} Dupliquer</button></div>`,
      onMount(el, sh) {
        el.querySelector('[data-ok]').onclick = () => {
          const d = el.querySelector('[name=d]').value;
          if (!isValidIso(d)) return;
          store.saveEntry({ ...f, id: undefined, date: d });
          haptic('success');
          sh.close();
          toast(`Copiée au ${cap(fmtDateLong(d))}`);
        };
      },
    });
  });

  update();
}
