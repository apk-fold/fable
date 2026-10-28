import { initI18n } from './i18n.js';
// Démarrage de Fable : données, thème, navigation, barre d'onglets, bouton retour.
import * as store from './core/store.js';
import { initNav, go, back, goTab, canGoBack, current, refresh } from './ui/nav.js';
import { icon } from './ui/icons.js';
import { closeTopSheet, setHideMoney } from './ui/dom.js';
import { onLifecycle, exitApp, setHaptics, privateBackup, isNative } from './platform.js';
import { applyAppearance } from './ui/theme.js';
import { setDurationStyle } from './core/time.js';
import * as today from './views/today.js';
import * as history from './views/history.js';
import * as summary from './views/summary.js';
import * as missions from './views/missions.js';
import * as entry from './views/entry.js';
import * as settings from './views/settings.js';

initI18n({ app: 'fable', exclude: ['.entry-note', '.mission-name', '.mission-title'] });

const TABS = [
  { hash: '#/', path: '/', label: 'Aujourd’hui', ic: 'today' },
  { hash: '#/history', path: '/history', label: 'Historique', ic: 'history' },
  { hash: '#/summary', path: '/summary', label: 'Résumé', ic: 'summary' },
  { hash: '#/missions', path: '/missions', label: 'Missions', ic: 'missions' },
];

function resolve(route) {
  const [a, b, c] = route.parts;
  if (!a) return { render: today.render, tab: '/', live: true, cleanup: today.cleanup };
  if (a === 'history') return { render: history.render, tab: '/history', live: true };
  if (a === 'summary') return { render: summary.render, tab: '/summary', live: true };
  if (a === 'missions') return { render: missions.renderList, tab: '/missions', live: true };
  if (a === 'settings') return { render: settings.render, sub: true, parent: b ? '#/settings' : '#/' };
  if (a === 'entry' && b) return { render: entry.render, sub: true, parent: '#/history' };
  if (a === 'mission' && b && !c) return { render: missions.renderEditor, sub: true, parent: '#/missions' };
  if (a === 'mission' && b && c) return { render: missions.renderSection, sub: true, parent: `#/mission/${b}` };
  return { render: today.render, tab: '/', live: true, cleanup: today.cleanup };
}

const view = document.getElementById('view');
const tabs = document.getElementById('tabs');
let active = null;
const scrolls = new Map();
let lastHash = '';

function drawTabs(tabPath) {
  const running = !!store.get().timer;
  tabs.innerHTML = TABS.map(
    (t) => `<button class="tab ${t.path === tabPath ? 'on' : ''}" data-tab="${t.hash}" aria-label="${t.label}" ${t.path === tabPath ? 'aria-current="page"' : ''}>
      <span class="tab-ic">${icon(t.ic, 23)}${t.path === '/' && running ? '<i class="tab-live"></i>' : ''}</span><span class="tab-label">${t.label}</span></button>`,
  ).join('');
}

function show(route, { keepScroll = false } = {}) {
  if (lastHash) scrolls.set(lastHash, view.scrollTop);
  active?.cleanup?.();
  const r = resolve(route);
  active = r;
  document.body.classList.toggle('is-sub', !!r.sub);
  if (r.tab) drawTabs(r.tab);
  r.render(view, route);
  const hash = location.hash || '#/';
  if (!keepScroll) {
    view.classList.remove('enter');
    void view.offsetWidth;
    view.classList.add('enter');
  }
  view.scrollTop = keepScroll || scrolls.has(hash) ? scrolls.get(hash) || 0 : 0;
  lastHash = hash;
}

// ---- apparence -----------------------------------------------------------------------------------

function applyLook() {
  const st = store.get().settings;
  applyAppearance(st);
  setDurationStyle(st.durationStyle);
  setHideMoney(st.hideMoney);
}
document.addEventListener('fable:theme', applyLook);

// ---- clics globaux -------------------------------------------------------------------------------

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-tab],[data-back],[data-go],[data-entry],[data-wk]');
  if (!el || el.disabled) return;
  if (el.dataset.tab) return goTab(el.dataset.tab);
  if (el.hasAttribute('data-back')) return back(active?.parent || '#/');
  if (el.dataset.go) return go(el.dataset.go);
  if (el.dataset.entry) return go(`#/entry/${el.dataset.entry}`);
  if (el.dataset.wk) {
    const ids = el.dataset.ids ? el.dataset.ids.split(',') : [];
    return go(ids.length ? `#/entry/${ids[0]}` : `#/entry/new?date=${el.dataset.wk}`);
  }
});

// ---- démarrage ---------------------------------------------------------------------------------

async function boot() {
  store.load();
  if (isNative && store.isEmpty()) {
    const txt = await privateBackup.read();
    if (txt) store.restoreFromBackupText(txt);
  }
  store.setPersistHook((text) => privateBackup.write(text).catch(() => {}));
  setHaptics(store.get().settings.haptics);
  applyLook();

  let lookKey = '';
  store.subscribe((s) => {
    setHaptics(s.settings.haptics);
    const k = JSON.stringify([s.settings.theme, s.settings.look, s.settings.durationStyle, s.settings.hideMoney]);
    if (k !== lookKey) {
      lookKey = k;
      applyLook();
    }
    if (active?.tab) drawTabs(active.tab);
    if (active?.live) show(current(), { keepScroll: true });
  });

  onLifecycle({
    resume: () => {
      if (active?.live) show(current(), { keepScroll: true });
    },
    back: () => {
      if (closeTopSheet()) return;
      if (canGoBack()) return back();
      const r = current();
      if (r.path !== '/') return goTab('#/');
      exitApp();
    },
  });

  const start = store.get().settings.startTab;
  initNav((route) => show(route));
  if (start !== '/' && current().path === '/' && store.get().missions.length) goTab(`#${start}`);
  document.body.classList.add('ready');
}

boot();

export { refresh };
