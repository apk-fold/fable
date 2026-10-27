// Données de Fable : missions, journées, réglages, pointeuse en cours.
// Stockées dans le navigateur de l'appli (localStorage) + une copie dans les fichiers privés
// de l'appli Android (restaurée automatiquement si le WebView a été vidé).
import { normalizeMission, MISSION_COLORS } from './calc.js';
import { parseHM, isValidIso } from './time.js';

const KEY = 'fable.data.v1';
export const DATA_VERSION = 1;

export const DEFAULT_SETTINGS = {
  netRate: 22,
  theme: 'dark',
  haptics: true,
  rounding: 0,
  reminder: { enabled: false, time: '19:30', days: [0, 1, 2, 3, 4] },
  lastMissionId: null,
  welcomed: false,
};

let state = blank();
const subs = new Set();
let persistHook = null;
let saveTimer = null;

function blank() {
  return { version: DATA_VERSION, missions: [], entries: [], settings: structuredClone(DEFAULT_SETTINGS), timer: null };
}

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export function normalizeEntry(e = {}) {
  return {
    id: String(e.id || uid()),
    missionId: String(e.missionId || ''),
    date: isValidIso(e.date) ? e.date : '1970-01-01',
    start: parseHM(e.start) === null ? '08:00' : e.start,
    end: parseHM(e.end) === null ? '16:00' : e.end,
    pause: Math.min(Math.max(Math.round(Number(e.pause) || 0), 0), 1440),
    meal: e.meal === 'yes' || e.meal === 'no' ? e.meal : 'auto',
    note: String(e.note || '').slice(0, 500),
    updatedAt: Number(e.updatedAt) || 0,
  };
}

function normalizeSettings(s = {}) {
  const d = DEFAULT_SETTINGS;
  const r = s.reminder || {};
  return {
    netRate: Number.isFinite(Number(s.netRate)) ? Math.min(Math.max(Number(s.netRate), 0), 80) : d.netRate,
    theme: ['dark', 'light', 'auto'].includes(s.theme) ? s.theme : d.theme,
    haptics: typeof s.haptics === 'boolean' ? s.haptics : d.haptics,
    rounding: [0, 5, 10, 15].includes(Number(s.rounding)) ? Number(s.rounding) : 0,
    reminder: {
      enabled: !!r.enabled,
      time: parseHM(r.time) === null ? d.reminder.time : r.time,
      days: Array.isArray(r.days) ? r.days.filter((x) => Number.isInteger(x) && x >= 0 && x <= 6) : d.reminder.days,
    },
    lastMissionId: s.lastMissionId || null,
    welcomed: !!s.welcomed,
  };
}

/** Valide et nettoie des données (chargement, import de sauvegarde). Lève une erreur si illisible. */
export function sanitize(raw) {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.missions) || !Array.isArray(raw.entries)) {
    throw new Error("Ce fichier n'est pas une sauvegarde Fable.");
  }
  const missions = raw.missions.map((m) => normalizeMission({ ...m, id: m.id || uid() }));
  const ids = new Set(missions.map((m) => m.id));
  const entries = raw.entries.map(normalizeEntry).filter((e) => ids.has(e.missionId));
  let timer = null;
  if (raw.timer && ids.has(raw.timer.missionId) && Number(raw.timer.startedAt) > 0) {
    timer = {
      missionId: raw.timer.missionId,
      startedAt: Number(raw.timer.startedAt),
      pauseMs: Math.max(Number(raw.timer.pauseMs) || 0, 0),
      pausedAt: Number(raw.timer.pausedAt) || null,
    };
  }
  return { version: DATA_VERSION, missions, entries, settings: normalizeSettings(raw.settings), timer };
}

export function load() {
  try {
    const txt = localStorage.getItem(KEY);
    if (txt) state = sanitize(JSON.parse(txt));
  } catch (e) {
    console.error('Lecture des données impossible', e);
  }
  return state;
}

export const get = () => state;
export const isEmpty = () => !state.missions.length && !state.entries.length;

export function subscribe(fn) {
  subs.add(fn);
  return () => subs.delete(fn);
}

export function setPersistHook(fn) {
  persistHook = fn;
}

function commit(next, { silent = false } = {}) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Enregistrement impossible', e);
  }
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => persistHook?.(JSON.stringify(state)), 600);
  if (!silent) for (const fn of subs) fn(state);
}

/** Remplace tout (restauration de sauvegarde). */
export function replaceAll(data) {
  commit(sanitize(data));
}

export function exportJson() {
  return JSON.stringify({ app: 'Fable', exportedAt: new Date().toISOString(), ...state, timer: null }, null, 2);
}

export function resetAll() {
  commit(blank());
}

// ---- missions ---------------------------------------------------------------------------

export function nextColor() {
  const used = new Set(state.missions.map((m) => m.color));
  return MISSION_COLORS.find((c) => !used.has(c)) || MISSION_COLORS[state.missions.length % MISSION_COLORS.length];
}

export function saveMission(m) {
  const mission = normalizeMission({ ...m, id: m.id || uid(), createdAt: m.createdAt || Date.now() });
  const missions = state.missions.some((x) => x.id === mission.id)
    ? state.missions.map((x) => (x.id === mission.id ? mission : x))
    : [...state.missions, mission];
  commit({ ...state, missions, settings: { ...state.settings, lastMissionId: state.settings.lastMissionId || mission.id } });
  return mission;
}

export function deleteMission(id) {
  commit({
    ...state,
    missions: state.missions.filter((m) => m.id !== id),
    entries: state.entries.filter((e) => e.missionId !== id),
    timer: state.timer?.missionId === id ? null : state.timer,
    settings: { ...state.settings, lastMissionId: state.settings.lastMissionId === id ? null : state.settings.lastMissionId },
  });
}

export const mission = (id) => state.missions.find((m) => m.id === id) || null;
export const activeMissions = () => state.missions.filter((m) => !m.archived);

// ---- journées ------------------------------------------------------------------------------

export function saveEntry(e) {
  const entry = normalizeEntry({ ...e, updatedAt: Date.now() });
  const entries = state.entries.some((x) => x.id === entry.id)
    ? state.entries.map((x) => (x.id === entry.id ? entry : x))
    : [...state.entries, entry];
  commit({ ...state, entries, settings: { ...state.settings, lastMissionId: entry.missionId } });
  return entry;
}

export function saveEntries(list) {
  const map = new Map(state.entries.map((e) => [e.id, e]));
  for (const e of list) {
    const n = normalizeEntry({ ...e, updatedAt: Date.now() });
    map.set(n.id, n);
  }
  commit({ ...state, entries: [...map.values()] });
}

export function deleteEntry(id) {
  const removed = state.entries.find((e) => e.id === id);
  commit({ ...state, entries: state.entries.filter((e) => e.id !== id) });
  return removed;
}

export const entry = (id) => state.entries.find((e) => e.id === id) || null;

// ---- réglages, pointeuse ------------------------------------------------------------------

export function setSettings(patch) {
  commit({ ...state, settings: normalizeSettings({ ...state.settings, ...patch }) });
}

export function setTimer(timer, opts) {
  commit({ ...state, timer }, opts);
}

export function restoreFromBackupText(txt) {
  // copie privée Android : utilisée seulement si le stockage du WebView est vide
  try {
    const data = sanitize(JSON.parse(txt));
    if (data.missions.length || data.entries.length) {
      commit(data);
      return true;
    }
  } catch { /* copie illisible */ }
  return false;
}
