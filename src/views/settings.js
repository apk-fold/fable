// Réglages : personnalisation, affichage, calculs et jours fériés, rappel, données, à propos.
import * as store from '../core/store.js';
import { DEFAULT_LOOK } from '../core/store.js';
import { icon } from '../ui/icons.js';
import { esc, pct, parseDecimal, toast, confirmSheet, sheet, numShort } from '../ui/dom.js';
import { subHead, seg, bindSeg, switchEl, field, info, entryCard, row } from '../ui/components.js';
import { shareFile, pickTextFile, scheduleReminders, appInfo, haptic, isNative } from '../platform.js';
import { ACCENTS, CATEGORY_PRESETS } from '../ui/theme.js';
import { loadDemo } from '../core/demo.js';
import { todayIso, DAYS_SHORT, fmtDateLong, cap } from '../core/time.js';
import { holidays } from '../core/holidays.js';
import { logo } from './today.js';

export const liveRefresh = false;

const THEME_LABEL = { dark: 'Sombre', black: 'Noir (AMOLED)', light: 'Clair', auto: 'Auto' };
const START_LABEL = { '/': 'Aujourd’hui', '/history': 'Historique', '/summary': 'Résumé', '/missions': 'Missions' };
const DUR_LABEL = { hm: '7 h 30', compact: '7h30', decimal: '7,5 h' };

export function render(root, route) {
  const page = route?.parts?.[1] || '';
  const pages = { '': main, look, display, calc, reminder, data };
  (pages[page] || main)(root);
}

// ---- page principale ---------------------------------------------------------------------------

function main(root) {
  const st = store.get();
  const s = st.settings;
  root.innerHTML = `${subHead('Réglages')}
  <div class="form">
    <section class="card list">
      ${row({ go: '#/settings/look', ic: 'palette', title: 'Personnalisation', sub: 'Couleurs, thème, polices, taille, coins', value: `<i class="dot big" style="background:${esc(s.look.accent)}"></i>` })}
      ${row({ go: '#/settings/display', ic: 'list', title: 'Affichage', sub: `Durées « ${DUR_LABEL[s.durationStyle]} » · démarrage sur ${START_LABEL[s.startTab]}${s.hideMoney ? ' · montants masqués' : ''}` })}
      ${row({ go: '#/settings/calc', ic: 'percent', title: 'Calculs et jours fériés', sub: `Cotisations ${pct(s.netRate)} · fériés ${s.holidayRegion === 'alsace' ? 'Alsace-Moselle' : 'France (Paris)'}` })}
      ${row({ go: '#/settings/reminder', ic: 'bell', title: 'Rappel', sub: s.reminder.enabled ? `Activé à ${s.reminder.time}` : 'Désactivé' })}
      ${row({ go: '#/settings/data', ic: 'download', title: 'Données et sauvegarde', sub: `${st.missions.length} mission${st.missions.length > 1 ? 's' : ''}, ${st.entries.length} journée${st.entries.length > 1 ? 's' : ''}` })}
    </section>
    ${info('Les majorations, paniers, indemnités et horaires se règlent mission par mission, dans l’onglet <b>Missions</b>.', 'missions')}
    <section class="about">
      <div class="about-logo">${logo(52)}</div>
      <b class="display">Fable</b>
      <small class="muted" data-version>Suivi d’heures, majorations et indemnités</small>
      <a class="link" href="https://github.com/apk-fold/fable" target="_blank" rel="noopener">${icon('github', 16)} apk-fold/fable</a>
      <p class="muted small">Montants estimés à titre indicatif : ta convention collective et ton bulletin de paie font foi.</p>
    </section>
  </div>`;
  appInfo().then((i) => {
    const el = root.querySelector('[data-version]');
    if (el && i.version !== 'web') el.textContent = `Version ${i.version}${i.build ? ` (${i.build})` : ''}`;
  });
}

// ---- personnalisation ---------------------------------------------------------------------------

const SAMPLE_MISSION = { name: 'Aperçu', color: '#7CC8FF', rate: 14.88, sunday: { enabled: true, pct: 50 }, holiday: { enabled: true, pct: 100 } };
const SAMPLE_DAY = { id: 'apercu', missionId: 'x', date: '2026-10-25', start: '21:00', end: '05:30', overnight: true, pause: 30, net: 480, sup1: 120, sup2: 0, night: 480, sunday: 480, holiday: 0, amount: 247.38, meal: 6, travel: 0, holidayName: null };

function swatches(name, list, current) {
  const custom = !list.includes(current);
  return `<div class="swatch-row" data-swatches="${name}">
    ${list.map((c) => `<button type="button" class="swatch ${c === current ? 'on' : ''}" data-c="${c}" style="--c:${c}" aria-label="${c}"></button>`).join('')}
    <label class="swatch custom ${custom ? 'on' : ''}" style="--c:${esc(current)}" aria-label="Couleur libre"><input type="color" data-custom="${name}" value="${esc(current.toLowerCase())}"></label>
  </div>`;
}

function look(root) {
  const s = store.get().settings;
  const L = s.look;
  const cat = [
    ['sup', 'plusCircle', 'Heures sup.'],
    ['night', 'moon', 'Nuit'],
    ['sun', 'calendar', 'Dimanche'],
    ['hol', 'flag', 'Jours fériés'],
  ];
  root.innerHTML = `${subHead('Personnalisation')}
  <div class="form">
    <section class="card preview-card" aria-hidden="true">
      ${entryCard(SAMPLE_DAY, SAMPLE_MISSION)}
      <div class="sample-tags"><span class="tag t-sup">Sup.</span><span class="tag t-night">Nuit</span><span class="tag t-sun">Dimanche</span><span class="tag t-hol">Férié</span><span class="tag accent">≈ 247,38 €</span></div>
      <div class="preview-btns"><span class="btn primary">${icon('play', 16)} Principal</span><span class="btn soft">Secondaire</span></div>
    </section>

    <h4 class="group">Thème</h4>
    <section class="card">
      ${seg('theme', Object.entries(THEME_LABEL).map(([k, v]) => [k, k === 'black' ? 'Noir' : v]), s.theme, 'wide')}
      <p class="hint">« Noir » éteint les pixels de l’écran OLED (économise la batterie). « Auto » suit le réglage du téléphone.</p>
    </section>

    <h4 class="group">Couleur principale</h4>
    <section class="card">
      ${swatches('accent', ACCENTS, L.accent)}
      <p class="hint">Boutons, onglet actif, montants, graphiques. Le dernier rond ouvre le sélecteur pour choisir n’importe quelle couleur.</p>
    </section>

    <h4 class="group">Couleurs des majorations</h4>
    <section class="card">
      ${cat.map(([k, ic, label]) => `<div class="color-row"><b class="t-${k}">${icon(ic, 18)} ${label}</b>${swatches(k, CATEGORY_PRESETS[k], L.colors[k])}</div>`).join('')}
    </section>

    <h4 class="group">Texte</h4>
    <section class="card">
      <span class="field-label">Police des titres</span>
      ${seg('displayFont', [['unbounded', '<span style="font-family:Unbounded">Large</span>'], ['manrope', '<span style="font-family:Manrope">Moderne</span>'], ['system', '<span style="font-family:system-ui">Système</span>'], ['serif', '<span style="font-family:Georgia,serif">Serif</span>']], L.displayFont, 'wide')}
      <span class="field-label">Police du texte</span>
      ${seg('bodyFont', [['manrope', 'Manrope'], ['system', 'Système (Roboto)']], L.bodyFont, 'wide')}
      <span class="field-label">Taille du texte</span>
      ${seg('textScale', [['0.9', 'A−'], ['1', '100 %'], ['1.1', 'A+'], ['1.2', 'A++'], ['1.3', 'A+++']], String(L.textScale), 'wide')}
    </section>

    <h4 class="group">Formes et mouvements</h4>
    <section class="card">
      <span class="field-label">Coins</span>
      ${seg('radius', [['sharp', 'Carrés'], ['normal', 'Arrondis'], ['round', 'Très arrondis']], L.radius, 'wide')}
      <span class="field-label">Densité</span>
      ${seg('density', [['comfort', 'Confortable'], ['compact', 'Compacte']], L.density, 'wide')}
      <div class="toggle-head sub"><div><b>Animations</b><small>Transitions entre les écrans et les panneaux.</small></div>${switchEl('motion', L.motion, 'Animations')}</div>
      <div class="toggle-head sub"><div><b>Vibrations</b><small>Retour haptique sur les actions.</small></div>${switchEl('haptics', s.haptics, 'Vibrations')}</div>
    </section>

    <button class="btn soft wide" data-act="reset">${icon('sparkle', 18)} Réinitialiser l’apparence</button>
  </div>`;

  const redraw = () => {
    const y = document.getElementById('view').scrollTop;
    look(root);
    document.getElementById('view').scrollTop = y;
  };
  const setColor = (name, c) => {
    if (name === 'accent') store.setLook({ accent: c });
    else store.setLook({ colors: { ...store.get().settings.look.colors, [name]: c } });
  };
  root.querySelectorAll('[data-swatches]').forEach((box) => {
    const name = box.dataset.swatches;
    box.querySelectorAll('[data-c]').forEach((b) => {
      b.onclick = () => {
        haptic('select');
        setColor(name, b.dataset.c);
        redraw();
      };
    });
    const inp = box.querySelector('[data-custom]');
    inp.addEventListener('input', () => setColor(name, inp.value.toUpperCase()));
    inp.addEventListener('change', () => {
      setColor(name, inp.value.toUpperCase());
      redraw();
    });
  });
  bindSeg(root, 'theme', (v) => {
    store.setSettings({ theme: v });
    redraw();
  });
  for (const k of ['displayFont', 'bodyFont', 'radius', 'density']) {
    bindSeg(root, k, (v) => {
      store.setLook({ [k]: v });
      haptic('select');
      redraw();
    });
  }
  bindSeg(root, 'textScale', (v) => {
    store.setLook({ textScale: Number(v) });
    redraw();
  });
  root.querySelector('[name=motion]').addEventListener('change', (e) => store.setLook({ motion: e.target.checked }));
  root.querySelector('[name=haptics]').addEventListener('change', (e) => store.setSettings({ haptics: e.target.checked }));
  root.querySelector('[data-act=reset]').onclick = async () => {
    if (!(await confirmSheet({ title: 'Réinitialiser l’apparence ?', text: 'Couleurs, thème, polices, taille, coins et animations reviennent aux réglages d’origine. Tes données ne bougent pas.', ok: 'Réinitialiser' }))) return;
    store.setSettings({ theme: 'dark', look: structuredClone(DEFAULT_LOOK) });
    toast('Apparence d’origine rétablie');
    redraw();
  };
}

// ---- affichage --------------------------------------------------------------------------------------

function display(root) {
  const s = store.get().settings;
  root.innerHTML = `${subHead('Affichage')}
  <div class="form">
    <section class="card">
      <span class="field-label">Format des durées</span>
      ${seg('durationStyle', Object.entries(DUR_LABEL), s.durationStyle, 'wide')}
      <span class="field-label">Écran à l’ouverture</span>
      ${seg('startTab', Object.entries(START_LABEL).map(([k, v]) => [k, v === 'Aujourd’hui' ? 'Accueil' : v]), s.startTab, 'wide small2')}
      <span class="field-label">Historique affiché en</span>
      ${seg('historyView', [['list', `${icon('list', 16)} Liste`], ['cal', `${icon('grid', 16)} Calendrier`]], s.historyView, 'wide')}
      <div class="toggle-head sub"><div><b>Mode discret</b><small>Masque les montants en euros à l’écran (les exports restent complets).</small></div>${switchEl('hideMoney', s.hideMoney, 'Mode discret')}</div>
    </section>
  </div>`;
  for (const k of ['durationStyle', 'startTab', 'historyView']) {
    bindSeg(root, k, (v) => {
      store.setSettings({ [k]: v });
      haptic('select');
    });
  }
  root.querySelector('[name=hideMoney]').addEventListener('change', (e) => store.setSettings({ hideMoney: e.target.checked }));
}

// ---- calculs et jours fériés ------------------------------------------------------------------------

function calc(root) {
  const s = store.get().settings;
  const t = todayIso();
  const y = Number(t.slice(0, 4));
  const alsace = s.holidayRegion === 'alsace';
  const next = [...holidays(y, alsace), ...holidays(y + 1, alsace)].filter(([d]) => d >= t).slice(0, 8);
  root.innerHTML = `${subHead('Calculs et jours fériés')}
  <div class="form">
    <section class="card">
      ${field({ label: 'Cotisations salariales (pour le net estimé)', name: 'netRate', value: String(s.netRate).replace('.', ','), suffix: '% du brut' })}
      <div class="chips wrap presets">
        <button type="button" class="chip" data-rate="22">Non-cadre ≈ 22 %</button>
        <button type="button" class="chip" data-rate="25">Cadre ≈ 25 %</button>
        <button type="button" class="chip" data-rate="0">0 % (net = brut)</button>
      </div>
      <span class="field-label">Arrondi de la pointeuse</span>
      ${seg('rounding', [['0', 'Aucun'], ['5', '5 min'], ['10', '10 min'], ['15', '15 min']], String(s.rounding), 'wide')}
    </section>

    <h4 class="group">Jours fériés</h4>
    <section class="card">
      <div class="radios">
        <button type="button" class="radio-card ${!alsace ? 'on' : ''}" data-region="fr"><i class="radio"></i><span><b>France métropolitaine (Paris)</b><small>11 jours fériés nationaux.</small></span></button>
        <button type="button" class="radio-card ${alsace ? 'on' : ''}" data-region="alsace"><i class="radio"></i><span><b>Alsace-Moselle</b><small>Les 11 + Vendredi saint et 26 décembre.</small></span></button>
      </div>
      <p class="hint">S’applique à toutes tes missions et aux nouvelles. Le taux de majoration se règle dans chaque mission (Missions → Jours fériés).</p>
    </section>
    <section class="card"><div class="card-head"><h3>Prochains jours fériés</h3></div>
      <div class="hol-list">${next.map(([d, n]) => `<div class="dl"><span>${esc(n)}</span><b>${esc(cap(fmtDateLong(d)))}</b></div>`).join('')}</div>
    </section>
  </div>`;
  const rateEl = root.querySelector('[name=netRate]');
  rateEl.addEventListener('input', () => {
    const v = parseDecimal(rateEl.value);
    if (v !== null && v >= 0 && v <= 80) store.setSettings({ netRate: v });
  });
  root.querySelectorAll('[data-rate]').forEach((b) => {
    b.onclick = () => {
      store.setSettings({ netRate: Number(b.dataset.rate) });
      rateEl.value = numShort(Number(b.dataset.rate));
      haptic('select');
      toast(`Cotisations : ${pct(Number(b.dataset.rate))}`);
    };
  });
  bindSeg(root, 'rounding', (v) => store.setSettings({ rounding: Number(v) }));
  root.querySelectorAll('[data-region]').forEach((b) => {
    b.onclick = () => {
      store.setHolidayRegion(b.dataset.region);
      haptic('select');
      toast(b.dataset.region === 'alsace' ? 'Jours fériés d’Alsace-Moselle' : 'Jours fériés de France (Paris)');
      calc(root);
    };
  });
}

// ---- rappel ---------------------------------------------------------------------------------------

function reminder(root) {
  const s = store.get().settings;
  root.innerHTML = `${subHead('Rappel')}
  <div class="form">
    <section class="card">
      <div class="toggle-head">
        <div><b>Me rappeler de noter mes heures</b><small>Une notification aux jours et à l’heure choisis.</small></div>
        ${switchEl('reminder', s.reminder.enabled, 'Rappel')}
      </div>
      <div class="reminder ${s.reminder.enabled ? '' : 'dim'}">
        <label class="time-box small tap"><input type="time" name="rtime" value="${esc(s.reminder.time)}"><b class="display num">${esc(s.reminder.time)}</b><small>Heure</small></label>
        <div class="chips days7">${DAYS_SHORT.map((d, i) => `<button type="button" class="chip ${s.reminder.days.includes(i) ? 'on' : ''}" data-day="${i}">${d.slice(0, 1)}</button>`).join('')}</div>
      </div>
      ${!isNative ? '<p class="hint">Les rappels fonctionnent dans l’appli Android.</p>' : ''}
    </section>
  </div>`;
  const applyReminder = async (patch) => {
    const r = { ...store.get().settings.reminder, ...patch };
    store.setSettings({ reminder: r });
    root.querySelector('.reminder').classList.toggle('dim', !r.enabled);
    const res = await scheduleReminders(r);
    if (!res.ok && r.enabled) {
      toast(res.reason, { kind: 'err', ms: 4500 });
      if (isNative) {
        store.setSettings({ reminder: { ...r, enabled: false } });
        root.querySelector('[name=reminder]').checked = false;
        root.querySelector('.reminder').classList.add('dim');
      }
    } else if (patch.enabled) toast('Rappel programmé');
  };
  root.querySelector('[name=reminder]').addEventListener('change', (e) => applyReminder({ enabled: e.target.checked }));
  const rtime = root.querySelector('[name=rtime]');
  rtime.closest('label').addEventListener('click', (e) => {
    if (e.target === rtime) return;
    try {
      rtime.showPicker();
    } catch {
      rtime.focus();
    }
  });
  rtime.addEventListener('change', () => {
    if (!rtime.value) return;
    rtime.parentElement.querySelector('b').textContent = rtime.value;
    applyReminder({ time: rtime.value });
  });
  root.querySelectorAll('[data-day]').forEach((b) => {
    b.onclick = () => {
      const d = Number(b.dataset.day);
      const days = new Set(store.get().settings.reminder.days);
      if (days.has(d)) days.delete(d);
      else days.add(d);
      b.classList.toggle('on', days.has(d));
      haptic('select');
      applyReminder({ days: [...days].sort() });
    };
  });
}

// ---- données ---------------------------------------------------------------------------------------

function data(root) {
  const st = store.get();
  root.innerHTML = `${subHead('Données et sauvegarde')}
  <div class="form">
    <section class="card list">
      <button class="row" data-act="backup"><span class="row-ic">${icon('download', 22)}</span><span class="row-txt"><b>Exporter une sauvegarde</b><small>${st.missions.length} mission${st.missions.length > 1 ? 's' : ''}, ${st.entries.length} journée${st.entries.length > 1 ? 's' : ''} · fichier .json</small></span>${icon('chevron', 18, 'row-chev')}</button>
      <button class="row" data-act="restore"><span class="row-ic">${icon('upload', 22)}</span><span class="row-txt"><b>Importer une sauvegarde</b><small>Remplace les données actuelles</small></span>${icon('chevron', 18, 'row-chev')}</button>
      ${!st.missions.length ? `<button class="row" data-act="demo"><span class="row-ic">${icon('sparkle', 22)}</span><span class="row-txt"><b>Charger l’exemple</b><small>Deux missions et six semaines de journées</small></span>${icon('chevron', 18, 'row-chev')}</button>` : ''}
      <button class="row danger" data-act="wipe"><span class="row-ic">${icon('trash', 22)}</span><span class="row-txt"><b>Tout effacer</b><small>Missions, journées et réglages</small></span></button>
    </section>
    ${info('Tes données restent sur ton téléphone : rien n’est envoyé sur Internet. Une copie de secours est gardée dans les fichiers privés de l’appli ; pour changer de téléphone, exporte une sauvegarde. La sauvegarde contient aussi tes réglages et ta personnalisation.', 'shield')}
  </div>`;
  root.querySelector('[data-act=backup]').onclick = async () => {
    await shareFile(`fable-sauvegarde-${todayIso()}.json`, store.exportJson(), 'application/json', 'Sauvegarde Fable');
  };
  root.querySelector('[data-act=restore]').onclick = async () => {
    const txt = await pickTextFile();
    if (!txt) return;
    let parsed;
    try {
      parsed = JSON.parse(txt);
      store.sanitize(parsed);
    } catch (e) {
      return toast(e.message?.startsWith('Ce fichier') ? e.message : 'Fichier illisible.', { kind: 'err' });
    }
    if (!(await confirmSheet({ title: 'Remplacer les données ?', text: `La sauvegarde contient ${parsed.missions.length} mission(s) et ${parsed.entries.length} journée(s). Les données actuelles seront remplacées.`, ok: 'Importer' }))) return;
    store.replaceAll(parsed);
    haptic('success');
    toast('Sauvegarde importée');
    data(root);
  };
  root.querySelector('[data-act=demo]')?.addEventListener('click', () => {
    loadDemo();
    haptic('success');
    toast('Exemple chargé');
    data(root);
  });
  root.querySelector('[data-act=wipe]').onclick = async () => {
    if (!(await confirmSheet({ title: 'Tout effacer ?', text: 'Missions, journées et réglages seront supprimés de ce téléphone. Cette action est définitive.', ok: 'Tout effacer', danger: true }))) return;
    sheet({
      title: 'Dernière vérification',
      html: `<p class="sheet-text">Tape <b>EFFACER</b> pour confirmer.</p><label class="field"><span class="field-box"><input name="c" autocomplete="off" autocapitalize="characters"></span></label><div class="sheet-actions"><button class="btn danger" data-ok disabled>Tout effacer</button></div>`,
      onMount(el, sh) {
        const inp = el.querySelector('[name=c]');
        const ok = el.querySelector('[data-ok]');
        inp.oninput = () => (ok.disabled = inp.value.trim().toUpperCase() !== 'EFFACER');
        ok.onclick = () => {
          store.resetAll();
          scheduleReminders({ enabled: false, time: '19:30', days: [] });
          sh.close();
          toast('Toutes les données ont été effacées');
          data(root);
        };
      },
    });
  };
}
