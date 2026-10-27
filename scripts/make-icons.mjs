// Génère les icônes Android de Fable (lanceur adaptatif, ancienne icône, monochrome, notification).
// Usage : node scripts/make-icons.mjs   (SHARP_PATH pour pointer vers une installation de sharp)
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const sharp = (await import(process.env.SHARP_PATH || 'sharp')).default;
const RES = join(process.cwd(), 'scripts/android-extra/res');
const BG = '#0E120F';
const LIME = '#C8F25A';
const CREAM = '#F2F5EC';

// Dessin sur une grille de 108 (taille d'une icône adaptative), zone sûre = cercle de 66.
const glyph = (ring, hand, { cx = 54, cy = 54, r = 21, w = 7 } = {}) => {
  const c = 2 * Math.PI * r;
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${ring}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="${(c * 0.74).toFixed(2)} ${c}" transform="rotate(-90 ${cx} ${cy})"/>
    <path d="M${cx} ${cy}V${cy - r + 8}" stroke="${hand}" stroke-width="${w * 0.72}" stroke-linecap="round"/>
    <circle cx="${cx}" cy="${cy}" r="${w * 0.66}" fill="${hand}"/>`;
};

const svg = (body, size = 108, bg = null, round = false) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 108 108">
    ${bg ? (round ? `<circle cx="54" cy="54" r="54" fill="${bg}"/>` : `<rect width="108" height="108" rx="24" fill="${bg}"/>`) : ''}
    ${body}</svg>`);

const DENS = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };

for (const [d, k] of Object.entries(DENS)) {
  const dir = join(RES, `mipmap-${d}`);
  mkdirSync(dir, { recursive: true });
  const fg = Math.round(108 * k);
  const legacy = Math.round(48 * k);
  await sharp(svg(glyph(LIME, CREAM))).resize(fg, fg).png().toFile(join(dir, 'ic_launcher_foreground.png'));
  await sharp(svg(glyph('#FFFFFF', '#FFFFFF'))).resize(fg, fg).png().toFile(join(dir, 'ic_launcher_monochrome.png'));
  // icône classique (avant Android 8) : le dessin agrandi pour remplir le carré
  const big = glyph(LIME, CREAM, { r: 30, w: 10 });
  await sharp(svg(big, 108, BG)).resize(legacy, legacy).png().toFile(join(dir, 'ic_launcher.png'));
  await sharp(svg(big, 108, BG, true)).resize(legacy, legacy).png().toFile(join(dir, 'ic_launcher_round.png'));
  // petite icône de notification (silhouette blanche, 24 dp)
  const ddir = join(RES, `drawable-${d}`);
  mkdirSync(ddir, { recursive: true });
  const n = Math.round(24 * k);
  await sharp(svg(glyph('#FFFFFF', '#FFFFFF', { r: 34, w: 13 }))).resize(n, n).png().toFile(join(ddir, 'ic_stat_fable.png'));
}

mkdirSync(join(RES, 'mipmap-anydpi-v26'), { recursive: true });
const adaptive = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
    <monochrome android:drawable="@mipmap/ic_launcher_monochrome"/>
</adaptive-icon>
`;
writeFileSync(join(RES, 'mipmap-anydpi-v26/ic_launcher.xml'), adaptive);
writeFileSync(join(RES, 'mipmap-anydpi-v26/ic_launcher_round.xml'), adaptive);
mkdirSync(join(RES, 'values'), { recursive: true });
writeFileSync(join(RES, 'values/ic_launcher_background.xml'), `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${BG}</color>\n</resources>\n`);

// aperçu pour le README
mkdirSync(join(process.cwd(), 'docs'), { recursive: true });
await sharp(svg(glyph(LIME, CREAM, { r: 30, w: 10 }), 108, BG)).resize(256, 256).png().toFile(join(process.cwd(), 'docs/icon.png'));
console.log('Icônes générées.');
