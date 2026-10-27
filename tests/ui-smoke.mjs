// Test de fumée de l'interface : parcourt les écrans principaux et enregistre des captures.
// Usage : node tests/ui-smoke.mjs <url> <dossier>
// (PW_PATH permet de pointer vers une installation de Playwright hors du projet.)
import { mkdirSync, writeFileSync } from 'node:fs';

const { chromium } = await import(process.env.PW_PATH || 'playwright');
const BASE = process.argv[2] || 'http://localhost:4173/';
const OUT = process.argv[3] || '/tmp/shots';
mkdirSync(OUT, { recursive: true });

const errs = [];
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, acceptDownloads: true, locale: 'fr-FR', timezoneId: 'Europe/Paris' });
const p = await ctx.newPage();
p.on('console', (m) => {
  if (m.type() === 'error') errs.push(`console: ${m.text()}`);
});
p.on('pageerror', (e) => errs.push(`pageerror: ${e.message}`));

const wait = (ms = 500) => p.waitForTimeout(ms);
const shot = async (n, full = false) => {
  await wait(650);
  await p.screenshot({ path: `${OUT}/${n}.png`, fullPage: full });
};
const go = async (h) => {
  await p.evaluate((hh) => {
    location.hash = hh;
  }, h);
  await wait(450);
};
const closeSheets = async () => {
  for (let i = 0; i < 4; i++) {
    if (!(await p.$('.sheet-wrap'))) break;
    await p.evaluate(() => [...document.querySelectorAll('.scrim')].pop()?.click());
    await wait(350);
  }
};

try {
  await p.goto(BASE);
  await p.waitForSelector('.welcome', { timeout: 15000 });
  await shot('01-bienvenue');

  await p.click('[data-act=demo]');
  await p.waitForSelector('.punch', { timeout: 5000 });
  await shot('02-accueil');

  await go('#/history');
  await shot('03-historique');
  await p.click('[data-seg=view] [data-v=cal]');
  await shot('04-calendrier');
  await p.click('[data-seg=view] [data-v=list]');

  await go('#/summary');
  await shot('05-resume');
  await p.evaluate(() => document.getElementById('view').scrollBy(0, 700));
  await shot('06-resume-detail');
  for (const kind of ['pdf', 'xlsx', 'csv']) {
    await p.click('[data-act=export]');
    await wait(400);
    const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 15000 }), p.click(`.choice:has-text("${kind === 'pdf' ? 'PDF' : kind === 'xlsx' ? 'Excel' : 'CSV'}")`)]);
    await dl.saveAs(`${OUT}/export.${kind}`);
    await wait(300);
  }
  await p.click('[data-seg=period] [data-v=week]');
  await shot('07-resume-semaine');
  await p.click('[data-seg=period] [data-v=year]');
  await shot('08-resume-annee');

  await go('#/missions');
  await shot('09-missions');
  await p.click('.mission-card');
  await wait();
  await shot('10-mission');
  for (const s of ['overtime', 'night', 'meal', 'holiday', 'pay']) {
    await go(`#/mission/demo-quai/${s}`);
    await shot(`11-mission-${s}`);
  }

  await go('#/entry/new');
  await shot('12-saisie');
  await p.click('[data-add="60"]');
  await shot('13-saisie-sup', true);

  await go('#/');
  await p.click('[data-act=start]');
  await wait(1200);
  await shot('14-pointeuse');

  await go('#/settings');
  await shot('15-reglages');
  await go('#/settings/look');
  await shot('18-perso');
  await p.click('[data-swatches=accent] [data-c="#FF7EB6"]');
  await p.click('[data-seg=theme] [data-v=black]');
  await p.click('[data-seg=radius] [data-v=sharp]');
  await p.click('[data-seg=displayFont] [data-v=serif]');
  await shot('19-perso-modifiee');
  const accent = await p.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim());
  if (accent.toUpperCase() !== '#FF7EB6') errs.push(`perso : couleur principale non appliquée (${accent})`);
  await go('#/settings/display');
  await p.click('[data-seg=durationStyle] [data-v=decimal]');
  await go('#/history');
  await shot('20-historique-perso');
  await go('#/settings/calc');
  await shot('21-calculs-feries');
  await go('#/settings/look');
  await p.click('[data-act=reset]');
  await wait(400);
  await p.click('[data-yes]');
  await wait(400);
  await go('#/settings/display');
  await p.click('[data-seg=durationStyle] [data-v=hm]');
  await go('#/settings/look');
  await p.click('[data-seg=theme] [data-v=light]');
  await go('#/');
  await shot('16-clair');
  await go('#/summary');
  await shot('17-clair-resume');
  await closeSheets();
} catch (e) {
  errs.push(`test: ${e.message}`);
  await p.screenshot({ path: `${OUT}/zz-erreur.png` }).catch(() => {});
}
// Parcours d'un nouvel utilisateur : création de mission, saisie, pointeuse, suppression
try {
  const c2 = await b.newContext({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 2, locale: 'fr-FR', timezoneId: 'Europe/Paris' });
  const q = await c2.newPage();
  q.on('pageerror', (e) => errs.push(`pageerror (parcours): ${e.message}`));
  q.on('console', (m) => {
    if (m.type() === 'error') errs.push(`console (parcours): ${m.text()}`);
  });
  await q.goto(BASE);
  await q.click('[data-go="#/mission/new"]');
  await q.fill('[name=name]', 'Cariste — Adecco');
  await q.click('[data-seg=contract] [data-v=cdd]');
  await q.fill('[name=rate]', '13,25');
  await q.click('[data-go="#/mission/new/night"]');
  await q.click('.switch');
  await q.waitForTimeout(300);
  await q.fill('[name="night.pct"]', '30');
  await q.screenshot({ path: `${OUT}/20-parcours-nuit.png` });
  await q.click('[data-back]');
  await q.waitForTimeout(400);
  const nightVal = await q.textContent('[data-go="#/mission/new/night"] .row-val');
  if (!nightVal.includes('30')) errs.push(`parcours : la majoration de nuit n'a pas été gardée (${nightVal})`);
  await q.click('[data-act=create]');
  await q.waitForTimeout(500);
  await q.screenshot({ path: `${OUT}/21-parcours-missions.png` });
  const nm = await q.evaluate(() => JSON.parse(localStorage.getItem('fable.data.v1')).missions.length);
  if (nm !== 1) errs.push(`parcours : ${nm} mission(s) au lieu de 1`);
  if (!(await q.$('.punch'))) errs.push('parcours : la pointeuse n’apparaît pas après la création');
  await q.evaluate(() => (location.hash = '#/entry/new?date=2026-10-25'));
  await q.waitForTimeout(400);
  await q.click('[data-act=save]');
  await q.waitForTimeout(500);
  const stored = await q.evaluate(() => JSON.parse(localStorage.getItem('fable.data.v1')));
  if (stored.entries.length !== 1 || stored.missions[0].night.pct !== 30 || stored.missions[0].rate !== 13.25 || stored.missions[0].contract !== 'cdd') errs.push(`parcours : données inattendues ${JSON.stringify(stored).slice(0, 300)}`);
  await q.evaluate(() => (location.hash = '#/history?m=2026-10'));
  await q.waitForTimeout(500);
  await q.screenshot({ path: `${OUT}/22-parcours-historique.png` });
  await q.click('.entry');
  await q.waitForTimeout(400);
  await q.click('[data-act=del]');
  await q.waitForTimeout(400);
  await q.click('[data-yes]');
  await q.waitForTimeout(600);
  const after = await q.evaluate(() => JSON.parse(localStorage.getItem('fable.data.v1')).entries.length);
  if (after !== 0) errs.push('parcours : la journée n’a pas été supprimée');
  await c2.close();
} catch (e) {
  errs.push(`parcours: ${e.message}`);
}

await b.close();
writeFileSync(`${OUT}/errors.txt`, errs.join('\n') || 'aucune erreur');
console.log(errs.length ? `ERREURS :\n${errs.join('\n')}` : 'Interface OK, aucune erreur.');
process.exit(errs.length ? 1 : 0);
