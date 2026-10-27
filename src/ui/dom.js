// Petits outils d'interface : échappement, formats, toasts, feuilles (bottom sheets), confirmations.
import { icon } from './icons.js';
import { haptic } from '../platform.js';

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
const dec2 = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const decMax = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 });

const nb = (s) => s.replace(/\u202f/g, '\u00a0');
export const money = (n) => nb(eur.format(Math.round((Number(n) + Number.EPSILON) * 100) / 100 || 0));
export const num2 = (n) => nb(dec2.format(Number(n) || 0));
export const numShort = (n) => nb(decMax.format(Number(n) || 0));
export const pct = (n) => `${numShort(n)}\u00a0%`;

/** « 14,88 » ou « 14.88 » → 14.88 ; vide ou illisible → null */
export function parseDecimal(v) {
  const s = String(v ?? '').trim().replace(/\s/g, '').replace(',', '.');
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export function plural(n, one, many) {
  return `${numShort(n)} ${Math.abs(n) >= 2 ? many : one}`;
}

// ---- toast ------------------------------------------------------------------------------------

let toastTimer = null;
export function toast(msg, { action, onAction, ms = 2800, kind = '' } = {}) {
  const el = document.getElementById('toast');
  if (!el) return;
  clearTimeout(toastTimer);
  el.className = `toast show ${kind}`;
  el.innerHTML = `<span>${esc(msg)}</span>${action ? `<button class="toast-act">${esc(action)}</button>` : ''}`;
  if (action) {
    el.querySelector('.toast-act').onclick = () => {
      el.className = 'toast';
      onAction?.();
    };
  }
  toastTimer = setTimeout(() => (el.className = 'toast'), action ? Math.max(ms, 4500) : ms);
}

// ---- feuilles (bottom sheets) -----------------------------------------------------------------

const openSheets = [];
export const hasOpenSheet = () => openSheets.length > 0;
export function closeTopSheet() {
  const s = openSheets[openSheets.length - 1];
  if (s) s.close();
  return !!s;
}

export function sheet({ title = '', html = '', onMount, onClose, cls = '' } = {}) {
  const host = document.getElementById('sheets');
  const wrap = document.createElement('div');
  wrap.className = 'sheet-wrap';
  wrap.innerHTML = `<div class="scrim"></div>
    <div class="sheet ${cls}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      <div class="grab"></div>
      ${title ? `<div class="sheet-head"><h3>${esc(title)}</h3><button class="ic-btn" data-close aria-label="Fermer">${icon('x', 20)}</button></div>` : ''}
      <div class="sheet-body">${html}</div>
    </div>`;
  host.appendChild(wrap);
  let closed = false;
  const api = {
    el: wrap.querySelector('.sheet'),
    close(result) {
      if (closed) return;
      closed = true;
      openSheets.splice(openSheets.indexOf(api), 1);
      wrap.classList.remove('open');
      setTimeout(() => wrap.remove(), 260);
      onClose?.(result);
    },
  };
  openSheets.push(api);
  wrap.querySelector('.scrim').onclick = () => api.close();
  wrap.querySelector('[data-close]')?.addEventListener('click', () => api.close());
  // glisser vers le bas pour fermer
  const sh = api.el;
  let y0 = null;
  let dy = 0;
  sh.querySelector('.grab').parentElement.addEventListener('touchstart', (e) => {
    if (sh.querySelector('.sheet-body').scrollTop > 0 && !e.target.closest('.grab,.sheet-head')) return;
    y0 = e.touches[0].clientY;
    dy = 0;
  }, { passive: true });
  sh.addEventListener('touchmove', (e) => {
    if (y0 === null) return;
    dy = Math.max(0, e.touches[0].clientY - y0);
    if (dy > 4) sh.style.transform = `translateY(${dy}px)`;
  }, { passive: true });
  sh.addEventListener('touchend', () => {
    if (y0 === null) return;
    y0 = null;
    sh.style.transform = '';
    if (dy > 110) api.close();
  });
  requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.add('open')));
  onMount?.(api.el, api);
  return api;
}

export function confirmSheet({ title, text = '', ok = 'Confirmer', cancel = 'Annuler', danger = false }) {
  return new Promise((resolve) => {
    let answer = false;
    sheet({
      title,
      html: `${text ? `<p class="sheet-text">${text}</p>` : ''}
        <div class="sheet-actions">
          <button class="btn ghost" data-no>${esc(cancel)}</button>
          <button class="btn ${danger ? 'danger' : 'primary'}" data-yes>${esc(ok)}</button>
        </div>`,
      onMount(el, s) {
        el.querySelector('[data-no]').onclick = () => s.close();
        el.querySelector('[data-yes]').onclick = () => {
          answer = true;
          haptic(danger ? 'warning' : 'light');
          s.close();
        };
      },
      onClose: () => resolve(answer),
    });
  });
}

/** Liste de choix ; renvoie la valeur choisie ou undefined */
export function choiceSheet({ title, options, value }) {
  return new Promise((resolve) => {
    let chosen;
    sheet({
      title,
      html: `<div class="choices">${options
        .map(
          (o, i) => `<button class="choice ${o.value === value ? 'on' : ''}" data-i="${i}">
            ${o.dot ? `<i class="dot" style="background:${esc(o.dot)}"></i>` : ''}
            ${o.icon ? icon(o.icon, 20) : ''}
            <span class="choice-txt"><b>${esc(o.label)}</b>${o.sub ? `<small>${esc(o.sub)}</small>` : ''}</span>
            ${o.value === value ? icon('check', 20, 'accent') : ''}
          </button>`,
        )
        .join('')}</div>`,
      onMount(el, s) {
        el.querySelectorAll('[data-i]').forEach((b) => {
          b.onclick = () => {
            chosen = options[Number(b.dataset.i)].value;
            haptic('select');
            s.close();
          };
        });
      },
      onClose: () => resolve(chosen),
    });
  });
}
