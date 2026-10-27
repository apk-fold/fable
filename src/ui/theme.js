// Apparence : thème, couleurs, polices, taille du texte, coins, densité, animations.
// Tout passe par des variables CSS posées sur <html>, recalculées à chaque changement de réglage.
import { setSystemBars } from '../platform.js';

export const ACCENTS = ['#C8F25A', '#7CE0A3', '#5ED3F3', '#7C9CFF', '#B48CFF', '#FF7EB6', '#FF8A5B', '#FFC94A', '#F2EDE4'];
export const CATEGORY_PRESETS = {
  sup: ['#FFB547', '#FF8A5B', '#FFD166', '#F97316'],
  night: ['#A3ACFF', '#7C9CFF', '#5ED3F3', '#B48CFF'],
  sun: ['#FF8A7A', '#FF5C7A', '#FF7EB6', '#F59E0B'],
  hol: ['#F584C6', '#C084FC', '#FF5C7A', '#34D399'],
};
export const DISPLAY_FONTS = {
  unbounded: "'Unbounded', 'Manrope', sans-serif",
  manrope: "'Manrope', system-ui, sans-serif",
  system: 'system-ui, Roboto, sans-serif',
  serif: "Georgia, 'Noto Serif', serif",
};
export const BODY_FONTS = { manrope: "'Manrope', system-ui, sans-serif", system: 'system-ui, Roboto, sans-serif' };
const RADIUS = { sharp: 0.4, normal: 1, round: 1.35 };

// ---- couleurs ------------------------------------------------------------------------------------

const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const toHex = ([r, g, b]) => '#' + [r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('');
const lum = (hex) => {
  const [r, g, b] = rgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const mix = (a, b, t) => {
  const A = rgb(a);
  const B = rgb(b);
  return toHex(A.map((v, i) => v + (B[i] - v) * t));
};
/** Assombrit / éclaircit une couleur jusqu'à être lisible sur le fond donné. */
function readable(color, bg, min) {
  if (contrast(color, bg) >= min) return color;
  const target = lum(bg) > 0.5 ? '#000000' : '#FFFFFF';
  for (let t = 0.05; t <= 1; t += 0.05) {
    const c = mix(color, target, t);
    if (contrast(c, bg) >= min) return c;
  }
  return target;
}

const THEMES = {
  dark: { bg: '#0B0D0C', blur: 'rgba(11, 13, 12, 0.78)', s1: '#141815', s2: '#1B201C', s3: '#252B26', dark: true },
  black: { bg: '#000000', blur: 'rgba(0, 0, 0, 0.8)', s1: '#0D0F0E', s2: '#161917', s3: '#202421', dark: true },
  light: { bg: '#F3F4EE', blur: 'rgba(243, 244, 238, 0.82)', s1: '#FFFFFF', s2: '#EEF0E8', s3: '#E2E6DB', dark: false },
};

const mq = typeof window !== 'undefined' ? window.matchMedia?.('(prefers-color-scheme: light)') : null;

export function resolveTheme(pref) {
  if (pref === 'auto') return mq?.matches ? 'light' : 'dark';
  return THEMES[pref] ? pref : 'dark';
}

export function applyAppearance(settings) {
  const root = document.documentElement;
  const name = resolveTheme(settings.theme);
  const T = THEMES[name];
  const L = settings.look;
  root.dataset.theme = T.dark ? 'dark' : 'light';
  root.dataset.variant = name;
  const set = (k, v) => root.style.setProperty(k, v);
  if (T.dark) {
    set('--bg', T.bg);
    set('--bg-blur', T.blur);
    set('--surface', T.s1);
    set('--surface-2', T.s2);
    set('--surface-3', T.s3);
  } else {
    for (const k of ['--bg', '--bg-blur', '--surface', '--surface-2', '--surface-3']) root.style.removeProperty(k);
  }
  const card = T.s1;
  set('--accent', L.accent);
  set('--accent-rgb', rgb(L.accent).join(', '));
  set('--on-accent', contrast(L.accent, '#111111') >= contrast(L.accent, '#FFFFFF') ? '#111606' : '#FFFFFF');
  set('--accent-ink', readable(L.accent, card, 4.5));
  for (const [k, v] of Object.entries(L.colors)) set(`--${k}`, readable(v, card, 3.6));
  set('--font-display', DISPLAY_FONTS[L.displayFont]);
  set('--font-body', BODY_FONTS[L.bodyFont]);
  set('--zoom', String(L.textScale));
  set('--rk', String(RADIUS[L.radius]));
  root.dataset.density = L.density;
  root.dataset.motion = L.motion ? 'on' : 'off';
  setSystemBars(T.dark, T.bg);
}

mq?.addEventListener?.('change', () => document.dispatchEvent(new CustomEvent('fable:theme')));
