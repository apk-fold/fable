// Morceaux d'interface partagés entre les écrans.
import { icon } from './icons.js';
import { esc, money, pct } from './dom.js';
import { fmtDuration, DAYS_SHORT, MONTHS_SHORT, weekday, ymd } from '../core/time.js';
import { CONTRACTS, normalizeMission } from '../core/calc.js';

export function subHead(title, { actions = '' } = {}) {
  return `<header class="subhead">
    <button class="ic-btn" data-back aria-label="Retour">${icon('back', 24)}</button>
    <h2>${esc(title)}</h2>
    <div class="subhead-actions">${actions}</div>
  </header>`;
}

export function bigHead(title, { sub = '', actions = '' } = {}) {
  return `<header class="bighead">
    <div class="bighead-txt">${sub ? `<p class="eyebrow">${sub}</p>` : ''}<h1 class="display">${esc(title)}</h1></div>
    <div class="bighead-actions">${actions}</div>
  </header>`;
}

export const switchEl = (name, on, label = '') =>
  `<label class="switch" ${label ? `aria-label="${esc(label)}"` : ''}><input type="checkbox" name="${name}" ${on ? 'checked' : ''}><i></i></label>`;

export function seg(name, options, value, cls = '') {
  return `<div class="seg ${cls}" data-seg="${name}" role="tablist">${options
    .map(([v, l]) => `<button type="button" role="tab" data-v="${esc(v)}" class="${String(v) === String(value) ? 'on' : ''}" aria-selected="${String(v) === String(value)}">${l}</button>`)
    .join('')}</div>`;
}

export function field({ label = '', name, value = '', suffix = '', inputmode = 'decimal', placeholder = '', type = 'text', cls = '', attrs = '' }) {
  return `<label class="field ${cls}">
    ${label ? `<span class="field-label">${esc(label)}</span>` : ''}
    <span class="field-box"><input name="${name}" type="${type}" inputmode="${inputmode}" value="${esc(value)}" placeholder="${esc(placeholder)}" autocomplete="off" ${attrs}>${suffix ? `<em>${esc(suffix)}</em>` : ''}</span>
  </label>`;
}

/** Ligne de liste cliquable avec chevron */
export function row({ go = '', act = '', ic = '', icCls = '', title, sub = '', value = '', valueCls = '', danger = false }) {
  const attrs = go ? `data-go="${esc(go)}"` : act ? `data-act="${esc(act)}"` : '';
  return `<button class="row ${danger ? 'danger' : ''}" ${attrs}>
    ${ic ? `<span class="row-ic ${icCls}">${icon(ic, 22)}</span>` : ''}
    <span class="row-txt"><b>${esc(title)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</span>
    ${value !== '' ? `<span class="row-val ${valueCls}">${value}</span>` : ''}
    ${danger ? '' : icon('chevron', 18, 'row-chev')}
  </button>`;
}

export function dateBlock(iso, holiday = null) {
  const [, m, d] = ymd(iso);
  const wd = weekday(iso);
  return `<div class="dblock ${wd === 6 ? 'sun' : ''} ${holiday ? 'hol' : ''}">
    <small>${DAYS_SHORT[wd]}</small><b>${d}</b><small>${MONTHS_SHORT[m - 1]}</small>
  </div>`;
}

/** Carte d'une journée (historique, accueil) — r : résultat de computeMission */
export function entryCard(r, mission, { showMission = true } = {}) {
  const m = normalizeMission(mission || {});
  const sup = r.sup1 + r.sup2;
  const lines = [];
  lines.push(`<span class="ln strong">${esc(r.start)} ${icon('arrow', 14, 'arr')} ${esc(r.end)}${r.overnight ? '<em class="next">+1</em>' : ''}</span>`);
  if (r.pause) lines.push(`<span class="ln muted">Pause ${fmtDuration(r.pause)}</span>`);
  if (sup >= 0.5) lines.push(`<span class="ln t-sup">dont ${fmtDuration(sup)} sup.</span>`);
  if (r.night >= 0.5) lines.push(`<span class="ln t-night">Heures de nuit ${fmtDuration(r.night)}</span>`);
  if (m.sunday.enabled && r.sunday >= 0.5) lines.push(`<span class="ln t-sun">Dimanche +${pct(m.sunday.pct)}</span>`);
  if (r.holidayName) lines.push(`<span class="ln t-hol">${icon('flag', 13)} ${esc(r.holidayName)}${m.holiday.enabled && r.holiday >= 0.5 ? ` +${pct(m.holiday.pct)}` : ''}</span>`);
  if (r.meal) lines.push(`<span class="ln muted">${icon('meal', 14)} Panier repas ${money(r.meal)}</span>`);
  if (r.travel) lines.push(`<span class="ln muted">${icon('car', 14)} Trajet ${money(r.travel)}</span>`);
  return `<button class="entry" data-entry="${esc(r.id)}">
    ${dateBlock(r.date, r.holidayName)}
    <span class="entry-main">
      ${showMission ? `<span class="entry-title"><i class="dot" style="background:${esc(m.color)}"></i>${esc(m.name || 'Mission')}</span>` : ''}
      ${lines.join('')}
    </span>
    <span class="entry-side">
      <b class="num">${fmtDuration(r.net)}</b>
      ${m.rate ? `<span class="money num">≈ ${money(r.amount)}</span>` : ''}
      ${icon('chevron', 18, 'row-chev')}
    </span>
  </button>`;
}

export function missionChips(missions, selected, name = 'mission') {
  if (missions.length < 2) return '';
  return `<div class="chips" data-chips="${name}">${missions
    .map((m) => `<button type="button" class="chip ${m.id === selected ? 'on' : ''}" data-v="${esc(m.id)}"><i class="dot" style="background:${esc(m.color)}"></i>${esc(m.name || 'Mission')}</button>`)
    .join('')}</div>`;
}

export const contractLabel = (c) => CONTRACTS[c]?.label || 'Autre';

export function emptyState({ ic = 'history', title, text = '', action = '', act = '' }) {
  return `<div class="empty">
    <div class="empty-ic">${icon(ic, 30)}</div>
    <h3>${esc(title)}</h3>
    ${text ? `<p>${text}</p>` : ''}
    ${action ? `<button class="btn primary" data-act="${esc(act)}">${icon('plus', 18)} ${esc(action)}</button>` : ''}
  </div>`;
}

export function info(text, ic = 'info', cls = '') {
  return `<div class="note ${cls}">${icon(ic, 20)}<p>${text}</p></div>`;
}

/** Délégation simple des segments, interrupteurs et puces d'un conteneur */
export function bindSeg(root, name, fn) {
  const el = root.querySelector(`[data-seg="${name}"]`);
  if (!el) return;
  el.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-v]');
    if (!b) return;
    el.querySelectorAll('button').forEach((x) => {
      x.classList.toggle('on', x === b);
      x.setAttribute('aria-selected', String(x === b));
    });
    fn(b.dataset.v);
  });
}

export function bindChips(root, name, fn) {
  const el = root.querySelector(`[data-chips="${name}"]`);
  if (!el) return;
  el.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-v]');
    if (!b) return;
    el.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
    fn(b.dataset.v);
  });
}
