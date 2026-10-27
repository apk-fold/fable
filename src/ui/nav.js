// Navigation par « hash » avec une pile : le bouton retour (Android ou flèche) remonte
// d'un écran, et depuis un onglet principal il quitte l'appli.

let depth = 0;
let listener = null;
let pendingTab = null;

export function initNav(onRoute) {
  listener = onRoute;
  depth = Number(history.state?.d) || 0;
  if (!location.hash) history.replaceState({ d: 0 }, '', '#/');
  else if (history.state?.d === undefined) history.replaceState({ d: 0 }, '', location.hash);
  window.addEventListener('popstate', (e) => {
    depth = Number(e.state?.d) || 0;
    if (pendingTab) {
      const h = pendingTab;
      pendingTab = null;
      depth = 0;
      history.replaceState({ d: 0 }, '', h);
    }
    listener?.(current());
  });
  listener?.(current());
}

export function current() {
  const raw = location.hash.replace(/^#/, '') || '/';
  const [path, qs = ''] = raw.split('?');
  const parts = path.split('/').filter(Boolean);
  return { path: '/' + parts.join('/'), parts, query: Object.fromEntries(new URLSearchParams(qs)) };
}

export function go(hash, { replace = false } = {}) {
  const target = hash.startsWith('#') ? hash : `#${hash}`;
  if (target === location.hash && !replace) return;
  if (replace) history.replaceState({ d: depth }, '', target);
  else {
    depth += 1;
    history.pushState({ d: depth }, '', target);
  }
  listener?.(current());
}

export const canGoBack = () => depth > 0;

export function back(fallback = '#/') {
  if (depth > 0) history.back();
  else go(fallback, { replace: true });
}

/** Ouvre un onglet principal en vidant la pile (barre d'onglets). */
export function goTab(hash) {
  if (depth > 0) {
    pendingTab = hash;
    history.go(-depth);
  } else {
    history.replaceState({ d: 0 }, '', hash);
    listener?.(current());
  }
}

/** Rafraîchit l'écran courant (données modifiées). */
export const refresh = () => listener?.(current());
