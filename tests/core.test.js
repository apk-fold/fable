import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeMission, summarize, normalizeMission, span } from '../src/core/calc.js';
import { easter, holidayName } from '../src/core/holidays.js';
import { isoWeek, payPeriod, payMonthOf, weekday, fmtDuration, weekStart } from '../src/core/time.js';

const close = (a, b, eps = 0.011) => assert.ok(Math.abs(a - b) < eps, `${a} ≠ ${b}`);
let n = 0;
const day = (date, start, end, pause = 30, missionId = 'm') => ({ id: `e${++n}`, missionId, date, start, end, pause });

// Mission « agent de quai » des captures : 14,88 €/h, sup dès 35 h à 25 %, nuit 21 h–6 h à 25 %, dimanche 50 %, panier 6 €
const quai = normalizeMission({
  id: 'm',
  name: 'Agent de quai',
  contract: 'cdd',
  rate: 14.88,
  overtime: { enabled: true, t1: { from: 35, pct: 25 } },
  night: { enabled: true, start: '21:00', end: '06:00', pct: 25 },
  sunday: { enabled: true, pct: 50 },
  meal: { enabled: true, amount: 6, rule: 'day' },
});

test('dates : semaine ISO, jour de la semaine, durées', () => {
  assert.equal(isoWeek('2026-10-27').week, 44);
  assert.equal(isoWeek('2027-01-01').week, 53);
  assert.equal(weekday('2026-10-25'), 6); // dimanche
  assert.equal(weekStart('2026-10-25'), '2026-10-19');
  assert.equal(fmtDuration(450), '7\u00a0h\u00a030');
  assert.equal(fmtDuration(480), '8\u00a0h');
  assert.equal(fmtDuration(45), '45\u00a0min');
});

test('période de paie décalée (du 21 au 20)', () => {
  assert.deepEqual(payPeriod(2026, 10, 1), { from: '2026-10-01', to: '2026-10-31' });
  assert.deepEqual(payPeriod(2026, 10, 21), { from: '2026-09-21', to: '2026-10-20' });
  assert.deepEqual(payPeriod(2026, 1, 21), { from: '2025-12-21', to: '2026-01-20' });
  assert.deepEqual(payMonthOf('2026-10-25', 21), { y: 2026, m: 11 });
  assert.deepEqual(payMonthOf('2026-12-28', 21), { y: 2027, m: 1 });
});

test('Pâques et jours fériés (Alsace-Moselle compris)', () => {
  assert.equal(easter(2024), '2024-03-31');
  assert.equal(easter(2025), '2025-04-20');
  assert.equal(easter(2026), '2026-04-05');
  assert.equal(easter(2027), '2027-03-28');
  assert.equal(holidayName('2026-05-14'), 'Ascension');
  assert.equal(holidayName('2026-05-25'), 'Lundi de Pentecôte');
  assert.equal(holidayName('2026-04-03'), null);
  assert.equal(holidayName('2026-04-03', true), 'Vendredi saint');
  assert.equal(holidayName('2026-12-26', true), 'Saint-Étienne');
});

test('journée qui passe minuit', () => {
  const s = span({ date: '2026-10-24', start: '21:00', end: '05:00', pause: 30 });
  assert.equal(s.gross, 480);
  assert.equal(s.net, 450);
  assert.equal(s.overnight, true);
});

test('semaine des captures : sup à partir de 35 h, nuit et dimanche', () => {
  const entries = ['2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-24'].map((d) => day(d, '21:00', '05:00'));
  entries.push(day('2026-10-25', '21:00', '05:30'));
  const r = computeMission(quai, entries);
  const thu = r.get(entries[3].id);
  close(thu.net, 450);
  close(thu.night, 450);
  close(thu.amount, 139.5); // 7,5 h × 14,88 + 25 % de nuit
  const sat = r.get(entries[4].id);
  close(sat.sup1, 150); // 30 h avant samedi → 2 h 30 au-delà de 35 h
  close(sat.amount, 148.8); // même montant que l'appli d'origine
  const sun = r.get(entries[5].id);
  close(sun.net, 480);
  close(sun.sup1, 480);
  close(sun.sunday, 480);
  // 8 h × 14,88 = 119,04 ; +25 % sup 29,76 ; +25 % nuit 29,76 ; +50 % dimanche 59,52
  close(sun.amount, 238.08);
  assert.equal(sun.meal, 6);
});

test('deux paliers d’heures sup (25 % puis 50 % au-delà de 43 h)', () => {
  const m = normalizeMission({ id: 'p', rate: 10, overtime: { enabled: true, t1: { from: 35, pct: 25 }, t2: { enabled: true, from: 43, pct: 50 } } });
  const e = ['2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06'].map((d) => day(d, '07:00', '16:12', 0, 'p')); // 5 × 9 h 12 = 46 h
  const s = summarize([m], e, { from: '2026-11-02', to: '2026-11-08' }).total;
  close(s.net, 46 * 60);
  close(s.sup1, 8 * 60);
  close(s.sup2, 3 * 60);
  close(s.base, 460);
  close(s.majo.sup1, 8 * 10 * 0.25);
  close(s.majo.sup2, 3 * 10 * 0.5);
});

test('heures sup au jour (seuil journalier)', () => {
  const m = normalizeMission({ id: 'd', rate: 10, overtime: { enabled: true, basis: 'day', t1: { from: 8, pct: 25 } } });
  const r = computeMission(m, [day('2026-11-02', '08:00', '18:00', 0, 'd'), day('2026-11-03', '08:00', '16:00', 0, 'd')]);
  const [a, b] = [...r.values()];
  close(a.sup1, 120);
  close(b.sup1, 0);
});

test('jour férié majoré + pause retirée au prorata', () => {
  const m = normalizeMission({ id: 'h', rate: 12, overtime: { enabled: false }, holiday: { enabled: true, pct: 100 } });
  const r = [...computeMission(m, [day('2026-11-11', '08:00', '15:30', 30, 'h')]).values()][0];
  assert.equal(r.holidayName, 'Armistice 1918');
  close(r.net, 420);
  close(r.holiday, 420);
  close(r.amount, 7 * 12 * 2);
});

test('cumul : « garder la plus forte » au lieu d’additionner', () => {
  const add = normalizeMission({ ...quai, id: 'a', overtime: { enabled: false } });
  const max = normalizeMission({ ...quai, id: 'x', overtime: { enabled: false }, stacking: 'max' });
  const ea = day('2026-10-25', '21:00', '05:00', 0, 'a');
  const ex = day('2026-10-25', '21:00', '05:00', 0, 'x');
  const ra = computeMission(add, [ea]).get(ea.id);
  const rx = computeMission(max, [ex]).get(ex.id);
  close(ra.amount, 8 * 14.88 * 1.75);
  close(rx.amount, 8 * 14.88 * 1.5);
});

test('dimanche « heure par heure » : seules les heures après minuit samedi→dimanche comptent', () => {
  const m = normalizeMission({ ...quai, id: 'r', split: 'real', overtime: { enabled: false } });
  const e = day('2026-10-24', '21:00', '05:00', 0, 'r');
  const r = computeMission(m, [e]).get(e.id);
  close(r.sunday, 300);
});

test('panier à partir d’un nombre d’heures + forçage manuel', () => {
  const m = normalizeMission({ id: 'k', rate: 10, meal: { enabled: true, amount: 7.5, rule: 'hours', minHours: 5 } });
  const short = day('2026-11-02', '08:00', '12:00', 0, 'k');
  const long = day('2026-11-03', '08:00', '14:00', 0, 'k');
  const forced = { ...day('2026-11-04', '08:00', '10:00', 0, 'k'), meal: 'yes' };
  const none = { ...day('2026-11-05', '08:00', '18:00', 0, 'k'), meal: 'no' };
  const r = computeMission(m, [short, long, forced, none]);
  assert.equal(r.get(short.id).meal, 0);
  assert.equal(r.get(long.id).meal, 7.5);
  assert.equal(r.get(forced.id).meal, 7.5);
  assert.equal(r.get(none.id).meal, 0);
});

test('fin de mission (IFM) et congés payés (ICCP) sur le brut, net estimé', () => {
  const m = normalizeMission({ id: 'i', contract: 'interim', rate: 12.5, overtime: { enabled: false }, meal: { enabled: true, amount: 5 } });
  const e = Array.from({ length: 10 }, (_, i) => day(`2026-11-${String(i + 2).padStart(2, '0')}`, '08:00', '16:00', 0, 'i'));
  const t = summarize([m], e, { from: '2026-11-01', to: '2026-11-30', netRate: 22 }).total;
  close(t.salary, 1000);
  close(t.endBonus, 100);
  close(t.paidLeave, 110);
  close(t.gross, 1210);
  close(t.meal, 50);
  close(t.netEstimate, 1210 * 0.78 + 50);
  const cdi = normalizeMission({ id: 'c', contract: 'cdi' });
  assert.equal(cdi.endBonus.enabled, false);
  assert.equal(cdi.paidLeave.enabled, false);
});

test('résumé multi-missions : un jour à deux employeurs compte pour un jour travaillé', () => {
  const a = normalizeMission({ id: 'A', rate: 10, overtime: { enabled: false } });
  const b = normalizeMission({ id: 'B', rate: 20, overtime: { enabled: false } });
  const s = summarize([a, b], [day('2026-11-02', '06:00', '10:00', 0, 'A'), day('2026-11-02', '14:00', '18:00', 0, 'B')], { from: '2026-11-01', to: '2026-11-30' });
  assert.equal(s.total.days, 1);
  close(s.total.salary, 40 + 80);
  assert.equal(s.perMission.length, 2);
});

test('les heures sup tiennent compte de la semaine à cheval sur deux mois', () => {
  const m = normalizeMission({ id: 'w', rate: 10, overtime: { enabled: true, t1: { from: 35, pct: 25 } } });
  // semaine du lundi 28 sept au dimanche 4 oct 2026 : 3 × 8 h fin septembre, puis les 1er et 2 octobre
  const e = ['2026-09-28', '2026-09-29', '2026-09-30', '2026-10-01', '2026-10-02'].map((d) => day(d, '08:00', '16:00', 0, 'w'));
  const oct = summarize([m], e, { from: '2026-10-01', to: '2026-10-31' }).total;
  close(oct.net, 16 * 60);
  close(oct.sup1, 5 * 60); // 32 h le 1er au soir → 5 h sup le 2 octobre
});
