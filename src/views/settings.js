// Réglages : calculs, rappel, apparence, sauvegarde, à propos.
import * as store from '../core/store.js';
import { icon } from '../ui/icons.js';
import { esc, pct, parseDecimal, toast, confirmSheet, sheet, numShort } from '../ui/dom.js';
import { subHead, seg, bindSeg, switchEl, field, info } from '../ui/components.js';
import { shareFile, pickTextFile, scheduleReminders, appInfo, haptic, isNative } from '../platform.js';
import { loadDemo } from '../core/demo.js';
import { todayIso, DAYS_SHORT } from '../core/time.js';
import { logo } from './today.js';

export const liveRefresh = false;

export function render(root) {
  const s = store.get().settings;
  const st = store.get();
  root.innerHTML = `${subHead('Réglages')}
  <div class="form">
    <h4 class="group">Calculs</h4>
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

    <h4 class="group">Rappel</h4>
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

    <h4 class="group">Apparence</h4>
    <section class="card">
      <span class="field-label">Thème</span>
      ${seg('theme', [['dark', `${icon('moon', 16)} Sombre`], ['light', `${icon('sun', 16)} Clair`], ['auto', 'Auto']], s.theme, 'wide')}
      <div class="toggle-head sub"><div><b>Vibrations</b><small>Retour haptique sur les actions.</small></div>${switchEl('haptics', s.haptics, 'Vibrations')}</div>
    </section>

    <h4 class="group">Données</h4>
    <section class="card list">
      <button class="row" data-act="backup"><span class="row-ic">${icon('download', 22)}</span><span class="row-txt"><b>Exporter une sauvegarde</b><small>${st.missions.length} mission${st.missions.length > 1 ? 's' : ''}, ${st.entries.length} journée${st.entries.length > 1 ? 's' : ''} · fichier .json</small></span>${icon('chevron', 18, 'row-chev')}</button>
      <button class="row" data-act="restore"><span class="row-ic">${icon('upload', 22)}</span><span class="row-txt"><b>Importer une sauvegarde</b><small>Remplace les données actuelles</small></span>${icon('chevron', 18, 'row-chev')}</button>
      ${!st.missions.length ? `<button class="row" data-act="demo"><span class="row-ic">${icon('sparkle', 22)}</span><span class="row-txt"><b>Charger l’exemple</b><small>Deux missions et six semaines de journées</small></span>${icon('chevron', 18, 'row-chev')}</button>` : ''}
      <button class="row danger" data-act="wipe"><span class="row-ic">${icon('trash', 22)}</span><span class="row-txt"><b>Tout effacer</b><small>Missions, journées et réglages</small></span></button>
    </section>
    ${info('Tes données restent sur ton téléphone : rien n’est envoyé sur Internet. Une copie de secours est gardée dans les fichiers privés de l’appli ; pour changer de téléphone, exporte une sauvegarde.', 'shield')}

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
  bindSeg(root, 'theme', (v) => {
    store.setSettings({ theme: v });
    document.dispatchEvent(new CustomEvent('fable:theme'));
  });
  root.querySelector('[name=haptics]').addEventListener('change', (e) => store.setSettings({ haptics: e.target.checked }));

  // rappel
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

  // données
  root.querySelector('[data-act=backup]').onclick = async () => {
    await shareFile(`fable-sauvegarde-${todayIso()}.json`, store.exportJson(), 'application/json', 'Sauvegarde Fable');
  };
  root.querySelector('[data-act=restore]').onclick = async () => {
    const txt = await pickTextFile();
    if (!txt) return;
    let data;
    try {
      data = JSON.parse(txt);
      store.sanitize(data);
    } catch (e) {
      return toast(e.message?.startsWith('Ce fichier') ? e.message : 'Fichier illisible.', { kind: 'err' });
    }
    if (!(await confirmSheet({ title: 'Remplacer les données ?', text: `La sauvegarde contient ${data.missions.length} mission(s) et ${data.entries.length} journée(s). Les données actuelles seront remplacées.`, ok: 'Importer' }))) return;
    store.replaceAll(data);
    haptic('success');
    toast('Sauvegarde importée');
    render(root);
  };
  root.querySelector('[data-act=demo]')?.addEventListener('click', () => {
    loadDemo();
    haptic('success');
    toast('Exemple chargé');
    render(root);
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
          render(root);
        };
      },
    });
  };
}
