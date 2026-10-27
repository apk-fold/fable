// Dates et heures « naïves » (sans fuseau) : une journée = 'AAAA-MM-JJ', une heure = 'HH:MM'.
// Tout le calcul se fait en index de jour (jours depuis 1970-01-01) et en minutes,
// ce qui évite les pièges des changements d'heure et des fuseaux.

export const pad = (n) => String(n).padStart(2, '0');

export const MONTHS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
export const MONTHS_SHORT = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
export const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
export const DAYS_SHORT = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];

export function dayIndex(iso) {
  const [y, m, d] = String(iso).split('-').map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 864e5);
}

export function isoFromIndex(i) {
  const d = new Date(i * 864e5);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export const addDays = (iso, n) => isoFromIndex(dayIndex(iso) + n);
/** 0 = lundi … 6 = dimanche */
export const weekday = (iso) => (((dayIndex(iso) + 3) % 7) + 7) % 7;
export const isSunday = (iso) => weekday(iso) === 6;
export const weekStart = (iso) => addDays(iso, -weekday(iso));
export const ymd = (iso) => String(iso).split('-').map(Number);

export function isValidIso(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(iso))) return false;
  return isoFromIndex(dayIndex(iso)) === iso;
}

export function daysInMonth(y, m) {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** Numéro de semaine ISO 8601 */
export function isoWeek(iso) {
  const thursday = addDays(iso, 3 - weekday(iso));
  const [y] = ymd(thursday);
  const jan4 = `${y}-01-04`;
  const w1 = weekStart(jan4);
  return { year: y, week: Math.floor((dayIndex(thursday) - dayIndex(w1)) / 7) + 1 };
}

export function parseHM(hm) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(hm || '').trim());
  if (!m) return null;
  const h = Number(m[1]);
  const mi = Number(m[2]);
  if (h > 23 || mi > 59) return null;
  return h * 60 + mi;
}

export function fmtHM(min) {
  const m = ((Math.round(min) % 1440) + 1440) % 1440;
  return `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
}

/** 450 → « 7 h 30 », 480 → « 8 h », 45 → « 45 min », 0 → « 0 h » */
export function fmtDuration(min, { zero = '0 h', compact = false } = {}) {
  const m = Math.round(Math.abs(min));
  const sign = min < 0 ? '−' : '';
  if (m === 0) return zero;
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h === 0) return `${sign}${r}\u00a0min`;
  if (r === 0) return `${sign}${h}\u00a0h`;
  return compact ? `${sign}${h}h${pad(r)}` : `${sign}${h}\u00a0h\u00a0${pad(r)}`;
}

/** Heures décimales (pour les exports tableur) */
export const toHours = (min) => Math.round((min / 60) * 100) / 100;

export function todayIso(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function nowHM(d = new Date()) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fmtDateLong(iso) {
  const [y, m, d] = ymd(iso);
  return `${DAYS[weekday(iso)]} ${d} ${MONTHS[m - 1]} ${y}`;
}

export function fmtDateShort(iso) {
  const [, m, d] = ymd(iso);
  return `${d} ${MONTHS_SHORT[m - 1]}`;
}

export function fmtDateNum(iso) {
  const [y, m, d] = ymd(iso);
  return `${pad(d)}/${pad(m)}/${y}`;
}

export const cap = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);

export function monthLabel(y, m) {
  return `${cap(MONTHS[m - 1])} ${y}`;
}

// ---- périodes --------------------------------------------------------------------------

export function weekRange(iso) {
  const from = weekStart(iso);
  return { from, to: addDays(from, 6) };
}

/**
 * Période de paie du mois (y, m). startDay = 1 : du 1er au dernier jour.
 * startDay = 21 : du 21 du mois précédent au 20 du mois (paie d'intérim classique).
 */
export function payPeriod(y, m, startDay = 1) {
  const s = Math.min(Math.max(Math.round(Number(startDay) || 1), 1), 28);
  if (s === 1) return { from: `${y}-${pad(m)}-01`, to: `${y}-${pad(m)}-${pad(daysInMonth(y, m))}` };
  const py = m === 1 ? y - 1 : y;
  const pm = m === 1 ? 12 : m - 1;
  return { from: `${py}-${pad(pm)}-${pad(s)}`, to: `${y}-${pad(m)}-${pad(s - 1)}` };
}

/** Mois (y, m) dont la période de paie contient iso */
export function payMonthOf(iso, startDay = 1) {
  const [y, m, d] = ymd(iso);
  const s = Math.min(Math.max(Math.round(Number(startDay) || 1), 1), 28);
  if (s === 1 || d < s) return { y, m };
  return m === 12 ? { y: y + 1, m: 1 } : { y, m: m + 1 };
}

export function yearRange(y) {
  return { from: `${y}-01-01`, to: `${y}-12-31` };
}

export function eachDay(from, to) {
  const out = [];
  for (let i = dayIndex(from), e = dayIndex(to); i <= e; i++) out.push(isoFromIndex(i));
  return out;
}

export const inRange = (iso, from, to) => iso >= from && iso <= to;
