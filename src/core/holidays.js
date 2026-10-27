// Jours fériés français (métropole), avec les deux jours propres à l'Alsace-Moselle.
import { pad, addDays } from './time.js';

/** Dimanche de Pâques (algorithme grégorien anonyme / Meeus-Jones-Butcher) */
export function easter(y) {
  const a = y % 19;
  const b = Math.floor(y / 100);
  const c = y % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return `${y}-${pad(month)}-${pad(day)}`;
}

const cache = new Map();

/** Map 'AAAA-MM-JJ' → nom du jour férié */
export function holidays(y, alsace = false) {
  const key = `${y}-${alsace ? 1 : 0}`;
  if (cache.has(key)) return cache.get(key);
  const e = easter(y);
  const list = [
    [`${y}-01-01`, "Jour de l'an"],
    [addDays(e, 1), 'Lundi de Pâques'],
    [`${y}-05-01`, 'Fête du Travail'],
    [`${y}-05-08`, 'Victoire 1945'],
    [addDays(e, 39), 'Ascension'],
    [addDays(e, 50), 'Lundi de Pentecôte'],
    [`${y}-07-14`, 'Fête nationale'],
    [`${y}-08-15`, 'Assomption'],
    [`${y}-11-01`, 'Toussaint'],
    [`${y}-11-11`, 'Armistice 1918'],
    [`${y}-12-25`, 'Noël'],
  ];
  if (alsace) {
    list.push([addDays(e, -2), 'Vendredi saint']);
    list.push([`${y}-12-26`, 'Saint-Étienne']);
  }
  const map = new Map(list.sort((a, b) => (a[0] < b[0] ? -1 : 1)));
  cache.set(key, map);
  return map;
}

export function holidayName(iso, alsace = false) {
  return holidays(Number(String(iso).slice(0, 4)), alsace).get(iso) || null;
}

export const isHoliday = (iso, alsace = false) => holidayName(iso, alsace) !== null;
