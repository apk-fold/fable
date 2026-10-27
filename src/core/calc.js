// Moteur de calcul de Fable.
// Chaque journée est découpée minute par minute : pour chaque minute travaillée on sait si elle est
// de nuit, un dimanche, un jour férié, et dans quel palier d'heures sup elle tombe (cumul de la semaine
// ou du jour). La pause est retirée au prorata, sans supposer où elle a été prise.
import { parseHM, weekStart, isoFromIndex, isSunday, dayIndex } from './time.js';
import { holidayName } from './holidays.js';

export const CONTRACTS = {
  interim: { label: 'Intérim', end: 'Indemnité de fin de mission', endShort: 'IFM' },
  cdd: { label: 'CDD', end: 'Indemnité de fin de contrat', endShort: 'Précarité' },
  cdi: { label: 'CDI', end: null, endShort: null },
  autre: { label: 'Autre', end: null, endShort: null },
};

export const MISSION_COLORS = ['#C8F25A', '#7CC8FF', '#FFB547', '#FF8A7A', '#B79CFF', '#56D6C1', '#F27BC0', '#E6DFC8'];

const DEFAULTS = {
  id: '',
  name: '',
  color: MISSION_COLORS[0],
  contract: 'interim',
  rate: 0,
  archived: false,
  overtime: { enabled: true, basis: 'week', t1: { from: 35, pct: 25 }, t2: { enabled: false, from: 43, pct: 50 } },
  sunday: { enabled: false, pct: 50 },
  night: { enabled: false, start: '21:00', end: '06:00', pct: 25 },
  holiday: { enabled: false, pct: 100, alsace: false },
  meal: { enabled: false, amount: 6, rule: 'day', minHours: 5 },
  travel: { enabled: false, amount: 0 },
  endBonus: { enabled: true, pct: 10 },
  paidLeave: { enabled: true, pct: 10 },
  stacking: 'add', // 'add' : les majorations s'additionnent ; 'max' : on garde la plus forte
  split: 'start', // 'start' : dimanche/férié selon le jour de début ; 'real' : heure par heure
  payStartDay: 1,
  defaultPause: 30,
  defaultStart: '08:00',
  defaultEnd: '16:00',
  createdAt: 0,
};

const num = (v, d = 0, min = -Infinity, max = Infinity) => {
  const n = typeof v === 'string' ? Number(v.replace(',', '.')) : Number(v);
  return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : d;
};
const bool = (v, d) => (typeof v === 'boolean' ? v : d);
const hm = (v, d) => (parseHM(v) === null ? d : v);

/** Complète une mission (ancienne version, import, saisie partielle) avec des valeurs sûres. */
export function normalizeMission(m = {}) {
  const D = DEFAULTS;
  const contract = CONTRACTS[m.contract] ? m.contract : D.contract;
  const hasEnd = contract === 'interim' || contract === 'cdd';
  const o = m.overtime || {};
  const t1 = o.t1 || {};
  const t2 = o.t2 || {};
  return {
    id: String(m.id || ''),
    name: String(m.name ?? '').slice(0, 60),
    color: /^#[0-9a-f]{6}$/i.test(m.color || '') ? m.color : D.color,
    contract,
    rate: num(m.rate, 0, 0, 10000),
    archived: !!m.archived,
    overtime: {
      enabled: bool(o.enabled, D.overtime.enabled),
      basis: o.basis === 'day' ? 'day' : 'week',
      t1: { from: num(t1.from, D.overtime.t1.from, 0, 168), pct: num(t1.pct, D.overtime.t1.pct, 0, 500) },
      t2: { enabled: bool(t2.enabled, false), from: num(t2.from, D.overtime.t2.from, 0, 168), pct: num(t2.pct, D.overtime.t2.pct, 0, 500) },
    },
    sunday: { enabled: bool(m.sunday?.enabled, D.sunday.enabled), pct: num(m.sunday?.pct, D.sunday.pct, 0, 500) },
    night: {
      enabled: bool(m.night?.enabled, D.night.enabled),
      start: hm(m.night?.start, D.night.start),
      end: hm(m.night?.end, D.night.end),
      pct: num(m.night?.pct, D.night.pct, 0, 500),
    },
    holiday: { enabled: bool(m.holiday?.enabled, D.holiday.enabled), pct: num(m.holiday?.pct, D.holiday.pct, 0, 500), alsace: bool(m.holiday?.alsace, false) },
    meal: {
      enabled: bool(m.meal?.enabled, D.meal.enabled),
      amount: num(m.meal?.amount, D.meal.amount, 0, 1000),
      rule: m.meal?.rule === 'hours' ? 'hours' : 'day',
      minHours: num(m.meal?.minHours, D.meal.minHours, 0, 24),
    },
    travel: { enabled: bool(m.travel?.enabled, false), amount: num(m.travel?.amount, 0, 0, 1000) },
    endBonus: { enabled: bool(m.endBonus?.enabled, hasEnd), pct: num(m.endBonus?.pct, 10, 0, 100) },
    paidLeave: { enabled: bool(m.paidLeave?.enabled, hasEnd), pct: num(m.paidLeave?.pct, 10, 0, 100) },
    stacking: m.stacking === 'max' ? 'max' : 'add',
    split: m.split === 'real' ? 'real' : 'start',
    payStartDay: Math.round(num(m.payStartDay, 1, 1, 28)),
    defaultPause: Math.round(num(m.defaultPause, D.defaultPause, 0, 600)),
    defaultStart: hm(m.defaultStart, D.defaultStart),
    defaultEnd: hm(m.defaultEnd, D.defaultEnd),
    createdAt: num(m.createdAt, 0),
  };
}

/** Une journée saisie → intervalle absolu en minutes. Fin ≤ début : la journée finit le lendemain. */
export function span(e) {
  if (!e || !/^\d{4}-\d{2}-\d{2}$/.test(e.date || '')) return null;
  const s = parseHM(e.start);
  let en = parseHM(e.end);
  if (s === null || en === null) return null;
  if (en <= s) en += 1440;
  const base = dayIndex(e.date) * 1440;
  const gross = en - s;
  const pause = Math.min(Math.max(Math.round(Number(e.pause) || 0), 0), gross);
  return { start: base + s, end: base + en, gross, pause, net: gross - pause, overnight: en > 1440 };
}

function splitTiers(c, w, T1, T2) {
  const end = c + w;
  const a = Math.max(0, Math.min(end, T1) - c);
  const b = Math.max(0, Math.min(end, T2) - Math.max(c, T1));
  const d = Math.max(0, end - Math.max(c, T2));
  return [a, b, d];
}

const zeroMajo = () => ({ sup1: 0, sup2: 0, night: 0, sunday: 0, holiday: 0 });

/**
 * Calcule toutes les journées d'une mission (les heures sup dépendent de toute la semaine).
 * Renvoie une Map id de journée → détail.
 */
export function computeMission(mission, entries) {
  const m = normalizeMission(mission);
  const rate = m.rate / 60; // € par minute
  const ot = m.overtime;
  const T1 = ot.enabled ? ot.t1.from * 60 : Infinity;
  const T2 = ot.enabled && ot.t2.enabled && ot.t2.from > ot.t1.from ? ot.t2.from * 60 : Infinity;
  const pct = {
    sup1: ot.t1.pct / 100,
    sup2: (ot.t2.enabled ? ot.t2.pct : ot.t1.pct) / 100,
    night: m.night.pct / 100,
    sunday: m.sunday.pct / 100,
    holiday: m.holiday.pct / 100,
  };
  const nS = parseHM(m.night.start);
  const nE = parseHM(m.night.end);
  const inNight = (mod) => {
    if (!m.night.enabled || nS === nE) return false;
    return nS < nE ? mod >= nS && mod < nE : mod >= nS || mod < nE;
  };
  const dayFlags = new Map();
  const flagsOf = (iso) => {
    let f = dayFlags.get(iso);
    if (!f) {
      const hol = holidayName(iso, m.holiday.alsace);
      f = { sunday: m.sunday.enabled && isSunday(iso), holiday: m.holiday.enabled && !!hol, holidayName: hol };
      dayFlags.set(iso, f);
    }
    return f;
  };

  const list = [];
  for (const e of entries) {
    if (e.missionId !== m.id) continue;
    const s = span(e);
    if (s) list.push({ e, s });
  }
  list.sort((a, b) => a.s.start - b.s.start || (a.e.id < b.e.id ? -1 : 1));

  const cumul = new Map();
  const out = new Map();
  for (const { e, s } of list) {
    const key = ot.basis === 'day' ? e.date : weekStart(e.date);
    let c = cumul.get(key) || 0;
    const w = s.gross > 0 ? s.net / s.gross : 0;
    const r = {
      id: e.id,
      missionId: m.id,
      date: e.date,
      start: e.start,
      end: e.end,
      gross: s.gross,
      pause: s.pause,
      net: s.net,
      overnight: s.overnight,
      sup1: 0,
      sup2: 0,
      night: 0,
      sunday: 0,
      holiday: 0,
      base: 0,
      majo: zeroMajo(),
      majoTotal: 0,
      amount: 0,
      meal: 0,
      travel: 0,
      isSunday: isSunday(e.date),
      holidayName: holidayName(e.date, m.holiday.alsace),
    };
    if (w > 0) {
      const startDay = flagsOf(e.date);
      for (let t = s.start; t < s.end; t++) {
        const di = Math.floor(t / 1440);
        const mod = t - di * 1440;
        const f = m.split === 'real' ? flagsOf(isoFromIndex(di)) : startDay;
        const night = inNight(mod);
        const pieces = splitTiers(c, w, T1, T2);
        c += w;
        for (let tier = 0; tier < 3; tier++) {
          const p = pieces[tier];
          if (p <= 0) continue;
          r.base += p * rate;
          const cats = [];
          if (f.holiday) cats.push('holiday');
          if (f.sunday) cats.push('sunday');
          if (night) cats.push('night');
          if (tier === 1) cats.push('sup1');
          if (tier === 2) cats.push('sup2');
          if (tier === 1) r.sup1 += p;
          if (tier === 2) r.sup2 += p;
          if (night) r.night += p;
          if (f.sunday) r.sunday += p;
          if (f.holiday) r.holiday += p;
          if (!cats.length) continue;
          if (m.stacking === 'max') {
            let best = cats[0];
            for (const k of cats) if (pct[k] > pct[best]) best = k;
            r.majo[best] += p * rate * pct[best];
          } else {
            for (const k of cats) r.majo[k] += p * rate * pct[k];
          }
        }
      }
    }
    cumul.set(key, c);
    r.majoTotal = r.majo.sup1 + r.majo.sup2 + r.majo.night + r.majo.sunday + r.majo.holiday;
    r.amount = r.base + r.majoTotal;
    r.mealMode = e.meal === 'yes' || e.meal === 'no' ? e.meal : 'auto';
    out.set(e.id, r);
  }

  // Indemnités par jour calendaire (une seule par date, même avec plusieurs créneaux)
  const byDate = new Map();
  for (const r of out.values()) {
    if (!byDate.has(r.date)) byDate.set(r.date, []);
    byDate.get(r.date).push(r);
  }
  for (const rs of byDate.values()) {
    const net = rs.reduce((a, r) => a + r.net, 0);
    const first = rs[0];
    const forced = rs.some((r) => r.mealMode === 'no') ? 'no' : rs.some((r) => r.mealMode === 'yes') ? 'yes' : 'auto';
    let meal = false;
    if (forced === 'yes') meal = true;
    else if (forced === 'auto' && m.meal.enabled && net > 0) meal = m.meal.rule === 'day' || net >= m.meal.minHours * 60;
    if (meal) first.meal = m.meal.amount;
    if (m.travel.enabled && net > 0) first.travel = m.travel.amount;
  }
  return out;
}

export function emptyTotals() {
  return {
    entries: 0,
    days: 0,
    net: 0,
    pause: 0,
    sup1: 0,
    sup2: 0,
    sup: 0,
    night: 0,
    sunday: 0,
    holiday: 0,
    base: 0,
    majo: zeroMajo(),
    majoTotal: 0,
    salary: 0,
    endBonus: 0,
    paidLeave: 0,
    gross: 0,
    meal: 0,
    mealCount: 0,
    travel: 0,
    travelCount: 0,
    allowances: 0,
    netEstimate: 0,
  };
}

function addInto(t, r) {
  t.entries += 1;
  t.net += r.net;
  t.pause += r.pause;
  t.sup1 += r.sup1;
  t.sup2 += r.sup2;
  t.night += r.night;
  t.sunday += r.sunday;
  t.holiday += r.holiday;
  t.base += r.base;
  for (const k of Object.keys(t.majo)) t.majo[k] += r.majo[k];
  t.meal += r.meal;
  if (r.meal) t.mealCount += 1;
  t.travel += r.travel;
  if (r.travel) t.travelCount += 1;
}

function finish(t) {
  t.sup = t.sup1 + t.sup2;
  t.majoTotal = t.majo.sup1 + t.majo.sup2 + t.majo.night + t.majo.sunday + t.majo.holiday;
  t.salary = t.base + t.majoTotal;
  return t;
}

/** Mémoïsation du calcul par mission, invalidée à chaque modification des données. */
const memo = new WeakMap();
export function computeAll(missions, entries) {
  let byEntries = memo.get(entries);
  if (!byEntries) {
    byEntries = new Map();
    memo.set(entries, byEntries);
  }
  const out = new Map();
  for (const m of missions) {
    const key = JSON.stringify(m);
    let comp = byEntries.get(key);
    if (!comp) {
      comp = computeMission(m, entries);
      byEntries.set(key, comp);
    }
    for (const [id, r] of comp) out.set(id, r);
  }
  return out;
}

/**
 * Totaux d'une période [from, to] (dates incluses), pour une mission ou toutes.
 * Les heures sup sont calculées sur les semaines complètes, puis seules les journées
 * de la période sont comptées.
 */
export function summarize(missions, entries, { from, to, missionId = null, netRate = 22 } = {}) {
  const total = emptyTotals();
  const perMission = [];
  const dates = new Set();
  const byDay = new Map();
  const rows = [];
  const all = computeAll(missions, entries);
  for (const raw of missions) {
    if (missionId && raw.id !== missionId) continue;
    const m = normalizeMission(raw);
    const t = emptyTotals();
    const mdates = new Set();
    for (const r of all.values()) {
      if (r.missionId !== m.id || r.date < from || r.date > to) continue;
      addInto(t, r);
      mdates.add(r.date);
      dates.add(r.date);
      rows.push(r);
      const d = byDay.get(r.date) || { net: 0, amount: 0, sup: 0 };
      d.net += r.net;
      d.amount += r.amount;
      d.sup += r.sup1 + r.sup2;
      byDay.set(r.date, d);
    }
    finish(t);
    t.days = mdates.size;
    t.endBonus = m.endBonus.enabled ? (t.salary * m.endBonus.pct) / 100 : 0;
    t.paidLeave = m.paidLeave.enabled ? ((t.salary + t.endBonus) * m.paidLeave.pct) / 100 : 0;
    t.gross = t.salary + t.endBonus + t.paidLeave;
    t.allowances = t.meal + t.travel;
    t.netEstimate = t.gross * (1 - netRate / 100) + t.allowances;
    if (t.entries || missionId) perMission.push({ mission: m, totals: t });
    for (const k of ['entries', 'net', 'pause', 'sup1', 'sup2', 'night', 'sunday', 'holiday', 'base', 'meal', 'mealCount', 'travel', 'travelCount', 'endBonus', 'paidLeave']) total[k] += t[k];
    for (const k of Object.keys(total.majo)) total.majo[k] += t.majo[k];
  }
  finish(total);
  total.days = dates.size;
  total.gross = total.salary + total.endBonus + total.paidLeave;
  total.allowances = total.meal + total.travel;
  total.netEstimate = total.gross * (1 - netRate / 100) + total.allowances;
  rows.sort((a, b) => (a.date === b.date ? (a.start < b.start ? -1 : 1) : a.date < b.date ? -1 : 1));
  return { from, to, total, perMission, byDay, rows };
}

/** Taux de majoration appliqués à une journée (pour les pastilles de l'historique). */
export function tags(r, mission) {
  const m = normalizeMission(mission);
  const out = [];
  if (r.sup1 + r.sup2 >= 0.5) out.push('sup');
  if (r.night >= 0.5) out.push('night');
  if (m.sunday.enabled && r.sunday >= 0.5) out.push('sunday');
  if (m.holiday.enabled && r.holiday >= 0.5) out.push('holiday');
  return out;
}

export const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
