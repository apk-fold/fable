import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as store from '../src/core/store.js';
import { fmtDuration } from '../src/core/time.js';

test('une ancienne sauvegarde sans personnalisation reçoit les valeurs par défaut', () => {
  const d = store.sanitize({ missions: [{ id: 'a', name: 'A' }], entries: [], settings: { theme: 'light' } });
  assert.equal(d.settings.theme, 'light');
  assert.equal(d.settings.look.accent, '#C8F25A');
  assert.equal(d.settings.holidayRegion, 'fr');
  assert.equal(d.settings.durationStyle, 'hm');
});

test('les réglages invalides sont remplacés', () => {
  const d = store.sanitize({ missions: [], entries: [], settings: { theme: 'rose', look: { accent: 'rouge', textScale: 7, radius: 'x', colors: { sup: '#123456' } }, startTab: '/nulle-part' } });
  assert.equal(d.settings.theme, 'dark');
  assert.equal(d.settings.look.accent, '#C8F25A');
  assert.equal(d.settings.look.textScale, 1);
  assert.equal(d.settings.look.radius, 'normal');
  assert.equal(d.settings.look.colors.sup, '#123456');
  assert.equal(d.settings.startTab, '/');
});

test('le calendrier des fériés s’applique à toutes les missions', () => {
  store.replaceAll({ missions: [{ id: 'a', name: 'A', holiday: { enabled: true, pct: 100 } }, { id: 'b', name: 'B' }], entries: [] });
  store.setHolidayRegion('alsace');
  assert.ok(store.get().missions.every((m) => m.holiday.alsace));
  assert.equal(store.get().missions[0].holiday.pct, 100);
  store.setHolidayRegion('fr');
  assert.ok(store.get().missions.every((m) => !m.holiday.alsace));
  assert.equal(store.get().settings.holidayRegion, 'fr');
});

test('personnalisation : changement partiel des couleurs', () => {
  store.setLook({ accent: '#7C9CFF' });
  store.setLook({ colors: { ...store.get().settings.look.colors, night: '#00FF00' } });
  const L = store.get().settings.look;
  assert.equal(L.accent, '#7C9CFF');
  assert.equal(L.colors.night, '#00FF00');
  assert.equal(L.colors.sup, '#FFB547');
});

test('format des durées', () => {
  assert.equal(fmtDuration(450, { style: 'decimal' }), '7,5 h');
  assert.equal(fmtDuration(450, { style: 'compact' }), '7h30');
  assert.equal(fmtDuration(445, { style: 'decimal' }), '7,42 h');
});
