// Ajustements du projet Android généré par Capacitor (idempotent, à relancer sans risque) :
//  - nom « Fable », icônes (lanceur adaptatif + notification), fond sombre au lancement
//  - clavier en adjustResize, pas de sauvegarde Android automatique des données (copie gérée par l'appli)
//  - signature stable (mêmes clés à chaque compilation : les mises à jour s'installent par-dessus)
//  - numéro de version = numéro de compilation GitHub Actions
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(process.cwd(), 'android');
const log = (m) => console.log('[patch] ' + m);
if (!existsSync(root)) {
  log('Dossier android/ absent : lance d’abord « npx cap add android ».');
  process.exit(0);
}
const main = join(root, 'app/src/main');

// 1. Ressources (icônes, couleur de fond de l'icône, icône de notification)
const copyTree = (from, to) => {
  mkdirSync(to, { recursive: true });
  for (const e of readdirSync(from, { withFileTypes: true })) {
    if (e.isDirectory()) copyTree(join(from, e.name), join(to, e.name));
    else copyFileSync(join(from, e.name), join(to, e.name));
  }
};
copyTree(join(process.cwd(), 'scripts/android-extra/res'), join(main, 'res'));
log('Icônes copiées.');

// 2. Manifest
const manifestPath = join(main, 'AndroidManifest.xml');
let x = readFileSync(manifestPath, 'utf8');
x = x.replace(/android:allowBackup="true"/, 'android:allowBackup="false"');
if (!x.includes('android:allowBackup')) x = x.replace('<application', '<application\n        android:allowBackup="false"');
if (!x.includes('windowSoftInputMode')) x = x.replace(/(<activity[^>]*android:name="\.MainActivity")/, '$1\n            android:windowSoftInputMode="adjustResize"');
const perms = ['<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />'];
const missing = perms.filter((p) => !x.includes(p.match(/name="([^"]+)"/)[1] + '"'));
if (missing.length) x = x.replace('<application', missing.join('\n    ') + '\n\n    <application');
writeFileSync(manifestPath, x);
log('Manifest ajusté.');

// 3. Couleurs et thèmes sombres (pas de flash blanc au démarrage)
writeFileSync(join(main, 'res/values/fable_colors.xml'), '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="fable_ink">#0B0D0C</color>\n</resources>\n');
const stylesPath = join(main, 'res/values/styles.xml');
if (existsSync(stylesPath)) {
  let s = readFileSync(stylesPath, 'utf8');
  s = s.replace(/@drawable\/splash/g, '@color/fable_ink');
  const themeRe = /<style name="AppTheme\.NoActionBar"[^>]*>[\s\S]*?<\/style>/;
  const m = s.match(themeRe);
  if (m) {
    const names = ['android:windowBackground', 'android:statusBarColor', 'android:navigationBarColor', 'android:windowLightStatusBar', 'android:windowLightNavigationBar', 'android:enforceStatusBarContrast', 'android:enforceNavigationBarContrast'];
    let blk = m[0]
      .split('\n')
      .filter((l) => !names.some((n) => l.includes(`name="${n}"`)))
      .join('\n');
    blk = blk.replace(
      /(<style name="AppTheme\.NoActionBar"[^>]*>)/,
      `$1
        <item name="android:windowBackground">@color/fable_ink</item>
        <item name="android:statusBarColor">@android:color/transparent</item>
        <item name="android:navigationBarColor">@color/fable_ink</item>
        <item name="android:windowLightStatusBar">false</item>
        <item name="android:windowLightNavigationBar">false</item>
        <item name="android:enforceStatusBarContrast">false</item>
        <item name="android:enforceNavigationBarContrast">false</item>`,
    );
    s = s.replace(themeRe, () => blk);
  }
  if (!s.includes('windowSplashScreenBackground')) {
    s = s.replace(/(<style name="AppTheme\.NoActionBarLaunch"[^>]*>)/, '$1\n        <item name="windowSplashScreenBackground">@color/fable_ink</item>\n        <item name="windowSplashScreenAnimatedIcon">@mipmap/ic_launcher_foreground</item>');
  }
  writeFileSync(stylesPath, s);
  log('Thèmes sombres appliqués.');
}

// 4. Nom de l'appli
const stringsPath = join(main, 'res/values/strings.xml');
if (existsSync(stringsPath)) {
  let t = readFileSync(stringsPath, 'utf8');
  t = t.replace(/(<string name="app_name">)[^<]*(<\/string>)/, '$1Fable$2').replace(/(<string name="title_activity_main">)[^<]*(<\/string>)/, '$1Fable$2');
  writeFileSync(stringsPath, t);
}

// 5. Signature stable : clé du dépôt par défaut, ou secrets FABLE_KEYSTORE_* en CI
const gradlePath = join(root, 'app/build.gradle');
let g = readFileSync(gradlePath, 'utf8');
if (!g.includes('signingConfigs')) {
  g = g.replace(
    /android \{/,
    `android {
    signingConfigs {
        fable {
            storeFile file(System.getenv("FABLE_KEYSTORE_PATH") ?: "\${rootDir}/../signing/fable.jks")
            storePassword System.getenv("FABLE_KEYSTORE_PASSWORD") ?: "fable-apk-fold"
            keyAlias System.getenv("FABLE_KEY_ALIAS") ?: "fable"
            keyPassword System.getenv("FABLE_KEY_PASSWORD") ?: "fable-apk-fold"
        }
    }`,
  );
  g = g.replace(
    /buildTypes \{\s*release \{/,
    `buildTypes {
        debug {
            signingConfig signingConfigs.fable
        }
        release {
            signingConfig signingConfigs.fable`,
  );
  writeFileSync(gradlePath, g);
  log('Signature Fable configurée (debug et release).');
}

// 6. Numéro de version (GitHub Actions : numéro de compilation)
const build = process.env.FABLE_BUILD;
if (build && /^\d+$/.test(build)) {
  g = readFileSync(gradlePath, 'utf8');
  g = g.replace(/versionCode \d+/, `versionCode ${build}`).replace(/versionName "[^"]*"/, `versionName "1.${build}"`);
  writeFileSync(gradlePath, g);
  log(`Version 1.${build}.`);
}

log('OK.');
