// Historique : journées du mois, en liste (par semaine) ou en calendrier.
import * as store from '../core/store.js';
import { computeAll, summarize, normalizeMission } from '../core/calc.js';
import { todayIso, ymd, pad, daysInMonth, monthLabel, weekStart, isoWeek, addDays, fmtDuration, MONTHS_SHORT, weekday, fmtDateLong, cap } from '../core/time.js';
import { holidayName } from '../core/holidays.js';
import { icon } from '../ui/icons.js';
import { esc, money, choiceSheet } from '../ui/dom.js';
import { bigHead, entryCard, emptyState, seg, bindSeg } from '../ui/components.js';
import { go } from '../ui/nav.js';

let ym = null; // [année, mois]
let filter = 'all';
let mode = 'list';

export function render(root, route) {
  const s = store.get();
  if (!ym) ym = ymd(todayIso()).slice(0, 2);
  if (route.query.m && /^\d{4}-\d{2}$/.test(route.query.m)) ym = route.query.m.split('-').map(Number);
  if (filter !== 'all' && !store.mission(filter)) filter = 'all';
  const [y, m] = ym;
  const from = `${y}-${pad(m)}-01`;
  const to = `${y}-${pad(m)}-${pad(daysInMonth(y, m))}`;
  const all = computeAll(s.missions, s.entries);
  const rows = [...all.values()].filter((r) => r.date >= from && r.date <= to && (filter === 'all' || r.missionId === filter));
  rows.sort((a, b) => (a.date === b.date ? (a.start < b.start ? 1 : -1) : a.date < b.date ? 1 : -1));
  const sum = summarize(s.missions, s.entries, { from, to, missionId: filter === 'all' ? null : filter, netRate: s.settings.netRate }).total;
  const fm = filter === 'all' ? null : normalizeMission(store.mission(filter));
  const multi = s.missions.length > 1;

  root.innerHTML = `${bigHead('Historique', { actions: seg('view', [['list', icon('list', 20)], ['cal', icon('grid', 20)]], mode, 'icons') })}
    <div class="filters">
      <div class="month-nav">
        <button class="ic-btn" data-act="prev" aria-label="Mois précédent">${icon('left', 22)}</button>
        <button class="pill" data-act="month">${icon('calendar', 18)}<span>${monthLabel(y, m)}</span>${icon('chevronDown', 16)}</button>
        <button class="ic-btn" data-act="next" aria-label="Mois suivant">${icon('right', 22)}</button>
      </div>
      ${multi ? `<button class="pill grow" data-act="mission">${fm ? `<i class="dot" style="background:${esc(fm.color)}"></i><span>${esc(fm.name)}</span>` : `${icon('missions', 18)}<span>Toutes les missions</span>`}${icon('chevronDown', 16)}</button>` : ''}
    </div>
    ${sum.entries ? `<div class="strip"><span><b class="num">${sum.days}</b> jour${sum.days > 1 ? 's' : ''}</span><span><b class="num">${fmtDuration(sum.net)}</b></span>${sum.sup >= 1 ? `<span class="t-sup"><b class="num">${fmtDuration(sum.sup)}</b> sup.</span>` : ''}<span class="accent"><b class="num">≈ ${money(sum.salary)}</b></span></div>` : ''}
    <div data-body>${mode === 'cal' ? calendar(y, m, rows, fm) : list(rows, multi && filter === 'all')}</div>
    <button class="fab" data-go="#/entry/new?date=${esc(defaultNewDate(y, m))}${filter !== 'all' ? `&mission=${esc(filter)}` : ''}" aria-label="Ajouter une journée">${icon('plus', 28)}</button>`;

  const shift = (d) => {
    let [yy, mm] = ym;
    mm += d;
    if (mm < 1) {
      mm = 12;
      yy -= 1;
    }
    if (mm > 12) {
      mm = 1;
      yy += 1;
    }
    ym = [yy, mm];
    go(`#/history?m=${yy}-${pad(mm)}`, { replace: true });
  };
  root.querySelector('[data-act=prev]').onclick = () => shift(-1);
  root.querySelector('[data-act=next]').onclick = () => shift(1);
  root.querySelector('[data-act=month]').onclick = async () => {
    const v = await choiceSheet({ title: 'Choisir un mois', options: monthOptions(), value: `${y}-${pad(m)}` });
    if (v) {
      ym = v.split('-').map(Number);
      go(`#/history?m=${v}`, { replace: true });
    }
  };
  root.querySelector('[data-act=mission]')?.addEventListener('click', async () => {
    const v = await choiceSheet({
      title: 'Mission',
      value: filter,
      options: [{ value: 'all', label: 'Toutes les missions', icon: 'missions' }, ...s.missions.map((mm) => ({ value: mm.id, label: mm.name || 'Mission', sub: mm.archived ? 'Archivée' : '', dot: mm.color }))],
    });
    if (v) {
      filter = v;
      render(root, route);
    }
  });
  bindSeg(root, 'view', (v) => {
    mode = v;
    render(root, route);
  });
  root.querySelector('[data-body]').addEventListener('click', async (e) => {
    const c = e.target.closest('[data-cal]');
    if (!c) return;
    const d = c.dataset.cal;
    const ids = c.dataset.ids ? c.dataset.ids.split(',') : [];
    if (!ids.length) return go(`#/entry/new?date=${d}${filter !== 'all' ? `&mission=${filter}` : ''}`);
    if (ids.length === 1) return go(`#/entry/${ids[0]}`);
    const v = await choiceSheet({
      title: cap(fmtDateLong(d)),
      options: [
        ...ids.map((id) => {
          const r = all.get(id);
          const mm = store.mission(r.missionId);
          return { value: id, label: `${r.start} → ${r.end}`, sub: `${mm?.name || ''} · ${fmtDuration(r.net)}`, dot: mm?.color };
        }),
        { value: 'new', label: 'Ajouter une journée', icon: 'plus' },
      ],
    });
    if (v === 'new') go(`#/entry/new?date=${d}`);
    else if (v) go(`#/entry/${v}`);
  });
}

function defaultNewDate(y, m) {
  const t = todayIso();
  const [ty, tm] = ymd(t);
  return ty === y && tm === m ? t : `${y}-${pad(m)}-01`;
}

function monthOptions() {
  const s = store.get();
  const counts = new Map();
  for (const e of s.entries) {
    const k = e.date.slice(0, 7);
    counts.set(k, (counts.get(k) || 0) + 1);
  }
  const t = todayIso();
  let [y, m] = ymd(t);
  const keys = new Set([...counts.keys()]);
  for (let i = 0; i < 13; i++) {
    keys.add(`${y}-${pad(m)}`);
    m -= 1;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
  }
  const [ny, nm] = ymd(addDays(t, 31));
  keys.add(`${ny}-${pad(nm)}`);
  return [...keys]
    .sort()
    .reverse()
    .map((k) => {
      const [yy, mm] = k.split('-').map(Number);
      const c = counts.get(k) || 0;
      return { value: k, label: monthLabel(yy, mm), sub: c ? `${c} journée${c > 1 ? 's' : ''}` : 'Aucune journée' };
    });
}

function list(rows, showMission) {
  if (!rows.length) return emptyState({ ic: 'history', title: 'Aucune journée ce mois-ci', text: 'Ajoute une journée avec le bouton +, ou lance la pointeuse depuis l’accueil.' });
  const weeks = new Map();
  for (const r of rows) {
    const k = weekStart(r.date);
    if (!weeks.has(k)) weeks.set(k, []);
    weeks.get(k).push(r);
  }
  let out = '';
  for (const [ws, rs] of weeks) {
    const net = rs.reduce((a, r) => a + r.net, 0);
    const sup = rs.reduce((a, r) => a + r.sup1 + r.sup2, 0);
    const [, m1, d1] = ymd(ws);
    const [, m2, d2] = ymd(addDays(ws, 6));
    out += `<div class="week-head"><span><b>Semaine ${isoWeek(ws).week}</b> · ${d1}${m1 !== m2 ? ` ${MONTHS_SHORT[m1 - 1]}` : ''} – ${d2} ${MONTHS_SHORT[m2 - 1]}</span><span class="num">${fmtDuration(net)}${sup >= 1 ? ` · <span class="t-sup">${fmtDuration(sup)} sup.</span>` : ''}</span></div>
      <div class="entries">${rs.map((r) => entryCard(r, store.mission(r.missionId), { showMission })).join('')}</div>`;
  }
  return out;
}

function calendar(y, m, rows, fm) {
  const first = `${y}-${pad(m)}-01`;
  const n = daysInMonth(y, m);
  const lead = weekday(first);
  const t = todayIso();
  const byDate = new Map();
  for (const r of rows) {
    if (!byDate.has(r.date)) byDate.set(r.date, []);
    byDate.get(r.date).push(r);
  }
  const alsace = fm ? fm.holiday.alsace : store.get().missions.some((mm) => mm.holiday?.alsace);
  let cells = '';
  for (let i = 0; i < lead; i++) cells += '<span class="cal-cell blank"></span>';
  for (let d = 1; d <= n; d++) {
    const iso = `${y}-${pad(m)}-${pad(d)}`;
    const rs = byDate.get(iso) || [];
    const net = rs.reduce((a, r) => a + r.net, 0);
    const level = net ? Math.min(4, Math.ceil(net / 150)) : 0;
    const colors = [...new Set(rs.map((r) => store.mission(r.missionId)?.color))].slice(0, 3);
    const hol = holidayName(iso, alsace);
    cells += `<button class="cal-cell lv${level} ${iso === t ? 'today' : ''} ${weekday(iso) === 6 ? 'sun' : ''} ${hol ? 'hol' : ''}" data-cal="${iso}" data-ids="${rs.map((r) => r.id).join(',')}" ${hol ? `title="${esc(hol)}"` : ''}>
      <b>${d}</b>
      ${net ? `<small class="num">${fmtDuration(net, { compact: true })}</small>` : ''}
      ${colors.length ? `<span class="cal-dots">${colors.map((c) => `<i style="background:${esc(c)}"></i>`).join('')}</span>` : ''}
    </button>`;
  }
  return `<div class="card cal">
    <div class="cal-grid head">${['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((x, i) => `<span class="${i === 6 ? 'sunc' : ''}">${x}</span>`).join('')}</div>
    <div class="cal-grid">${cells}</div>
    <p class="hint">Touche un jour pour l'ouvrir ou ajouter une journée.</p>
  </div>`;
}
