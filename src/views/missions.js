// Missions : liste, édition, et une page par majoration / indemnité.
import * as store from '../core/store.js';
import { normalizeMission, computeMission, CONTRACTS, MISSION_COLORS } from '../core/calc.js';
import { fmtDuration, parseHM, todayIso, fmtDateLong, cap } from '../core/time.js';
import { holidays } from '../core/holidays.js';
import { icon } from '../ui/icons.js';
import { esc, money, pct, numShort, parseDecimal, toast, confirmSheet, plural } from '../ui/dom.js';
import { bigHead, subHead, row, seg, bindSeg, switchEl, field, info, contractLabel, emptyState } from '../ui/components.js';
import { go, back } from '../ui/nav.js';
import { haptic } from '../platform.js';

export const liveRefresh = false;

let draft = null; // { isNew, data }

// ---- liste ------------------------------------------------------------------------------------

export function renderList(root) {
  draft = null;
  const s = store.get();
  const activeList = s.missions.filter((m) => !m.archived);
  const archived = s.missions.filter((m) => m.archived);
  const counts = new Map();
  for (const e of s.entries) counts.set(e.missionId, (counts.get(e.missionId) || 0) + 1);
  const card = (raw) => {
    const m = normalizeMission(raw);
    const tags = [];
    if (m.overtime.enabled) tags.push(`Sup. dès ${numShort(m.overtime.t1.from)} h ${m.overtime.basis === 'day' ? '/ jour' : ''}`);
    if (m.night.enabled) tags.push(`Nuit +${pct(m.night.pct)}`);
    if (m.sunday.enabled) tags.push(`Dimanche +${pct(m.sunday.pct)}`);
    if (m.holiday.enabled) tags.push(`Férié +${pct(m.holiday.pct)}`);
    if (m.meal.enabled) tags.push(`Panier ${money(m.meal.amount)}`);
    return `<button class="mission-card" data-go="#/mission/${esc(m.id)}" style="--mc:${esc(m.color)}">
      <span class="mc-bar"></span>
      <span class="mc-main">
        <span class="mc-top"><b>${esc(m.name || 'Mission sans nom')}</b><span class="badge">${esc(contractLabel(m.contract))}</span></span>
        <span class="mc-rate num">${m.rate ? `${money(m.rate)} / h brut` : 'Taux horaire à renseigner'}</span>
        <span class="mc-tags">${tags.map((t) => `<i>${esc(t)}</i>`).join('')}</span>
        <small class="muted">${plural(counts.get(m.id) || 0, 'journée', 'journées')}</small>
      </span>
      ${icon('chevron', 18, 'row-chev')}
    </button>`;
  };
  root.innerHTML = `${bigHead('Missions', { actions: `<button class="ic-btn" data-go="#/mission/new" aria-label="Nouvelle mission">${icon('plus', 26)}</button>` })}
    ${
      activeList.length
        ? `<div class="mission-list">${activeList.map(card).join('')}</div>`
        : emptyState({ ic: 'missions', title: 'Aucune mission', text: 'Une mission = un employeur ou une agence, avec son taux horaire et ses majorations.', action: 'Créer une mission', act: 'new' })
    }
    <button class="btn soft wide" data-go="#/mission/new">${icon('plus', 18)} Nouvelle mission</button>
    ${archived.length ? `<h4 class="group">Archivées</h4><div class="mission-list archived">${archived.map(card).join('')}</div>` : ''}`;
  root.querySelector('[data-act=new]')?.addEventListener('click', () => go('#/mission/new'));
}

// ---- brouillon ---------------------------------------------------------------------------------

function getDraft(id) {
  if (id === 'new') {
    if (!draft || !draft.isNew) {
      draft = { isNew: true, data: normalizeMission({ id: '', color: store.nextColor(), contract: 'interim', night: { enabled: false } }) };
    }
    return draft;
  }
  const m = store.mission(id);
  if (!m) return null;
  if (!draft || draft.isNew || draft.data.id !== id) draft = { isNew: false, data: normalizeMission(structuredClone(m)) };
  return draft;
}

let saveTimer = null;
function persist(now = false) {
  if (!draft || draft.isNew) return;
  clearTimeout(saveTimer);
  const run = () => {
    draft.data = store.saveMission(draft.data);
  };
  if (now) run();
  else saveTimer = setTimeout(run, 350);
}

const onOff = (on, val) => (on ? val : '<span class="off">Désactivé</span>');

// ---- éditeur -----------------------------------------------------------------------------------

export function renderEditor(root, route) {
  const id = route.parts[1];
  const d = getDraft(id);
  if (!d) {
    root.innerHTML = `${subHead('Mission')}<div class="empty"><h3>Mission introuvable</h3></div>`;
    return;
  }
  const m = d.data;
  const isNew = d.isNew;
  const base = `#/mission/${isNew ? 'new' : m.id}`;
  const endName = m.contract === 'cdd' ? 'Fin de contrat (précarité)' : m.contract === 'interim' ? 'Fin de mission (IFM)' : 'Prime de fin de contrat';
  const ot = m.overtime;

  root.innerHTML = `${subHead(isNew ? 'Nouvelle mission' : 'Modifier la mission')}
  <div class="form">
    ${field({ label: 'Nom de la mission', name: 'name', value: m.name, inputmode: 'text', placeholder: 'Ex. : Agent de quai — Manpower' })}
    <div class="field"><span class="field-label">Type de contrat</span>${seg('contract', Object.entries(CONTRACTS).map(([k, v]) => [k, v.label]), m.contract, 'wide accent')}</div>
    ${field({ label: 'Taux horaire brut', name: 'rate', value: m.rate ? String(m.rate).replace('.', ',') : '', suffix: '€/h', placeholder: '0,00' })}
    <div class="field"><span class="field-label">Couleur</span><div class="swatches">${MISSION_COLORS.map((c) => `<button type="button" class="swatch ${c === m.color ? 'on' : ''}" data-color="${c}" style="--c:${c}" aria-label="Couleur ${c}"></button>`).join('')}</div></div>

    <h4 class="group">Majorations</h4>
    <div class="card list">
      ${row({ go: `${base}/overtime`, ic: 'plusCircle', icCls: 't-sup', title: 'Heures supplémentaires', sub: ot.enabled ? `Dès ${numShort(ot.t1.from)} h par ${ot.basis === 'day' ? 'jour' : 'semaine'}${ot.t2.enabled ? `, puis ${numShort(ot.t2.from)} h` : ''}` : 'Impacte le calcul du montant', value: onOff(ot.enabled, `${pct(ot.t1.pct)}${ot.t2.enabled ? ` / ${pct(ot.t2.pct)}` : ''}`), valueCls: 't-sup' })}
      ${row({ go: `${base}/night`, ic: 'moon', icCls: 't-night', title: 'Travail de nuit', sub: m.night.enabled ? `De ${m.night.start} à ${m.night.end}` : 'Heures dans une plage horaire', value: onOff(m.night.enabled, pct(m.night.pct)), valueCls: 't-night' })}
      ${row({ go: `${base}/sunday`, ic: 'calendar', icCls: 't-sun', title: 'Travail le dimanche', sub: 'Majoration des heures du dimanche', value: onOff(m.sunday.enabled, pct(m.sunday.pct)), valueCls: 't-sun' })}
      ${row({ go: `${base}/holiday`, ic: 'flag', icCls: 't-hol', title: 'Jours fériés', sub: m.holiday.alsace ? 'Avec Alsace-Moselle' : 'Calendrier français', value: onOff(m.holiday.enabled, pct(m.holiday.pct)), valueCls: 't-hol' })}
    </div>

    <h4 class="group">Indemnités</h4>
    <div class="card list">
      ${row({ go: `${base}/meal`, ic: 'meal', title: 'Panier repas', sub: 'Indemnité repas', value: onOff(m.meal.enabled, `${money(m.meal.amount)} · ${m.meal.rule === 'day' ? 'chaque jour' : `dès ${numShort(m.meal.minHours)} h`}`), valueCls: 'accent' })}
      ${row({ go: `${base}/travel`, ic: 'car', title: 'Indemnité de trajet', sub: 'Montant fixe par jour travaillé', value: onOff(m.travel.enabled, `${money(m.travel.amount)} / jour`), valueCls: 'accent' })}
      ${row({ go: `${base}/endbonus`, ic: 'door', title: endName, sub: 'Sur le brut de la période', value: onOff(m.endBonus.enabled, pct(m.endBonus.pct)), valueCls: 'accent' })}
      ${row({ go: `${base}/paidleave`, ic: 'beach', title: 'Congés payés (ICCP)', sub: 'Indemnité compensatrice', value: onOff(m.paidLeave.enabled, pct(m.paidLeave.pct)), valueCls: 'accent' })}
    </div>

    <h4 class="group">Réglages facultatifs</h4>
    <div class="card list">
      ${row({ go: `${base}/pay`, ic: 'wallet', title: 'Période de paie', value: m.payStartDay > 1 ? `Du ${m.payStartDay} au ${m.payStartDay - 1}` : 'Mois complet' })}
      ${row({ go: `${base}/defaults`, ic: 'clock', title: 'Horaires et pause par défaut', value: `${m.defaultStart} → ${m.defaultEnd} · ${fmtDuration(m.defaultPause, { zero: '0 min' })}` })}
      ${row({ go: `${base}/stacking`, ic: 'layers', title: 'Cumul des majorations', value: m.stacking === 'max' ? 'La plus forte' : 'Additionnées' })}
    </div>

    ${
      isNew
        ? `<div class="form-actions"><button class="btn primary big" data-act="create">${icon('check', 20)} Créer la mission</button></div>`
        : `<div class="card list">
            ${row({ act: 'archive', ic: 'archive', title: m.archived ? 'Réactiver la mission' : 'Archiver la mission', sub: m.archived ? 'Elle réapparaîtra dans la pointeuse et la saisie' : 'Masquée de la pointeuse, journées conservées' })}
            ${row({ act: 'delete', ic: 'trash', title: 'Supprimer la mission', sub: 'Et toutes ses journées', danger: true })}
          </div>`
    }
  </div>`;

  const nameEl = root.querySelector('[name=name]');
  const rateEl = root.querySelector('[name=rate]');
  nameEl.addEventListener('input', () => {
    m.name = nameEl.value.slice(0, 60);
    persist();
  });
  rateEl.addEventListener('input', () => {
    const v = parseDecimal(rateEl.value);
    m.rate = v !== null && v >= 0 ? v : 0;
    persist();
  });
  bindSeg(root, 'contract', (v) => {
    m.contract = v;
    const withEnd = v === 'interim' || v === 'cdd';
    m.endBonus.enabled = withEnd;
    m.paidLeave.enabled = withEnd;
    haptic('select');
    persist(true);
    renderEditor(root, route);
    if (withEnd) toast(`${v === 'cdd' ? 'Prime de précarité' : 'IFM'} et congés payés (10 % + 10 %) activés.`);
  });
  root.querySelectorAll('[data-color]').forEach((b) => {
    b.onclick = () => {
      m.color = b.dataset.color;
      root.querySelectorAll('[data-color]').forEach((x) => x.classList.toggle('on', x === b));
      haptic('select');
      persist();
    };
  });
  root.querySelector('[data-act=create]')?.addEventListener('click', () => {
    if (!m.name.trim()) {
      nameEl.focus();
      return toast('Donne un nom à la mission.', { kind: 'err' });
    }
    const saved = store.saveMission({ ...m, id: '' });
    store.setSettings({ lastMissionId: saved.id, welcomed: true });
    draft = null;
    haptic('success');
    toast(m.rate ? 'Mission créée' : 'Mission créée — pense au taux horaire pour voir les montants');
    back('#/missions');
  });
  root.querySelector('[data-act=archive]')?.addEventListener('click', () => {
    m.archived = !m.archived;
    persist(true);
    toast(m.archived ? 'Mission archivée' : 'Mission réactivée');
    renderEditor(root, route);
  });
  root.querySelector('[data-act=delete]')?.addEventListener('click', async () => {
    const n = store.get().entries.filter((e) => e.missionId === m.id).length;
    if (!(await confirmSheet({ title: `Supprimer « ${esc(m.name)} » ?`, text: n ? `${plural(n, 'journée sera supprimée', 'journées seront supprimées')} avec elle. Pense à exporter une sauvegarde avant.` : 'Aucune journée enregistrée pour cette mission.', ok: 'Supprimer', danger: true }))) return;
    store.deleteMission(m.id);
    draft = null;
    toast('Mission supprimée');
    back('#/missions');
  });
}

// ---- sous-pages ----------------------------------------------------------------------------------

const TITLES = {
  overtime: 'Heures supplémentaires',
  night: 'Heures de nuit',
  sunday: 'Travail le dimanche',
  holiday: 'Jours fériés',
  meal: 'Panier repas',
  travel: 'Indemnité de trajet',
  endbonus: 'Fin de mission',
  paidleave: 'Congés payés',
  pay: 'Période de paie',
  defaults: 'Par défaut',
  stacking: 'Cumul des majorations',
};

export function renderSection(root, route) {
  const [, id, section] = route.parts;
  const d = getDraft(id);
  if (!d || !TITLES[section]) {
    root.innerHTML = `${subHead('Réglage')}<div class="empty"><h3>Page introuvable</h3></div>`;
    return;
  }
  const m = d.data;
  const title = section === 'endbonus' ? (m.contract === 'cdd' ? 'Fin de contrat' : m.contract === 'interim' ? 'Fin de mission' : 'Prime de fin') : TITLES[section];

  const draw = () => {
    root.innerHTML = `${subHead(title)}<div class="form">${SECTIONS[section](m)}</div>`;
    bind();
  };

  const bind = () => {
    // interrupteurs : data-path="overtime.enabled"
    root.querySelectorAll('.switch input').forEach((inp) => {
      inp.addEventListener('change', () => {
        setPath(m, inp.name, inp.checked);
        haptic('select');
        persist(true);
        draw();
      });
    });
    // champs numériques : name = chemin
    root.querySelectorAll('input[data-num]').forEach((inp) => {
      inp.addEventListener('input', () => {
        const v = parseDecimal(inp.value);
        if (v === null) return;
        const [min, max] = (inp.dataset.num || '0,1000').split(',').map(Number);
        setPath(m, inp.name, Math.min(Math.max(v, min), max));
        persist();
        refreshExample();
      });
      // pas de redessin ici : un « change » arrive au moment où l'on touche un autre bouton
      inp.addEventListener('change', () => {
        const val = inp.name.split('.').reduce((o, k) => o?.[k], m);
        if (typeof val === 'number') inp.value = numShort(val);
      });
    });
    root.querySelectorAll('input[type=time][data-hm]').forEach((inp) => {
      inp.closest('label')?.addEventListener('click', (e) => {
        if (e.target === inp) return;
        try {
          inp.showPicker();
        } catch {
          inp.focus();
        }
      });
      inp.addEventListener('input', () => {
        if (parseHM(inp.value) === null) return;
        setPath(m, inp.name, inp.value);
        persist();
        const b = inp.parentElement.querySelector('b');
        if (b) b.textContent = inp.value;
        refreshExample();
      });
    });
    root.querySelectorAll('[data-seg]').forEach((el) => {
      bindSeg(root, el.dataset.seg, (v) => {
        setPath(m, el.dataset.seg, v);
        haptic('select');
        persist(true);
        draw();
      });
    });
    root.querySelectorAll('[data-radio]').forEach((b) => {
      b.addEventListener('click', () => {
        setPath(m, b.dataset.radio, coerce(b.dataset.v));
        haptic('select');
        persist(true);
        draw();
      });
    });
    root.querySelectorAll('[data-set]').forEach((b) => {
      b.addEventListener('click', () => {
        for (const pair of b.dataset.set.split('|')) {
          const [k, v] = pair.split('=');
          setPath(m, k, coerce(v));
        }
        haptic('select');
        persist(true);
        draw();
      });
    });
  };

  const refreshExample = () => {
    const el = root.querySelector('[data-example]');
    if (el && EXAMPLES[section]) el.innerHTML = EXAMPLES[section](m);
  };

  draw();
}

const coerce = (v) => (v === 'true' ? true : v === 'false' ? false : /^-?\d+(\.\d+)?$/.test(v) ? Number(v) : v);

function setPath(obj, path, val) {
  const ks = path.split('.');
  let o = obj;
  for (let i = 0; i < ks.length - 1; i++) o = o[ks[i]];
  o[ks[ks.length - 1]] = val;
}

const numField = (label, name, value, suffix, range = '0,500') => field({ label, name, value: String(value).replace('.', ','), suffix, attrs: `data-num="${range}"` });

function toggleHead(title, name, on, sub = '') {
  return `<div class="toggle-head">
    <div><b>${esc(title)}</b><span class="${on ? 'on' : 'off'}">${on ? 'Activé' : 'Désactivé'}</span>${sub ? `<small>${sub}</small>` : ''}</div>
    ${switchEl(name, on, title)}
  </div>`;
}

const example = (html, ic = 'info') => `<div class="note accent-note">${icon(ic, 20)}<p data-example>${html}</p></div>`;

function radioCard(path, value, current, title, sub) {
  const on = String(value) === String(current);
  return `<button type="button" class="radio-card ${on ? 'on' : ''}" data-radio="${path}" data-v="${esc(value)}"><i class="radio"></i><span><b>${esc(title)}</b><small>${sub}</small></span></button>`;
}

function sampleCompute(m, entry, patch = {}) {
  const mm = normalizeMission({ ...m, id: 'x', overtime: { enabled: false }, sunday: { enabled: false }, holiday: { enabled: false }, night: { enabled: false }, ...patch });
  return computeMission(mm, [{ id: 'e', missionId: 'x', pause: 0, ...entry }]).get('e');
}

const EXAMPLES = {
  overtime(m) {
    const o = m.overtime;
    const unit = o.basis === 'day' ? 'journée' : 'semaine';
    if (o.t2.enabled && o.t2.from > o.t1.from) {
      const tot = o.t2.from + 3;
      return `Exemple : une ${unit} de ${numShort(tot)} h donne ${numShort(o.t2.from - o.t1.from)} h à ${pct(o.t1.pct)} et 3 h à ${pct(o.t2.pct)}.`;
    }
    const tot = o.t1.from + (o.basis === 'day' ? 2 : 5);
    return `Exemple : avec un seuil à ${numShort(o.t1.from)} h, une ${unit} de ${numShort(tot)} h donne ${numShort(tot - o.t1.from)} h à ${pct(o.t1.pct)}.`;
  },
  night(m) {
    const r = sampleCompute(m, { date: '2026-01-07', start: '22:00', end: '06:00' }, { night: { ...m.night, enabled: true } });
    return `Exemple : si tu travailles de 22:00 à 06:00, ${fmtDuration(r.night)} tombent dans la plage ${m.night.start} → ${m.night.end} et reçoivent +${pct(m.night.pct)}.`;
  },
  sunday(m) {
    return m.split === 'real'
      ? `Une nuit du samedi 21:00 au dimanche 05:00 : seules les 5 h après minuit sont majorées de ${pct(m.sunday.pct)}.`
      : `Le dimanche est détecté selon la date de la journée : une journée qui commence un dimanche est majorée de ${pct(m.sunday.pct)} en entier.`;
  },
  holiday(m) {
    return `Une journée de 7 h un jour férié : 7 h payées +${pct(m.holiday.pct)}${m.rate ? ` (soit ${money(7 * m.rate * (1 + m.holiday.pct / 100))} brut)` : ''}.`;
  },
  meal(m) {
    return m.meal.rule === 'day'
      ? `Exemple : que tu travailles 2 h, 5 h ou 9 h, tu as un panier de ${money(m.meal.amount)} ce jour-là.`
      : `Exemple : ${numShort(Math.max(m.meal.minHours - 1, 0))} h travaillées → pas de panier ; ${numShort(m.meal.minHours)} h ou plus → ${money(m.meal.amount)}.`;
  },
  travel(m) {
    return `Ajouté une fois par jour travaillé : 20 jours × ${money(m.travel.amount)} = ${money(20 * m.travel.amount)}.`;
  },
  endbonus(m) {
    return `Sur un brut de 2 000 €, ${pct(m.endBonus.pct)} = ${money((2000 * m.endBonus.pct) / 100)} en plus.`;
  },
  paidleave(m) {
    const ifm = m.endBonus.enabled ? (2000 * m.endBonus.pct) / 100 : 0;
    return `Sur un brut de 2 000 €${ifm ? ` + ${money(ifm)} de fin de mission` : ''}, ${pct(m.paidLeave.pct)} = ${money(((2000 + ifm) * m.paidLeave.pct) / 100)}.`;
  },
  stacking(m) {
    return m.stacking === 'max' ? 'Une heure de nuit un dimanche (+25 % et +50 %) est payée +50 % seulement.' : 'Une heure de nuit un dimanche (+25 % et +50 %) est payée +75 %.';
  },
};

const SPLIT = (m) => `<div class="field"><span class="field-label">Nuit du samedi au dimanche (ou veille de férié)</span>${seg('split', [['start', 'Selon le jour de début'], ['real', 'Heure par heure']], m.split, 'wide small2')}</div>`;

const SECTIONS = {
  overtime(m) {
    const o = m.overtime;
    return `<section class="card">
      ${toggleHead('Activer les heures sup.', 'overtime.enabled', o.enabled)}
      ${
        o.enabled
          ? `<div class="field"><span class="field-label">Seuil calculé</span>${seg('overtime.basis', [['week', 'Par semaine'], ['day', 'Par jour']], o.basis, 'wide')}</div>
        <div class="tier"><h4>Palier 1</h4><div class="two">${numField('À partir de', 'overtime.t1.from', o.t1.from, o.basis === 'day' ? 'h / jour' : 'h / sem.', '0,168')}${numField('Majoration', 'overtime.t1.pct', o.t1.pct, '%')}</div></div>
        <div class="tier">${toggleHead('Palier 2', 'overtime.t2.enabled', o.t2.enabled, 'Ex. : +50 % au-delà de 43 h')}
          ${o.t2.enabled ? `<div class="two">${numField('À partir de', 'overtime.t2.from', o.t2.from, o.basis === 'day' ? 'h / jour' : 'h / sem.', '0,168')}${numField('Majoration', 'overtime.t2.pct', o.t2.pct, '%')}</div>` : ''}
        </div>
        ${example(EXAMPLES.overtime(m), 'plusCircle')}`
          : ''
      }
    </section>
    ${info('Les heures au-delà du seuil sont majorées, dans l’ordre chronologique de la semaine (du lundi au dimanche). Le bouton <b>+ Heures sup.</b> de la saisie ajoute du temps à l’heure de fin : ce temps n’est majoré que si ta semaine dépasse le seuil.')}
    ${info('Repère : sans accord d’entreprise, +25 % de la 36ᵉ à la 43ᵉ heure, puis +50 %. Un accord peut prévoir un autre taux (10 % minimum).', 'shield')}`;
  },
  night(m) {
    return `<section class="card">
      ${toggleHead('Activer les heures de nuit', 'night.enabled', m.night.enabled, 'L’appli détecte automatiquement les heures comprises dans cette plage.')}
      ${
        m.night.enabled
          ? `<span class="field-label">Plage de nuit</span>
        <div class="time-pair">
          <label class="time-box tap"><input type="time" name="night.start" data-hm value="${esc(m.night.start)}"><b class="display num accent">${esc(m.night.start)}</b><small>Début</small></label>
          <span class="time-arrow">${icon('arrow', 22)}</span>
          <label class="time-box tap"><input type="time" name="night.end" data-hm value="${esc(m.night.end)}"><b class="display num t-sun">${esc(m.night.end)}</b><small>Fin</small></label>
        </div>
        <div class="chips wrap presets">
          <button type="button" class="chip" data-set="night.start=21:00|night.end=06:00">21 h – 6 h</button>
          <button type="button" class="chip" data-set="night.start=22:00|night.end=05:00">22 h – 5 h</button>
          <button type="button" class="chip" data-set="night.start=21:00|night.end=07:00">21 h – 7 h</button>
          <button type="button" class="chip" data-set="night.start=20:00|night.end=06:00">20 h – 6 h</button>
        </div>
        ${numField('Majoration', 'night.pct', m.night.pct, '%')}
        ${example(EXAMPLES.night(m), 'moon')}`
          : ''
      }
    </section>
    ${info('Sans accord collectif, le travail de nuit va de 21 h à 6 h. Le taux de majoration dépend de ta convention (souvent entre 10 % et 30 %).', 'shield')}`;
  },
  sunday(m) {
    return `<section class="card">
      ${toggleHead('Majoration du dimanche', 'sunday.enabled', m.sunday.enabled, 'Appliquée automatiquement quand la journée tombe un dimanche.')}
      ${m.sunday.enabled ? `${numField('Majoration', 'sunday.pct', m.sunday.pct, '%')}${SPLIT(m)}${example(EXAMPLES.sunday(m), 'calendar')}` : ''}
    </section>
    ${info('Le dimanche est détecté selon la date de la journée. Cette option reste facultative : le Code du travail n’impose pas de taux général, ta convention ou ton contrat le fixe.')}`;
  },
  holiday(m) {
    const t = todayIso();
    const y = Number(t.slice(0, 4));
    const list = [...holidays(y, m.holiday.alsace), ...holidays(y + 1, m.holiday.alsace)].filter(([d]) => d >= t).slice(0, 6);
    return `<section class="card">
      ${toggleHead('Majorer les jours fériés', 'holiday.enabled', m.holiday.enabled)}
      ${m.holiday.enabled ? `${numField('Majoration', 'holiday.pct', m.holiday.pct, '%')}${SPLIT(m)}${example(EXAMPLES.holiday(m), 'flag')}` : ''}
      <div class="toggle-head sub">
        <div><b>Alsace-Moselle</b><small>Ajoute le Vendredi saint et le 26 décembre.</small></div>
        ${switchEl('holiday.alsace', m.holiday.alsace, 'Alsace-Moselle')}
      </div>
    </section>
    <section class="card"><div class="card-head"><h3>Prochains jours fériés</h3></div>
      <div class="hol-list">${list.map(([d, n]) => `<div class="dl"><span>${esc(n)}</span><b>${esc(cap(fmtDateLong(d)))}</b></div>`).join('')}</div>
    </section>
    ${info('Seul le 1ᵉʳ mai est obligatoirement payé double quand il est travaillé. Pour les autres fériés, c’est ta convention qui fixe la majoration.', 'shield')}`;
  },
  meal(m) {
    return `<section class="card">
      ${toggleHead('Activer le panier repas', 'meal.enabled', m.meal.enabled, 'L’appli ajoute automatiquement ton panier selon la règle choisie.')}
      ${
        m.meal.enabled
          ? `${numField('Montant du panier', 'meal.amount', m.meal.amount, '€', '0,1000')}
        <span class="field-label">Règle</span>
        <div class="radios">
          ${radioCard('meal.rule', 'day', m.meal.rule, 'Chaque jour travaillé', 'Un panier chaque jour où tu travailles, peu importe la durée.')}
          ${radioCard('meal.rule', 'hours', m.meal.rule, 'À partir d’un nombre d’heures', 'Un panier seulement les jours où tu atteins ce seuil.')}
        </div>
        ${m.meal.rule === 'hours' ? numField('Seuil', 'meal.minHours', m.meal.minHours, 'h travaillées', '0,24') : ''}
        ${example(EXAMPLES.meal(m), 'meal')}`
          : ''
      }
    </section>
    ${info('Tu peux forcer ou retirer le panier sur une journée précise depuis la saisie (Auto / Oui / Non).')}`;
  },
  travel(m) {
    return `<section class="card">
      ${toggleHead('Indemnité de trajet', 'travel.enabled', m.travel.enabled, 'Montant fixe ajouté chaque jour travaillé (trajet, transport, petit déplacement…).')}
      ${m.travel.enabled ? `${numField('Montant par jour', 'travel.amount', m.travel.amount, '€', '0,1000')}${example(EXAMPLES.travel(m), 'car')}` : ''}
    </section>`;
  },
  endbonus(m) {
    const txt =
      m.contract === 'interim'
        ? 'L’indemnité de fin de mission (IFM) vaut 10 % de ta rémunération brute. Elle n’est pas due si tu es embauché en CDI par l’entreprise utilisatrice, si tu romps la mission ou en cas de faute grave.'
        : m.contract === 'cdd'
          ? 'La prime de précarité vaut 10 % de ta rémunération brute (parfois 6 % par accord). Elle n’est pas due en cas d’embauche en CDI, de CDD saisonnier ou de job pendant tes vacances scolaires ou universitaires.'
          : 'Une prime de fin de contrat n’existe que si ton contrat ou ta convention la prévoit.';
    return `<section class="card">
      ${toggleHead(m.contract === 'cdd' ? 'Prime de précarité' : m.contract === 'interim' ? 'Indemnité de fin de mission' : 'Prime de fin de contrat', 'endBonus.enabled', m.endBonus.enabled)}
      ${m.endBonus.enabled ? `${numField('Taux', 'endBonus.pct', m.endBonus.pct, '% du brut', '0,100')}${example(EXAMPLES.endbonus(m), 'door')}` : ''}
    </section>
    ${info(txt, 'shield')}`;
  },
  paidleave(m) {
    return `<section class="card">
      ${toggleHead('Indemnité de congés payés', 'paidLeave.enabled', m.paidLeave.enabled)}
      ${m.paidLeave.enabled ? `${numField('Taux', 'paidLeave.pct', m.paidLeave.pct, '%', '0,100')}${example(EXAMPLES.paidleave(m), 'beach')}` : ''}
    </section>
    ${info(m.contract === 'cdi' ? 'En CDI, tes congés sont pris et payés normalement : laisse cette option désactivée.' : 'L’ICCP compense les congés non pris : 10 % de la rémunération brute totale, fin de mission ou de contrat comprise.', 'shield')}`;
  },
  pay(m) {
    const s = m.payStartDay;
    return `<section class="card">
      <span class="field-label">Le résumé « Mois » suit cette période</span>
      <div class="radios">
        <button type="button" class="radio-card ${s === 1 ? 'on' : ''}" data-set="payStartDay=1"><i class="radio"></i><span><b>Mois complet</b><small>Du 1ᵉʳ au dernier jour du mois.</small></span></button>
        <button type="button" class="radio-card ${s > 1 ? 'on' : ''}" data-set="payStartDay=${s > 1 ? s : 21}"><i class="radio"></i><span><b>Période décalée</b><small>Fréquent en intérim : par exemple du 21 au 20.</small></span></button>
      </div>
      ${s > 1 ? `${numField('La période commence le', 'payStartDay', s, 'du mois', '2,28')}<div class="note accent-note">${icon('wallet', 20)}<p data-example>Paie d’octobre : du ${s} septembre au ${s - 1} octobre.</p></div>` : ''}
    </section>`;
  },
  defaults(m) {
    return `<section class="card">
      <span class="field-label">Horaires proposés pour une nouvelle journée</span>
      <div class="time-pair">
        <label class="time-box tap"><input type="time" name="defaultStart" data-hm value="${esc(m.defaultStart)}"><b class="display num">${esc(m.defaultStart)}</b><small>Début</small></label>
        <span class="time-arrow">${icon('arrow', 22)}</span>
        <label class="time-box tap"><input type="time" name="defaultEnd" data-hm value="${esc(m.defaultEnd)}"><b class="display num">${esc(m.defaultEnd)}</b><small>Fin</small></label>
      </div>
      <span class="field-label">Pause par défaut</span>
      <div class="chips wrap">${[0, 15, 20, 30, 45, 60, 90].map((p) => `<button type="button" class="chip ${m.defaultPause === p ? 'on' : ''}" data-set="defaultPause=${p}">${p ? fmtDuration(p) : 'Aucune'}</button>`).join('')}</div>
      ${numField('Ou une autre durée', 'defaultPause', m.defaultPause, 'min', '0,600')}
    </section>
    ${info('Une nouvelle journée reprend les horaires de ta dernière journée sur cette mission ; ceux-ci servent pour la toute première.')}`;
  },
  stacking(m) {
    return `<section class="card">
      <span class="field-label">Quand plusieurs majorations tombent sur la même heure</span>
      <div class="radios">
        ${radioCard('stacking', 'add', m.stacking, 'Les additionner', 'Nuit + dimanche + heure sup. : chaque majoration s’ajoute.')}
        ${radioCard('stacking', 'max', m.stacking, 'Garder la plus forte', 'Seule la majoration au taux le plus élevé est payée.')}
      </div>
      ${example(EXAMPLES.stacking(m), 'layers')}
      ${SPLIT(m)}
    </section>
    ${info('Les deux pratiques existent selon les conventions collectives. En cas de doute, compare avec ton bulletin de paie.', 'shield')}`;
  },
};

