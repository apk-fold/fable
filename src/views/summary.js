// Résumé : semaine / mois (période de paie) / année, détail du brut, graphique, exports.
import * as store from '../core/store.js';
import { summarize, normalizeMission, CONTRACTS } from '../core/calc.js';
import { todayIso, ymd, pad, weekRange, payPeriod, yearRange, addDays, isoWeek, monthLabel, fmtDuration, MONTHS_SHORT, eachDay, weekday, DAYS_SHORT, payMonthOf, fmtDateShort } from '../core/time.js';
import { icon } from '../ui/icons.js';
import { esc, money, pct, choiceSheet, sheet, toast } from '../ui/dom.js';
import { bigHead, seg, bindSeg, gearBtn } from '../ui/components.js';
import { haptic } from '../platform.js';

let period = 'month';
let anchor = null;
let filter = 'all';

export function rangeFor(p, a, mission) {
  if (p === 'week') {
    const r = weekRange(a);
    const [, m1, d1] = ymd(r.from);
    const [y2, m2, d2] = ymd(r.to);
    return { ...r, title: `Semaine ${isoWeek(a).week}`, sub: `${d1}${m1 !== m2 ? ` ${MONTHS_SHORT[m1 - 1]}` : ''} – ${d2} ${MONTHS_SHORT[m2 - 1]} ${y2}`, word: 'de la semaine' };
  }
  if (p === 'year') {
    const [y] = ymd(a);
    return { ...yearRange(y), title: String(y), sub: '', word: "de l'année" };
  }
  const [y, m] = ymd(a);
  const start = mission ? mission.payStartDay : 1;
  const r = payPeriod(y, m, start);
  return { ...r, title: monthLabel(y, m), sub: start > 1 ? `Paie du ${fmtDateShort(r.from)} au ${fmtDateShort(r.to)}` : '', word: 'du mois' };
}

export function render(root, route) {
  const s = store.get();
  if (route.query.p && ['week', 'month', 'year'].includes(route.query.p)) period = route.query.p;
  if (filter !== 'all' && !store.mission(filter)) filter = 'all';
  const fm = filter === 'all' ? null : normalizeMission(store.mission(filter));
  if (!anchor) {
    const t = todayIso();
    const pm = fm ? payMonthOf(t, fm.payStartDay) : null;
    anchor = pm ? `${pm.y}-${pad(pm.m)}-01` : t;
  }
  const R = rangeFor(period, anchor, fm);
  const sum = summarize(s.missions, s.entries, { from: R.from, to: R.to, missionId: fm?.id || null, netRate: s.settings.netRate });
  const t = sum.total;
  const multi = s.missions.length > 1;

  root.innerHTML = `${bigHead('Résumé', { actions: gearBtn() })}
    ${seg('period', [['week', 'Semaine'], ['month', 'Mois'], ['year', 'Année']], period, 'wide')}
    <div class="period-nav">
      <button class="ic-btn" data-act="prev" aria-label="Précédent">${icon('left', 24)}</button>
      <div class="period-label"><b>${esc(R.title)}</b>${R.sub ? `<small>${esc(R.sub)}</small>` : ''}</div>
      <button class="ic-btn" data-act="next" aria-label="Suivant">${icon('right', 24)}</button>
    </div>
    ${multi ? `<button class="pill full" data-act="mission">${fm ? `<i class="dot" style="background:${esc(fm.color)}"></i><span>${esc(fm.name)}</span>` : `${icon('missions', 18)}<span>Toutes les missions</span>`}${icon('chevronDown', 16)}</button>` : ''}

    <section class="card hero">
      <p class="muted">Total ${R.word}</p>
      <div class="hero-hours display num">${fmtDuration(t.net)}</div>
      <p class="hero-sub">heures travaillées</p>
      <button class="hero-money" data-act="how"><span class="num">≈ ${money(t.gross)} brut</span>${icon('info', 18)}</button>
      <p class="muted small num">≈ ${money(t.netEstimate)} net estimé</p>
    </section>

    <div class="tiles">
      ${tile('plus', 'Heures sup.', fmtDuration(t.sup), t.sup2 >= 1 ? `dont ${fmtDuration(t.sup2)} au 2ᵉ palier` : '', 't-sup')}
      ${tile('calendar', 'Jours travaillés', String(t.days), t.days ? `${fmtDuration(t.net / t.days)} / jour` : '')}
      ${tile('moon', 'Heures de nuit', fmtDuration(t.night), '', 't-night')}
      ${t.sunday >= 1 ? tile('sun', 'Dimanche', fmtDuration(t.sunday), '', 't-sun') : ''}
      ${t.holiday >= 1 ? tile('flag', 'Jours fériés', fmtDuration(t.holiday), '', 't-hol') : ''}
      ${tile('coffee', 'Pauses', fmtDuration(t.pause), '')}
    </div>

    ${t.entries ? chart(period, R, sum) : ''}
    ${t.entries ? detail(t, fm, s.settings.netRate) : `<div class="card empty-card"><p>Aucune journée sur cette période.</p><button class="btn soft" data-go="#/entry/new">${icon('plus', 18)} Ajouter une journée</button></div>`}
    ${!fm && sum.perMission.length > 1 ? perMission(sum.perMission) : ''}

    <section class="card">
      <button class="row" data-act="export">
        <span class="row-ic accent-bg">${icon('file', 22)}</span>
        <span class="row-txt"><b>Exporter le résumé</b><small>PDF · Excel · CSV — gratuit, sans compte</small></span>
        ${icon('chevron', 18, 'row-chev')}
      </button>
    </section>`;

  bindSeg(root, 'period', (v) => {
    period = v;
    render(root, { ...route, query: {} });
  });
  const shift = (d) => {
    if (period === 'week') anchor = addDays(anchor, 7 * d);
    else if (period === 'year') {
      const [y] = ymd(anchor);
      anchor = `${y + d}-01-01`;
    } else {
      let [y, m] = ymd(anchor);
      m += d;
      if (m < 1) {
        m = 12;
        y -= 1;
      } else if (m > 12) {
        m = 1;
        y += 1;
      }
      anchor = `${y}-${pad(m)}-01`;
    }
    haptic('select');
    render(root, { ...route, query: {} });
  };
  root.querySelector('[data-act=prev]').onclick = () => shift(-1);
  root.querySelector('[data-act=next]').onclick = () => shift(1);
  root.querySelector('[data-act=mission]')?.addEventListener('click', async () => {
    const v = await choiceSheet({
      title: 'Mission',
      value: filter,
      options: [{ value: 'all', label: 'Toutes les missions', icon: 'missions' }, ...s.missions.map((m) => ({ value: m.id, label: m.name || 'Mission', sub: `${CONTRACTS[m.contract]?.label || ''}${m.payStartDay > 1 ? ` · paie du ${m.payStartDay} au ${m.payStartDay - 1}` : ''}`, dot: m.color }))],
    });
    if (v) {
      filter = v;
      anchor = null;
      render(root, { ...route, query: {} });
    }
  });
  root.querySelector('[data-act=how]').onclick = () => howSheet(s.settings.netRate);
  root.querySelector('[data-act=export]').onclick = () => exportSheet(sum, R, fm);
  root.querySelectorAll('[data-pm]').forEach((b) => {
    b.onclick = () => {
      filter = b.dataset.pm;
      anchor = null;
      render(root, { ...route, query: {} });
    };
  });
}

function tile(ic, label, value, sub = '', cls = '') {
  return `<div class="tile"><span class="tile-ic ${cls}">${icon(ic, 20)}</span><small>${esc(label)}</small><b class="num">${esc(value)}</b>${sub ? `<em>${esc(sub)}</em>` : ''}</div>`;
}

function chart(p, R, sum) {
  let bars = [];
  if (p === 'year') {
    const [y] = ymd(R.from);
    bars = Array.from({ length: 12 }, (_, i) => ({ label: MONTHS_SHORT[i].replace('.', '').slice(0, 3), net: 0, sup: 0, key: `${y}-${pad(i + 1)}` }));
    for (const [d, v] of sum.byDay) {
      const b = bars[Number(d.slice(5, 7)) - 1];
      b.net += v.net;
      b.sup += v.sup;
    }
  } else {
    bars = eachDay(R.from, R.to).map((d) => {
      const v = sum.byDay.get(d) || { net: 0, sup: 0 };
      const wd = weekday(d);
      return { label: p === 'week' ? DAYS_SHORT[wd].slice(0, 1) : String(Number(d.slice(8))), net: v.net, sup: v.sup, sun: wd === 6 };
    });
  }
  const max = Math.max(...bars.map((b) => b.net), 60);
  const stepH = p === 'year' ? (max > 120 * 60 ? 50 : 20) : max > 10 * 60 ? 4 : 2;
  const top = Math.ceil(max / (stepH * 60)) * stepH * 60;
  const W = 340;
  const H = 150;
  const padL = 26;
  const padB = 20;
  const n = bars.length;
  const bw = (W - padL) / n;
  const gap = Math.min(bw * 0.28, 8);
  let svg = '';
  for (let v = stepH * 60; v <= top; v += stepH * 60) {
    const yy = H - padB - (v / top) * (H - padB - 8);
    svg += `<line x1="${padL}" x2="${W}" y1="${yy}" y2="${yy}" class="grid"/><text x="${padL - 6}" y="${yy + 3.5}" class="axis" text-anchor="end">${v / 60}h</text>`;
  }
  bars.forEach((b, i) => {
    const x = padL + i * bw + gap / 2;
    const w = Math.max(bw - gap, 1.5);
    const h = (b.net / top) * (H - padB - 8);
    const hs = (b.sup / top) * (H - padB - 8);
    const y0 = H - padB - h;
    const r = Math.min(w / 2, 4);
    if (h > 0) {
      svg += `<path class="bar" d="M${x},${H - padB} V${y0 + r} Q${x},${y0} ${x + r},${y0} H${x + w - r} Q${x + w},${y0} ${x + w},${y0 + r} V${H - padB} Z"/>`;
      if (hs > 0.5) svg += `<rect class="bar-sup" x="${x}" y="${y0}" width="${w}" height="${Math.min(hs, h)}" rx="${r}"/>`;
    }
    const showLabel = n <= 12 || i === 0 || (i + 1) % 5 === 0;
    if (showLabel) svg += `<text x="${x + w / 2}" y="${H - 5}" class="axis ${b.sun ? 'sunc' : ''}" text-anchor="middle">${b.label}</text>`;
  });
  return `<section class="card chart">
    <div class="card-head"><h3>Heures ${p === 'year' ? 'par mois' : 'par jour'}</h3><span class="legend"><i class="lg-bar"></i>travaillées <i class="lg-sup"></i>sup.</span></div>
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Graphique des heures">${svg}</svg>
  </section>`;
}

function detail(t, fm, netRate) {
  const L = (label, val, cls = '') => `<div class="dl ${cls}"><span>${label}</span><b class="num">${val}</b></div>`;
  const rows = [];
  rows.push(L(`Heures travaillées · ${fmtDuration(t.net)}${fm && fm.rate ? ` × ${money(fm.rate)}` : ''}`, money(t.base)));
  if (t.majo.sup1 > 0.004) rows.push(L(`Heures sup.${fm ? ` +${pct(fm.overtime.t1.pct)}` : ' (1ᵉʳ palier)'} · ${fmtDuration(t.sup1)}`, `+${money(t.majo.sup1)}`, 't-sup'));
  if (t.majo.sup2 > 0.004) rows.push(L(`Heures sup.${fm ? ` +${pct(fm.overtime.t2.pct)}` : ' (2ᵉ palier)'} · ${fmtDuration(t.sup2)}`, `+${money(t.majo.sup2)}`, 't-sup'));
  if (t.majo.night > 0.004) rows.push(L(`Majoration de nuit${fm ? ` +${pct(fm.night.pct)}` : ''} · ${fmtDuration(t.night)}`, `+${money(t.majo.night)}`, 't-night'));
  if (t.majo.sunday > 0.004) rows.push(L(`Majoration dimanche${fm ? ` +${pct(fm.sunday.pct)}` : ''} · ${fmtDuration(t.sunday)}`, `+${money(t.majo.sunday)}`, 't-sun'));
  if (t.majo.holiday > 0.004) rows.push(L(`Majoration jours fériés${fm ? ` +${pct(fm.holiday.pct)}` : ''} · ${fmtDuration(t.holiday)}`, `+${money(t.majo.holiday)}`, 't-hol'));
  rows.push(L('Salaire brut', money(t.salary), 'total'));
  const endLabel = fm ? (fm.contract === 'cdd' ? 'Indemnité de fin de contrat' : fm.contract === 'interim' ? 'Indemnité de fin de mission (IFM)' : 'Prime de fin de contrat') : 'Fin de mission / contrat';
  if (t.endBonus > 0.004) rows.push(L(`${endLabel}${fm ? ` ${pct(fm.endBonus.pct)}` : ''}`, `+${money(t.endBonus)}`));
  if (t.paidLeave > 0.004) rows.push(L(`Congés payés (ICCP)${fm ? ` ${pct(fm.paidLeave.pct)}` : ''}`, `+${money(t.paidLeave)}`));
  if (t.endBonus > 0.004 || t.paidLeave > 0.004) rows.push(L('Total brut estimé', money(t.gross), 'total accent'));
  rows.push(L(`Cotisations salariales ≈ ${pct(netRate)}`, `−${money((t.gross * netRate) / 100)}`, 'muted'));
  if (t.meal > 0.004) rows.push(L(`${icon('meal', 15)} Paniers repas · ${t.mealCount}`, `+${money(t.meal)}`));
  if (t.travel > 0.004) rows.push(L(`${icon('car', 15)} Indemnités de trajet · ${t.travelCount}`, `+${money(t.travel)}`));
  rows.push(L('Net estimé', `≈ ${money(t.netEstimate)}`, 'total big'));
  return `<section class="card"><div class="card-head"><h3>Détail du brut</h3></div><div class="dls">${rows.join('')}</div></section>`;
}

function perMission(list) {
  return `<section class="card"><div class="card-head"><h3>Par mission</h3></div>
    ${list
      .map(
        ({ mission: m, totals: t }) => `<button class="row" data-pm="${esc(m.id)}">
        <span class="row-ic" style="color:${esc(m.color)}"><i class="dot big" style="background:${esc(m.color)}"></i></span>
        <span class="row-txt"><b>${esc(m.name)}</b><small>${fmtDuration(t.net)} · ${t.days} jour${t.days > 1 ? 's' : ''}${t.sup >= 1 ? ` · ${fmtDuration(t.sup)} sup.` : ''}</small></span>
        <span class="row-val num">${money(t.gross)}</span>
        ${icon('chevron', 18, 'row-chev')}
      </button>`,
      )
      .join('')}
  </section>`;
}

function howSheet(netRate) {
  sheet({
    title: 'Comment c’est calculé',
    html: `<div class="prose">
      <p><b>Salaire brut</b> = heures × taux horaire + majorations. Chaque minute est classée : heure sup (selon le cumul de la semaine ou du jour), nuit, dimanche, férié. Par défaut les majorations s’additionnent ; tu peux garder seulement la plus forte dans la mission.</p>
      <p><b>Heures sup.</b> : au-delà du seuil de la mission (35 h par défaut), comptées dans l’ordre chronologique de la semaine, du lundi au dimanche. Une semaine à cheval sur deux mois est calculée en entier.</p>
      <p><b>Intérim / CDD</b> : l’indemnité de fin de mission ou de contrat (10 %) s’applique au brut, puis l’indemnité de congés payés (10 %) au brut + IFM.</p>
      <p><b>Net estimé</b> = total brut − ${pct(netRate)} de cotisations (réglable) + paniers et trajets. Le prélèvement à la source n’est pas déduit.</p>
      <p class="muted">Ce sont des estimations : ta convention collective et ton bulletin de paie font foi.</p>
    </div>`,
  });
}

async function exportSheet(sum, R, fm) {
  if (!sum.total.entries) return toast('Rien à exporter sur cette période.');
  const v = await choiceSheet({
    title: 'Exporter',
    options: [
      { value: 'pdf', label: 'PDF', sub: 'Relevé d’heures prêt à envoyer ou imprimer', icon: 'file' },
      { value: 'xlsx', label: 'Excel (.xlsx)', sub: 'Journées + résumé, montants en nombres', icon: 'sheet' },
      { value: 'csv', label: 'CSV', sub: 'Pour Google Sheets, LibreOffice…', icon: 'list' },
    ],
  });
  if (!v) return;
  toast('Préparation du fichier…', { ms: 1500 });
  try {
    const ex = await import('../core/export.js');
    const label = `${R.title}${R.sub ? ` (${R.sub})` : ''}`;
    await ex.exportSummary(v, sum, { label, mission: fm, netRate: store.get().settings.netRate });
    haptic('success');
  } catch (e) {
    console.error(e);
    toast(`Export impossible : ${e.message || e}`, { kind: 'err', ms: 5000 });
  }
}

