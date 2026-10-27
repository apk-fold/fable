// Exports du résumé : PDF (pdf-lib), Excel (.xlsx écrit à la main) et CSV.
import { zip } from './zip.js';
import { DAYS_SHORT, weekday, fmtDateNum, fmtDuration, toHours, dayIndex, todayIso } from './time.js';
import { normalizeMission, CONTRACTS } from './calc.js';

const r2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
const frNum = (n, d = 2) => r2(n).toFixed(d).replace('.', ',');

function lines(sum, missionsById) {
  return sum.rows.map((r) => {
    const m = missionsById.get(r.missionId) || normalizeMission({ id: r.missionId, name: '?' });
    return {
      date: r.date,
      day: DAYS_SHORT[weekday(r.date)],
      mission: m.name,
      start: r.start,
      end: r.end,
      pause: r.pause,
      hours: toHours(r.net),
      sup: toHours(r.sup1 + r.sup2),
      night: toHours(r.night),
      sunday: m.sunday.enabled ? toHours(r.sunday) : 0,
      holiday: m.holiday.enabled ? toHours(r.holiday) : 0,
      holidayName: r.holidayName || '',
      amount: r2(r.amount),
      meal: r2(r.meal),
      travel: r2(r.travel),
      note: '',
      r,
    };
  });
}

function summaryLines(t, mission, netRate) {
  const out = [
    ['Heures travaillées', toHours(t.net), 'h'],
    ['dont heures sup.', toHours(t.sup), 'h'],
    ['Heures de nuit', toHours(t.night), 'h'],
    ['Heures le dimanche', toHours(t.sunday), 'h'],
    ['Heures jours fériés', toHours(t.holiday), 'h'],
    ['Jours travaillés', t.days, ''],
    ['Salaire de base', r2(t.base), '€'],
    ['Majoration heures sup.', r2(t.majo.sup1 + t.majo.sup2), '€'],
    ['Majoration de nuit', r2(t.majo.night), '€'],
    ['Majoration dimanche', r2(t.majo.sunday), '€'],
    ['Majoration jours fériés', r2(t.majo.holiday), '€'],
    ['Salaire brut', r2(t.salary), '€'],
    [mission?.contract === 'cdd' ? 'Indemnité de fin de contrat' : 'Indemnité de fin de mission (IFM)', r2(t.endBonus), '€'],
    ['Indemnité de congés payés (ICCP)', r2(t.paidLeave), '€'],
    ['Total brut estimé', r2(t.gross), '€'],
    [`Cotisations estimées (${String(netRate).replace('.', ',')} %)`, -r2((t.gross * netRate) / 100), '€'],
    [`Paniers repas (${t.mealCount})`, r2(t.meal), '€'],
    [`Indemnités de trajet (${t.travelCount})`, r2(t.travel), '€'],
    ['Net estimé', r2(t.netEstimate), '€'],
  ];
  return out.filter(([label, v]) => v !== 0 || /brut|Net|travaillé|Salaire/.test(label));
}

const slug = (s) =>
  String(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    .slice(0, 50);

// ---- CSV ---------------------------------------------------------------------------------------

export function buildCsv(sum, missionsById, { label = '', mission = null, netRate = 22 } = {}) {
  const q = (v) => (/[;"\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
  const head = ['Date', 'Jour', 'Mission', 'Début', 'Fin', 'Pause (min)', 'Heures', 'Heures sup.', 'Heures de nuit', 'Heures dimanche', 'Heures fériées', 'Brut estimé (€)', 'Panier (€)', 'Trajet (€)', 'Jour férié'];
  const body = lines(sum, missionsById).map((l) => [fmtDateNum(l.date), l.day, l.mission, l.start, l.end, l.pause, frNum(l.hours), frNum(l.sup), frNum(l.night), frNum(l.sunday), frNum(l.holiday), frNum(l.amount), frNum(l.meal), frNum(l.travel), l.holidayName]);
  const tail = [[], [`Résumé ${label}`], ...summaryLines(sum.total, mission, netRate).map(([k, v, u]) => [k, `${frNum(v)}${u ? ` ${u}` : ''}`])];
  return '﻿' + [head, ...body, ...tail].map((r) => r.map(q).join(';')).join('\r\n');
}

// ---- XLSX ----------------------------------------------------------------------------------------

const xmlEsc = (s) => String(s).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' })[c]).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '');
const colName = (i) => {
  let s = '';
  for (i += 1; i > 0; i = Math.floor((i - 1) / 26)) s = String.fromCharCode(65 + ((i - 1) % 26)) + s;
  return s;
};

// styles : 0 normal · 1 en-tête · 2 nombre 0,00 · 3 euros · 4 date · 5 total nombre · 6 total euros · 7 total texte · 8 titre
function sheetXml(rows, widths, { freeze = true } = {}) {
  const out = rows
    .map((cells, ri) => {
      const r = ri + 1;
      const cs = cells
        .map((c, ci) => {
          if (c === null || c === undefined || c === '') return '';
          const ref = `${colName(ci)}${r}`;
          const cell = typeof c === 'object' ? c : { v: c };
          const s = cell.s ? ` s="${cell.s}"` : '';
          if (cell.f) return `<c r="${ref}"${s}><f>${xmlEsc(cell.f)}</f></c>`;
          if (typeof cell.v === 'number') return `<c r="${ref}"${s}><v>${cell.v}</v></c>`;
          return `<c r="${ref}" t="inlineStr"${s}><is><t xml:space="preserve">${xmlEsc(cell.v)}</t></is></c>`;
        })
        .join('');
      return `<row r="${r}">${cs}</row>`;
    })
    .join('');
  const cols = widths.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join('');
  const pane = freeze ? '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>' : '<sheetViews><sheetView workbookViewId="0"/></sheetViews>';
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${pane}<cols>${cols}</cols><sheetData>${out}</sheetData></worksheet>`;
}

const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="3"><numFmt numFmtId="164" formatCode="0.00"/><numFmt numFmtId="165" formatCode="#,##0.00\\ &quot;€&quot;"/><numFmt numFmtId="166" formatCode="dd/mm/yyyy"/></numFmts>
<fonts count="3"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="14"/><name val="Calibri"/></font></fonts>
<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFDDF5A0"/><bgColor indexed="64"/></patternFill></fill></fills>
<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left/><right/><top style="thin"><color rgb="FF888888"/></top><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="9">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>
<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
<xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
<xf numFmtId="166" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
<xf numFmtId="164" fontId="1" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1"/>
<xf numFmtId="165" fontId="1" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1"/>
<xf numFmtId="0" fontId="1" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1"/>
<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/>
</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;

export function buildXlsx(sum, missionsById, { label = '', mission = null, netRate = 22 } = {}) {
  const L = lines(sum, missionsById);
  const head = ['Date', 'Jour', 'Mission', 'Début', 'Fin', 'Pause (min)', 'Heures', 'Heures sup.', 'Heures de nuit', 'Heures dimanche', 'Heures fériées', 'Brut estimé', 'Panier', 'Trajet', 'Jour férié'].map((v) => ({ v, s: 1 }));
  const rows = [head];
  for (const l of L) {
    rows.push([
      { v: dayIndex(l.date) + 25569, s: 4 },
      l.day,
      l.mission,
      l.start,
      l.end,
      l.pause,
      { v: l.hours, s: 2 },
      { v: l.sup, s: 2 },
      { v: l.night, s: 2 },
      { v: l.sunday, s: 2 },
      { v: l.holiday, s: 2 },
      { v: l.amount, s: 3 },
      { v: l.meal, s: 3 },
      { v: l.travel, s: 3 },
      l.holidayName,
    ]);
  }
  const n = L.length + 1;
  const sumCol = (c, s) => ({ f: `SUM(${c}2:${c}${n})`, s });
  rows.push([{ v: 'Total', s: 7 }, { v: '', s: 7 }, { v: '', s: 7 }, { v: '', s: 7 }, { v: '', s: 7 }, sumCol('F', 5), sumCol('G', 5), sumCol('H', 5), sumCol('I', 5), sumCol('J', 5), sumCol('K', 5), sumCol('L', 6), sumCol('M', 6), sumCol('N', 6), { v: '', s: 7 }]);
  const sheet1 = sheetXml(rows, [12, 6, 24, 8, 8, 11, 9, 11, 13, 14, 13, 13, 10, 10, 18]);

  const srows = [[{ v: `Fable — résumé ${label}`, s: 8 }], [`Généré le ${fmtDateNum(todayIso())}${mission ? ` · ${mission.name} (${CONTRACTS[mission.contract]?.label || ''}, ${String(mission.rate).replace('.', ',')} €/h)` : ''}`], []];
  srows.push([{ v: 'Poste', s: 1 }, { v: 'Valeur', s: 1 }]);
  for (const [k, v, u] of summaryLines(sum.total, mission, netRate)) srows.push([k, { v, s: u === '€' ? 3 : u === 'h' ? 2 : 0 }]);
  srows.push([], ['Estimation indicative : ta convention collective et ton bulletin de paie font foi.']);
  const sheet2 = sheetXml(srows, [42, 16], { freeze: false });

  return zip([
    {
      name: '[Content_Types].xml',
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`,
    },
    {
      name: '_rels/.rels',
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`,
    },
    {
      name: 'docProps/core.xml',
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${xmlEsc(`Relevé d'heures ${label}`)}</dc:title><dc:creator>Fable</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString().slice(0, 19)}Z</dcterms:created></cp:coreProperties>`,
    },
    {
      name: 'xl/workbook.xml',
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Journées" sheetId="1" r:id="rId1"/><sheet name="Résumé" sheetId="2" r:id="rId2"/></sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>`,
    },
    {
      name: 'xl/_rels/workbook.xml.rels',
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
    },
    { name: 'xl/styles.xml', data: STYLES },
    { name: 'xl/worksheets/sheet1.xml', data: sheet1 },
    { name: 'xl/worksheets/sheet2.xml', data: sheet2 },
  ]);
}

// ---- PDF ---------------------------------------------------------------------------------------

/** Les polices standard du PDF ne connaissent que le jeu WinAnsi : on remplace le reste. */
const winAnsi = (s) =>
  String(s)
    .replace(/[   ]/g, ' ')
    .replace(/→/g, '-')
    .replace(/≈/g, '~')
    .replace(/−/g, '-')
    .replace(/[ᵉ]/g, 'e')
    .replace(/[ʳ]/g, 'r')
    .replace(/[^\u0000-ÿ€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ]/g, '');

const euro = (n) => `${r2(n).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;

export async function buildPdf(sum, missionsById, { label = '', mission = null, netRate = 22, pdfLib = null } = {}) {
  const { PDFDocument, StandardFonts, rgb } = pdfLib || (await import('pdf-lib'));
  const doc = await PDFDocument.create();
  doc.setTitle(winAnsi(`Relevé d'heures ${label}`));
  doc.setAuthor('Fable');
  doc.setCreator('Fable');
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const INK = rgb(0.07, 0.08, 0.07);
  const MUTED = rgb(0.42, 0.45, 0.42);
  const LINE = rgb(0.86, 0.87, 0.84);
  const ZEBRA = rgb(0.965, 0.97, 0.955);
  const ACCENT = rgb(0.55, 0.72, 0.1);
  const ACCENT_BG = rgb(0.92, 0.97, 0.8);
  const SUP = rgb(0.8, 0.45, 0.02);
  const W = 595.28;
  const H = 841.89;
  const M = 36;
  const pages = [];
  let page;
  let y;
  const text = (t, x, yy, { size = 9, f = font, color = INK, align = 'left', maxW = 0 } = {}) => {
    let s = winAnsi(t);
    if (maxW) while (s.length > 1 && f.widthOfTextAtSize(s, size) > maxW) s = s.slice(0, -2) + '…';
    const w = f.widthOfTextAtSize(s, size);
    const xx = align === 'right' ? x - w : align === 'center' ? x - w / 2 : x;
    page.drawText(s, { x: xx, y: yy, size, font: f, color });
  };
  const newPage = () => {
    page = doc.addPage([W, H]);
    pages.push(page);
    y = H - M;
  };

  const multi = new Set(sum.rows.map((r) => r.missionId)).size > 1 || !mission;
  const L = lines(sum, missionsById);
  const t = sum.total;

  // en-tête
  newPage();
  page.drawRectangle({ x: 0, y: H - 6, width: W, height: 6, color: ACCENT });
  text("Relevé d'heures", M, y - 16, { size: 22, f: bold });
  text(label, M, y - 34, { size: 11, color: MUTED });
  text(`Généré le ${fmtDateNum(todayIso())} avec Fable`, W - M, y - 14, { size: 8.5, color: MUTED, align: 'right' });
  if (mission) {
    const c = CONTRACTS[mission.contract]?.label || '';
    text(`${mission.name} · ${c} · ${euro(mission.rate)}/h brut`, W - M, y - 28, { size: 9.5, f: bold, align: 'right', maxW: 260 });
  }
  y -= 54;

  // chiffres clés
  const kpis = [
    ['Heures travaillées', fmtDuration(t.net)],
    ['Heures sup.', fmtDuration(t.sup)],
    ['Total brut estimé', euro(t.gross)],
    ['Net estimé', euro(t.netEstimate)],
  ];
  const kw = (W - 2 * M - 3 * 8) / 4;
  kpis.forEach(([k, v], i) => {
    const x = M + i * (kw + 8);
    page.drawRectangle({ x, y: y - 46, width: kw, height: 46, color: i === 2 ? ACCENT_BG : ZEBRA, borderColor: LINE, borderWidth: 0.6 });
    text(k, x + 10, y - 16, { size: 8, color: MUTED });
    text(v, x + 10, y - 35, { size: 14, f: bold });
  });
  y -= 64;
  text(`${t.days} jour${t.days > 1 ? 's' : ''} travaillé${t.days > 1 ? 's' : ''} · ${fmtDuration(t.night)} de nuit${t.sunday >= 1 ? ` · ${fmtDuration(t.sunday)} le dimanche` : ''}${t.holiday >= 1 ? ` · ${fmtDuration(t.holiday)} fériées` : ''}${t.meal ? ` · ${t.mealCount} panier${t.mealCount > 1 ? 's' : ''}` : ''}`, M, y, { size: 9, color: MUTED });
  y -= 18;

  // tableau des journées
  const cols = [
    { k: 'date', label: 'Date', w: 62 },
    ...(multi ? [{ k: 'mission', label: 'Mission', w: 90 }] : []),
    { k: 'hours', label: 'Horaires', w: 70 },
    { k: 'pause', label: 'Pause', w: 38, right: true },
    { k: 'net', label: 'Heures', w: 44, right: true },
    { k: 'sup', label: 'Sup.', w: 40, right: true },
    { k: 'night', label: 'Nuit', w: 40, right: true },
    { k: 'flag', label: 'Dim./Férié', w: multi ? 50 : 70 },
    { k: 'meal', label: 'Panier', w: 40, right: true },
    { k: 'amount', label: 'Brut', w: 0, right: true },
  ];
  const fixed = cols.reduce((a, c) => a + c.w, 0);
  cols[cols.length - 1].w = W - 2 * M - fixed;
  const RH = 16;
  const header = () => {
    page.drawRectangle({ x: M, y: y - RH + 4, width: W - 2 * M, height: RH, color: INK });
    let x = M;
    for (const c of cols) {
      text(c.label, c.right ? x + c.w - 5 : x + 5, y - 7, { size: 8, f: bold, color: rgb(1, 1, 1), align: c.right ? 'right' : 'left' });
      x += c.w;
    }
    y -= RH;
  };
  header();
  L.forEach((l, i) => {
    if (y < M + 40) {
      newPage();
      header();
    }
    if (i % 2 === 1) page.drawRectangle({ x: M, y: y - RH + 4, width: W - 2 * M, height: RH, color: ZEBRA });
    const flags = [];
    if (l.sunday) flags.push('Dim.');
    if (l.holidayName) flags.push(l.holidayName);
    const v = {
      date: `${l.day.slice(0, 3).toLowerCase()} ${fmtDateNum(l.date).slice(0, 5)}`,
      mission: l.mission,
      hours: `${l.start} - ${l.end}`,
      pause: l.pause ? `${l.pause} min` : '-',
      net: fmtDuration(l.r.net, { compact: true }),
      sup: l.sup ? fmtDuration(l.r.sup1 + l.r.sup2, { compact: true }) : '',
      night: l.night ? fmtDuration(l.r.night, { compact: true }) : '',
      flag: flags.join(' · '),
      meal: l.meal ? euro(l.meal).replace(' €', '') : '',
      amount: euro(l.amount),
    };
    let x = M;
    for (const c of cols) {
      text(v[c.k], c.right ? x + c.w - 5 : x + 5, y - 7, { size: 8.5, align: c.right ? 'right' : 'left', maxW: c.w - 8, color: c.k === 'sup' ? SUP : INK, f: c.k === 'amount' || c.k === 'net' ? bold : font });
      x += c.w;
    }
    y -= RH;
  });
  page.drawLine({ start: { x: M, y: y + 3 }, end: { x: W - M, y: y + 3 }, thickness: 0.8, color: INK });
  y -= 10;
  text('Total', M + 5, y, { size: 9, f: bold });
  text(fmtDuration(t.net, { compact: true }), M + cols.slice(0, cols.findIndex((c) => c.k === 'net') + 1).reduce((a, c) => a + c.w, 0) - 5, y, { size: 9, f: bold, align: 'right' });
  text(euro(t.salary), W - M - 5, y, { size: 9, f: bold, align: 'right' });
  y -= 30;

  // détail du brut
  const S = summaryLines(t, mission, netRate).filter(([k]) => !/^Heures|^dont|^Jours/.test(k));
  if (y < M + 40 + S.length * 15) newPage();
  text('Détail du brut', M, y, { size: 12, f: bold });
  y -= 8;
  const bw = 300;
  for (const [k, val, u] of S) {
    const strong = /brut|Net/.test(k);
    y -= 15;
    if (strong) page.drawRectangle({ x: M, y: y - 4, width: bw, height: 15, color: /Total|Net/.test(k) ? ACCENT_BG : ZEBRA });
    text(k, M + 6, y, { size: 9, f: strong ? bold : font });
    text(u === '€' ? euro(val) : String(val), M + bw - 6, y, { size: 9, f: strong ? bold : font, align: 'right' });
  }

  // pied de page
  pages.forEach((p, i) => {
    page = p;
    page.drawLine({ start: { x: M, y: 30 }, end: { x: W - M, y: 30 }, thickness: 0.5, color: LINE });
    text('Estimation indicative calculée par Fable : ta convention collective et ton bulletin de paie font foi.', M, 18, { size: 7.5, color: MUTED });
    text(`Page ${i + 1} / ${pages.length}`, W - M, 18, { size: 7.5, color: MUTED, align: 'right' });
  });
  return doc.save();
}

// ---- action ------------------------------------------------------------------------------------

export async function exportSummary(kind, sum, { label, mission = null, netRate = 22 }) {
  const [{ get }, { shareFile }] = await Promise.all([import('./store.js'), import('../platform.js')]);
  const missionsById = new Map(get().missions.map((m) => [m.id, normalizeMission(m)]));
  const base = `fable-${slug(mission ? mission.name : 'heures')}-${slug(label)}`;
  if (kind === 'csv') return shareFile(`${base}.csv`, buildCsv(sum, missionsById, { label, mission, netRate }), 'text/csv', 'Relevé d’heures (CSV)');
  if (kind === 'xlsx') return shareFile(`${base}.xlsx`, buildXlsx(sum, missionsById, { label, mission, netRate }), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Relevé d’heures (Excel)');
  const pdf = await buildPdf(sum, missionsById, { label, mission, netRate });
  return shareFile(`${base}.pdf`, pdf, 'application/pdf', 'Relevé d’heures (PDF)');
}
