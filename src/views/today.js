// Accueil : pointeuse, semaine en cours, mois en cours, dernières journées.
import * as store from '../core/store.js';
import { computeMission, computeAll, summarize, normalizeMission } from '../core/calc.js';
import { todayIso, nowHM, fmtDuration, weekRange, eachDay, DAYS_SHORT, cap, DAYS, MONTHS, ymd, payPeriod, isoWeek, pad, weekStart } from '../core/time.js';
import { holidayName } from '../core/holidays.js';
import { icon } from '../ui/icons.js';
import { esc, money, toast, confirmSheet } from '../ui/dom.js';
import { bigHead, missionChips, bindChips, entryCard, gearBtn } from '../ui/components.js';
import { go } from '../ui/nav.js';
import { haptic } from '../platform.js';
import { loadDemo } from '../core/demo.js';

let tick = null;

export function render(root) {
  clearInterval(tick);
  const s = store.get();
  const t = todayIso();
  const [, mo, d] = ymd(t);
  const head = bigHead("Aujourd'hui", { sub: `${cap(DAYS[(new Date().getDay() + 6) % 7])} ${d} ${MONTHS[mo - 1]}`, actions: gearBtn() });

  if (!s.missions.length) {
    root.innerHTML = `${head}${welcome()}`;
    root.querySelector('[data-act=demo]').onclick = () => {
      loadDemo();
      haptic('success');
      toast('Exemple chargé : explore, puis supprime-le quand tu veux.');
    };
    return;
  }

  const active = store.activeMissions();
  let sel = s.timer?.missionId || (active.some((m) => m.id === s.settings.lastMissionId) ? s.settings.lastMissionId : active[0]?.id) || s.missions[0].id;
  const all = computeAll(s.missions, s.entries);

  const draw = () => {
    const mission = normalizeMission(store.mission(sel) || s.missions[0]);
    root.innerHTML = `${head}
      ${timerCard(store.get().timer, mission, active)}
      ${weekCard(mission, all)}
      ${monthCard()}
      ${recent(all)}
      <button class="fab" data-go="#/entry/new?mission=${esc(mission.id)}" aria-label="Ajouter une journée">${icon('plus', 28)}</button>`;
    bindChips(root, 'mission', (v) => {
      sel = v;
      store.setSettings({ lastMissionId: v });
    });
    bindTimer(root, mission);
  };
  draw();
}

export function cleanup() {
  clearInterval(tick);
}

function welcome() {
  return `<section class="welcome card">
    <div class="welcome-mark" aria-hidden="true">${logo()}</div>
    <h2 class="display">Tes heures, ton brut,<br>sans calculette.</h2>
    <p>Fable compte tes heures sup par semaine, tes heures de nuit, tes dimanches et jours fériés, tes paniers repas, ton IFM et tes congés payés.</p>
    <ul class="welcome-list">
      <li>${icon('today', 20)} Pointe en un geste ou saisis ta journée</li>
      <li>${icon('percent', 20)} Toutes tes majorations, réglables par mission</li>
      <li>${icon('summary', 20)} Résumé semaine, mois, année + export PDF / Excel</li>
    </ul>
    <button class="btn primary big" data-go="#/mission/new">${icon('plus', 20)} Créer ma première mission</button>
    <button class="btn ghost" data-act="demo">${icon('sparkle', 18)} Essayer avec un exemple</button>
  </section>`;
}

export function logo(size = 64) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="22" fill="none" stroke="var(--accent)" stroke-width="7" stroke-linecap="round" stroke-dasharray="104 200" transform="rotate(-90 32 32)"/><path d="M32 32V19" stroke="var(--text)" stroke-width="5" stroke-linecap="round"/><circle cx="32" cy="32" r="4.5" fill="var(--text)"/></svg>`;
}

// ---- pointeuse ------------------------------------------------------------------------------

function elapsedMs(timer, now = Date.now()) {
  if (!timer) return 0;
  const paused = timer.pauseMs + (timer.pausedAt ? now - timer.pausedAt : 0);
  return Math.max(0, now - timer.startedAt - paused);
}

const clock = (ms) => {
  const s = Math.floor(ms / 1000);
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
};

function timerCard(timer, mission, active) {
  if (!timer) {
    return `<section class="card punch">
      ${missionChips(active, mission.id)}
      <div class="punch-idle">
        <div><p class="eyebrow">Pointeuse</p><p class="punch-hint">Prêt à pointer</p><p class="muted small">${esc(mission.name || 'Mission')}${mission.rate ? ` · ${money(mission.rate)}/h` : ''}</p></div>
        <button class="btn primary round" data-act="start" aria-label="Commencer">${icon('play', 26)}</button>
      </div>
      <div class="punch-row">
        <button class="btn soft" data-go="#/entry/new?mission=${esc(mission.id)}">${icon('edit', 18)} Saisir une journée</button>
      </div>
    </section>`;
  }
  const started = new Date(timer.startedAt);
  const tm = normalizeMission(store.mission(timer.missionId) || mission);
  return `<section class="card punch running ${timer.pausedAt ? 'paused' : ''}">
    <div class="punch-top"><span class="live"><i></i>${timer.pausedAt ? 'En pause' : 'En cours'}</span><span class="muted">${esc(tm.name)} · depuis ${nowHM(started)}</span></div>
    <div class="punch-clock display num" data-clock>${clock(elapsedMs(timer))}</div>
    <p class="punch-est" data-est></p>
    <div class="punch-actions">
      <button class="btn soft" data-act="pause">${timer.pausedAt ? `${icon('play', 18)} Reprendre` : `${icon('pause', 18)} Pause`}</button>
      <button class="btn primary" data-act="stop">${icon('stop', 18)} Terminer</button>
    </div>
    <button class="link-btn" data-act="cancel">Annuler ce pointage</button>
  </section>`;
}

function draftFromTimer(timer, now = new Date()) {
  const start = new Date(timer.startedAt);
  const rounding = store.get().settings.rounding;
  const r = (d) => {
    if (!rounding) return d;
    const step = rounding * 60000;
    return new Date(Math.round(d.getTime() / step) * step);
  };
  const s = r(start);
  let e = r(now);
  if (e - s >= 24 * 3600000) e = new Date(s.getTime() + (23 * 60 + 59) * 60000);
  const pauseMin = Math.round((timer.pauseMs + (timer.pausedAt ? now - timer.pausedAt : 0)) / 60000);
  return { missionId: timer.missionId, date: todayIso(s), start: nowHM(s), end: nowHM(e), pause: pauseMin, meal: 'auto', note: '' };
}

function bindTimer(root, mission) {
  const s = store.get();
  const timer = s.timer;
  root.querySelector('[data-act=start]')?.addEventListener('click', () => {
    haptic('medium');
    store.setTimer({ missionId: mission.id, startedAt: Date.now(), pauseMs: 0, pausedAt: null });
    toast(`Pointage lancé · ${mission.name}`);
  });
  if (!timer) return;
  const clockEl = root.querySelector('[data-clock]');
  const estEl = root.querySelector('[data-est]');
  const tm = store.mission(timer.missionId);
  const est = () => {
    if (!tm || !tm.rate) return;
    const draft = { ...draftFromTimer(timer), id: '__draft' };
    if (draft.start === draft.end) {
      estEl.textContent = '';
      return;
    }
    const ws = weekStart(draft.date);
    const week = s.entries.filter((e) => e.missionId === tm.id && e.date >= ws && e.date <= draft.date);
    const r = computeMission(tm, [...week, draft]).get('__draft');
    if (r) estEl.innerHTML = `≈ <b>${money(r.amount)}</b> brut pour l'instant${r.sup1 + r.sup2 >= 1 ? ` · dont ${fmtDuration(r.sup1 + r.sup2)} sup.` : ''}`;
  };
  est();
  let n = 0;
  tick = setInterval(() => {
    const cur = store.get().timer;
    if (!cur || !clockEl.isConnected) return clearInterval(tick);
    clockEl.textContent = clock(elapsedMs(cur));
    if (++n % 30 === 0) est();
  }, 1000);
  root.querySelector('[data-act=pause]').onclick = () => {
    haptic('light');
    const cur = store.get().timer;
    if (cur.pausedAt) store.setTimer({ ...cur, pauseMs: cur.pauseMs + (Date.now() - cur.pausedAt), pausedAt: null });
    else store.setTimer({ ...cur, pausedAt: Date.now() });
  };
  root.querySelector('[data-act=stop]').onclick = () => {
    const cur = store.get().timer;
    const draft = draftFromTimer(cur);
    if (draft.start === draft.end) {
      toast('Moins d’une minute : rien à enregistrer.');
      store.setTimer(null);
      return;
    }
    haptic('success');
    const saved = store.saveEntry(draft);
    store.setTimer(null, { silent: true });
    go(`#/entry/${saved.id}?from=timer`, { replace: false });
    toast('Journée enregistrée. Ajuste si besoin.');
  };
  root.querySelector('[data-act=cancel]').onclick = async () => {
    if (await confirmSheet({ title: 'Annuler le pointage ?', text: 'Le temps en cours ne sera pas enregistré.', ok: 'Annuler le pointage', cancel: 'Continuer', danger: true })) {
      store.setTimer(null);
    }
  };
}

// ---- semaine / mois ----------------------------------------------------------------------------

function weekCard(mission, all) {
  const t = todayIso();
  const { from, to } = weekRange(t);
  const days = eachDay(from, to);
  const s = store.get();
  const perDay = new Map(days.map((d) => [d, { net: 0, sup: 0, ids: [] }]));
  let net = 0;
  let sup = 0;
  let amount = 0;
  for (const r of all.values()) {
    if (r.missionId !== mission.id || r.date < from || r.date > to) continue;
    const p = perDay.get(r.date);
    p.net += r.net;
    p.sup += r.sup1 + r.sup2;
    p.ids.push(r.id);
    net += r.net;
    sup += r.sup1 + r.sup2;
    amount += r.amount;
  }
  const ot = mission.overtime;
  const seuil = ot.enabled && ot.basis === 'week' ? ot.t1.from * 60 : 0;
  const maxH = Math.max(600, ...[...perDay.values()].map((p) => p.net));
  const bars = days
    .map((d, i) => {
      const p = perDay.get(d);
      const h = Math.round((p.net / maxH) * 100);
      const hs = p.net ? Math.round((p.sup / p.net) * 100) : 0;
      const hol = holidayName(d, mission.holiday.alsace);
      return `<button class="wk-day ${d === t ? 'today' : ''} ${d > t ? 'future' : ''}" data-wk="${d}" data-ids="${p.ids.join(',')}" aria-label="${DAYS[i]} ${fmtDuration(p.net)}">
        <span class="wk-bar"><i style="height:${h}%"><u style="height:${hs}%"></u></i></span>
        <small class="num">${p.net ? fmtDuration(p.net, { compact: true }) : '–'}</small>
        <b class="${i === 6 ? 'sunc' : ''} ${hol ? 'holc' : ''}">${DAYS_SHORT[i].slice(0, 1)}</b>
      </button>`;
    })
    .join('');
  let progress = '';
  if (seuil) {
    const ratio = Math.min(net / seuil, 1);
    const left = seuil - net;
    progress = `<div class="progress"><i style="width:${Math.round(ratio * 100)}%"></i></div>
      <p class="muted small">${left > 0 ? `Encore <b>${fmtDuration(left)}</b> avant les heures sup (seuil ${ot.t1.from} h).` : `<span class="t-sup">Seuil de ${ot.t1.from} h dépassé : ${fmtDuration(sup)} sup. cette semaine.</span>`}</p>`;
  }
  const { week } = isoWeek(t);
  const multi = s.missions.length > 1;
  return `<section class="card">
    <div class="card-head"><h3>Semaine ${week}</h3>${multi ? `<span class="muted small">${esc(mission.name)}</span>` : ''}</div>
    <div class="kpis">
      <div><span class="kpi display num">${fmtDuration(net)}</span><small>travaillées</small></div>
      ${mission.rate ? `<div><span class="kpi display num accent">${money(amount)}</span><small>brut estimé</small></div>` : ''}
    </div>
    ${progress}
    <div class="wk">${bars}</div>
  </section>`;
}

function monthCard() {
  const s = store.get();
  const [y, m] = ymd(todayIso());
  const { from, to } = payPeriod(y, m, 1);
  const sum = summarize(s.missions, s.entries, { from, to, netRate: s.settings.netRate }).total;
  if (!sum.entries) {
    return `<section class="card month"><div class="card-head"><h3>${cap(MONTHS[m - 1])}</h3></div><p class="muted">Aucune journée ce mois-ci pour l'instant.</p></section>`;
  }
  return `<section class="card month" data-go="#/summary?p=month">
    <div class="card-head"><h3>${cap(MONTHS[m - 1])}</h3><span class="link">Résumé ${icon('chevron', 16)}</span></div>
    <div class="grid3">
      <div><b class="num">${fmtDuration(sum.net)}</b><small>heures</small></div>
      <div><b class="num accent">${money(sum.gross)}</b><small>brut estimé</small></div>
      <div><b class="num">${money(sum.netEstimate)}</b><small>net estimé</small></div>
    </div>
    <div class="month-tags">
      <span class="tag t-sup">${fmtDuration(sum.sup)} sup.</span>
      ${sum.night >= 1 ? `<span class="tag t-night">${fmtDuration(sum.night)} de nuit</span>` : ''}
      <span class="tag">${sum.days} jour${sum.days > 1 ? 's' : ''}</span>
      ${sum.meal ? `<span class="tag">${money(sum.meal)} de paniers</span>` : ''}
    </div>
  </section>`;
}

function recent(all) {
  const s = store.get();
  const list = [...all.values()].sort((a, b) => (a.date === b.date ? (a.start < b.start ? 1 : -1) : a.date < b.date ? 1 : -1)).slice(0, 3);
  if (!list.length) return '';
  const multi = s.missions.length > 1;
  return `<section class="section">
    <div class="section-head"><h3>Dernières journées</h3><button class="link" data-go="#/history">Tout voir ${icon('chevron', 16)}</button></div>
    <div class="entries">${list.map((r) => entryCard(r, store.mission(r.missionId), { showMission: multi })).join('')}</div>
  </section>`;
}
