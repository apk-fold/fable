// Couche plateforme : Android (Capacitor) ou navigateur (développement, tests).
// Tout ce qui touche au système passe par ici : fichiers, partage, vibrations, rappels,
// barres système, bouton retour.

export const isNative = !!(typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.());

let mods = null;
async function cap() {
  if (!mods) {
    const [fs, share, haptics, app, status, notif] = await Promise.all([
      import('@capacitor/filesystem'),
      import('@capacitor/share'),
      import('@capacitor/haptics'),
      import('@capacitor/app'),
      import('@capacitor/status-bar'),
      import('@capacitor/local-notifications'),
    ]);
    mods = {
      Filesystem: fs.Filesystem,
      Directory: fs.Directory,
      Encoding: fs.Encoding,
      Share: share.Share,
      Haptics: haptics.Haptics,
      ImpactStyle: haptics.ImpactStyle,
      NotificationType: haptics.NotificationType,
      App: app.App,
      StatusBar: status.StatusBar,
      Style: status.Style,
      LocalNotifications: notif.LocalNotifications,
    };
  }
  return mods;
}

// ---- copie de sécurité privée (fichiers internes de l'appli) ------------------------------

const BACKUP = 'fable-data.json';
let writing = Promise.resolve();

export const privateBackup = {
  async read() {
    if (!isNative) return null;
    const { Filesystem, Directory, Encoding } = await cap();
    try {
      return (await Filesystem.readFile({ path: BACKUP, directory: Directory.Data, encoding: Encoding.UTF8 })).data;
    } catch {
      return null;
    }
  },
  write(text) {
    if (!isNative) return Promise.resolve();
    writing = writing
      .catch(() => {})
      .then(async () => {
        const { Filesystem, Directory, Encoding } = await cap();
        await Filesystem.writeFile({ path: BACKUP, data: text, directory: Directory.Data, encoding: Encoding.UTF8 });
      });
    return writing;
  },
};

// ---- partage / enregistrement de fichiers ----------------------------------------------------

function toBase64(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

function download(name, bytes, mime) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([bytes], { type: mime }));
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 1500);
}

/** Partage un fichier (feuille de partage Android : Drive, mail, « Enregistrer »…) ; téléchargement en navigateur. */
export async function shareFile(name, data, mime = 'application/octet-stream', title = 'Fable') {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  if (!isNative) {
    download(name, bytes, mime);
    return true;
  }
  const { Filesystem, Directory, Share } = await cap();
  const r = await Filesystem.writeFile({ path: `partage/${name}`, data: toBase64(bytes), directory: Directory.Cache, recursive: true });
  try {
    await Share.share({ title, files: [r.uri], dialogTitle: title });
    return true;
  } catch {
    return false; // partage annulé
  }
}

/** Ouvre le sélecteur de fichiers et renvoie le texte du fichier choisi (ou null). */
export function pickTextFile(accept = '.json,application/json') {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.style.display = 'none';
    input.addEventListener('change', async () => {
      const f = input.files?.[0];
      input.remove();
      resolve(f ? await f.text() : null);
    });
    document.body.appendChild(input);
    input.click();
  });
}

// ---- vibrations, barres système, cycle de vie -------------------------------------------------

let hapticsOn = true;
export const setHaptics = (on) => {
  hapticsOn = !!on;
};

export async function haptic(kind = 'light') {
  if (!hapticsOn) return;
  if (!isNative) {
    navigator.vibrate?.(kind === 'heavy' ? 25 : 8);
    return;
  }
  const { Haptics, ImpactStyle, NotificationType } = await cap();
  try {
    if (kind === 'success') await Haptics.notification({ type: NotificationType.Success });
    else if (kind === 'warning') await Haptics.notification({ type: NotificationType.Warning });
    else if (kind === 'select') await Haptics.selectionChanged();
    else await Haptics.impact({ style: kind === 'heavy' ? ImpactStyle.Heavy : kind === 'medium' ? ImpactStyle.Medium : ImpactStyle.Light });
  } catch { /* pas de vibreur */ }
}

export async function setSystemBars(dark, color) {
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', color);
  if (!isNative) return;
  const { StatusBar, Style } = await cap();
  try {
    await StatusBar.setOverlaysWebView({ overlay: true });
    await StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light });
  } catch { /* ancien Android */ }
}

export async function onLifecycle({ resume, pause, back }) {
  if (!isNative) {
    document.addEventListener('visibilitychange', () => (document.hidden ? pause?.() : resume?.()));
    return;
  }
  const { App } = await cap();
  App.addListener('resume', () => resume?.());
  App.addListener('pause', () => pause?.());
  App.addListener('backButton', () => back?.());
}

export async function exitApp() {
  if (!isNative) return;
  const { App } = await cap();
  App.exitApp();
}

export async function appInfo() {
  if (!isNative) return { version: 'web', build: '' };
  const { App } = await cap();
  try {
    return await App.getInfo();
  } catch {
    return { version: '?', build: '' };
  }
}

// ---- rappels (notifications locales) ------------------------------------------------------------

const REMINDER_IDS = [101, 102, 103, 104, 105, 106, 107];

/**
 * Programme le rappel hebdomadaire. days : 0 = lundi … 6 = dimanche.
 * Renvoie { ok, reason }.
 */
export async function scheduleReminders({ enabled, time, days }) {
  if (!isNative) return { ok: false, reason: 'Les rappels fonctionnent dans l’appli Android.' };
  const { LocalNotifications } = await cap();
  try {
    await LocalNotifications.cancel({ notifications: REMINDER_IDS.map((id) => ({ id })) });
  } catch { /* rien à annuler */ }
  if (!enabled || !days.length) return { ok: true };
  let perm = await LocalNotifications.checkPermissions();
  if (perm.display !== 'granted') perm = await LocalNotifications.requestPermissions();
  if (perm.display !== 'granted') return { ok: false, reason: 'Notifications refusées : autorise-les dans les réglages Android.' };
  const [hour, minute] = time.split(':').map(Number);
  const notifications = days.map((d) => ({
    id: REMINDER_IDS[d],
    title: 'Tes heures du jour',
    body: 'Un instant pour noter ta journée dans Fable ?',
    schedule: { on: { weekday: d === 6 ? 1 : d + 2, hour, minute }, allowWhileIdle: true },
    smallIcon: 'ic_stat_fable',
    iconColor: '#C8F25A',
  }));
  try {
    await LocalNotifications.schedule({ notifications });
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e?.message || 'Programmation impossible.' };
  }
}
