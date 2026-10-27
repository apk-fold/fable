// Données d'exemple pour découvrir l'appli (proposées seulement quand tout est vide).
import * as store from './store.js';
import { todayIso, addDays, weekStart, weekday } from './time.js';
import { MISSION_COLORS } from './calc.js';

export function loadDemo() {
  const quai = {
    id: 'demo-quai',
    name: 'Agent de quai (exemple)',
    contract: 'interim',
    rate: 14.88,
    color: MISSION_COLORS[0],
    overtime: { enabled: true, basis: 'week', t1: { from: 35, pct: 25 }, t2: { enabled: true, from: 43, pct: 50 } },
    night: { enabled: true, start: '21:00', end: '06:00', pct: 25 },
    sunday: { enabled: true, pct: 50 },
    holiday: { enabled: true, pct: 100, alsace: false },
    meal: { enabled: true, amount: 6, rule: 'day', minHours: 5 },
    defaultStart: '21:00',
    defaultEnd: '05:00',
    defaultPause: 30,
    createdAt: Date.now(),
  };
  const prepa = {
    id: 'demo-prepa',
    name: 'Préparateur (exemple)',
    contract: 'cdd',
    rate: 12.4,
    color: MISSION_COLORS[1],
    overtime: { enabled: true, basis: 'week', t1: { from: 35, pct: 25 }, t2: { enabled: false, from: 43, pct: 50 } },
    meal: { enabled: true, amount: 5.5, rule: 'hours', minHours: 5 },
    travel: { enabled: true, amount: 3.2 },
    defaultStart: '06:00',
    defaultEnd: '13:00',
    defaultPause: 20,
    createdAt: Date.now(),
  };
  const t = todayIso();
  const entries = [];
  let n = 0;
  const add = (missionId, date, start, end, pause, extra = {}) => entries.push({ id: `demo-${++n}`, missionId, date, start, end, pause, ...extra });
  const first = weekStart(addDays(t, -42));
  for (let d = first; d < t; d = addDays(d, 1)) {
    const wd = weekday(d);
    const wk = Math.floor((new Date(d) - new Date(first)) / (7 * 864e5));
    if (wd <= 3) add('demo-quai', d, '21:00', wd === 3 && wk % 2 ? '05:30' : '05:00', 30);
    if (wd === 5 && wk % 2 === 0) add('demo-quai', d, '21:00', '05:00', 30);
    if (wd === 6 && wk % 3 === 1) add('demo-quai', d, '21:00', '05:30', 30, { note: 'Renfort inventaire' });
    if (wd === 5 && wk % 2 === 1) add('demo-prepa', d, '07:00', '13:00', 20);
  }
  const s = store.get();
  store.replaceAll({ ...s, missions: [quai, prepa], entries, settings: { ...s.settings, lastMissionId: 'demo-quai', welcomed: true } });
}
