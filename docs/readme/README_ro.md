<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · **Română**

</div>

<p align="center"><img src="../../docs/icon.png" width="96" alt="Pictograma Fable"></p>

<h1 align="center">Fable</h1>
<p align="center"><b>Orele tale, salariul tău brut, fără calculator.</b><br>Evidența orelor pentru contractele franceze de muncă temporară (intérim), pe durată determinată (CDD) și nedeterminată (CDI): ore suplimentare pe trepte, noapte, duminică, sărbători legale, tichete de masă, IFM și concediu plătit.</p>

<p align="center"><a href="https://github.com/apk-fold/fable/releases/latest/download/fable.apk"><b>⬇️ Descarcă APK-ul</b></a> · Android 7 sau mai nou · gratuit, offline, fără cont</p>

<p align="center">
  <img src="../../docs/accueil.png" width="200" alt="Acasă și pontaj">
  <img src="../../docs/historique.png" width="200" alt="Istoric">
  <img src="../../docs/resume.png" width="200" alt="Rezumatul lunii">
  <img src="../../docs/mission.png" width="200" alt="Setările unei misiuni">
</p>

## Instalare

1. Pe telefon, deschide linkul **Descarcă APK-ul** de mai sus (sau cea mai nouă [release](https://github.com/apk-fold/fable/releases/latest)).
2. Permite instalarea din browser dacă Android cere asta, apoi instalează.
3. Versiunile noi se instalează peste cea veche: aceeași semnătură, datele rămân.

Fiecare modificare de cod trimisă pe `main` recompilează automat APK-ul (GitHub Actions) și publică o nouă release.

### Semnătura

Cheia de semnare nu se află în depozit. GitHub Actions o citește din secretul **`FABLE_KEYSTORE_B64`** (fișierul `.jks` codat în base64, parola `FABLE_KEYSTORE_PASSWORD` este opțională). Fără acest secret, APK-ul e semnat cu o cheie temporară: se instalează, dar versiunea următoare va cere dezinstalarea celei anterioare.

## Ce face aplicația

**Introducere**
- Pontaj: *Începe*, *Pauză*, *Termină* — ziua se creează singură (rotunjire la sfert de oră opțională).
- Introducere manuală: dată, început → sfârșit (sunt acceptate turele care trec de miezul nopții), pauză, butoane **+ Ore suplimentare** (+15 min, +30 min, +1 h).
- Previzualizare live a calculului în timpul introducerii, avertizare dacă două zile se suprapun.
- Repetarea unei zile în alte zile ale săptămânii, duplicarea unei zile, forțarea sau eliminarea tichetului de masă de la caz la caz.

**Misiuni** (câte una pentru fiecare angajator sau agenție), fiecare cu regulile ei:
- Tip de contract: Temporar (intérim), Durată determinată (CDD), Nedeterminată (CDI), Altul — tarif orar brut, culoare.
- **Ore suplimentare** pe săptămână sau pe zi, cu 2 trepte (de ex. +25% de la 35 h, +50% de la 43 h).
- **Ore de noapte** pe un interval reglabil (21 → 6 implicit) cu sporul lor.
- **Duminici** și **sărbători legale**: implicit calendarul **Franței metropolitane (Paris)** sau **Alsacia-Mosela** (+ Vinerea Mare și 26 decembrie), setabil pentru toate misiunile.
- Cumularea sporurilor: adunate sau doar cel mai mare; noaptea de sâmbătă spre duminică numărată după ziua de început sau oră cu oră.
- **Tichet de masă** în fiecare zi lucrată sau de la un anumit număr de ore, **indemnizație de transport** pe zi.
- **IFM** (indemnizație de sfârșit de misiune, muncă temporară) sau **prima de precaritate** (CDD) și **ICCP** (indemnizație de concediu), implicit 10% + 10%.
- **Perioadă de salarizare** pe luna întreagă sau decalată (de ex. de pe 21 până pe 20), program și pauză implicite.

**Urmărire**
- Acasă: pontaj, săptămâna curentă cu indicatorul pragului de ore suplimentare, totalurile lunii.
- Istoric pe luni, ca listă grupată pe săptămâni sau ca calendar, filtrare după misiune.
- Rezumat pe săptămână / lună / an: ore, ore suplimentare pe trepte, noapte, duminică, sărbători, zile lucrate, grafic, detaliere de la brut până la **netul estimat** (cotă de contribuții reglabilă).
- **Export PDF** (foaie de pontaj gata de trimis), **Excel .xlsx** și **CSV** — fără abonament.

**Restul**
- Memento prin notificare în zilele și la ora alese de tine.
- **Totul se personalizează** în Setări: temă întunecată, neagră (AMOLED), luminoasă sau automată; culoarea principală și culorile sporurilor (paletă sau culoare liberă); fonturi; mărimea textului; colțuri; densitate; animații; formatul duratelor (7 h 30, 7h30 sau 7,5 h); mod discret care ascunde sumele; ecran de pornire; vizualizarea istoricului. Culoare liberă și pentru fiecare misiune.
- Backup / restaurare într-un fișier `.json`, copie de siguranță automată în fișierele private ale aplicației.
- Nicio dată nu părăsește telefonul: fără cont, fără server, fără reclame.

## Cum se calculează

Fiecare zi este împărțită minut cu minut. Pentru fiecare minut lucrat, Fable știe dacă pică noaptea, duminica sau într-o sărbătoare legală și în ce treaptă de ore suplimentare intră (totalul săptămânii de luni până duminică, în ordine cronologică). Pauza se scade proporțional. O săptămână aflată între două luni se calculează integral, apoi se numără doar zilele din perioadă.

- Salariu brut = ore × tarif + sporuri
- IFM / prima de precaritate = brut × 10%
- ICCP = (brut + IFM) × 10%
- Net estimat = total brut − contribuții (22% implicit) + tichete de masă și transport

Sunt **estimări**: fac fapt contractul tău colectiv de muncă și fluturașul de salariu.

## Dezvoltare

```bash
npm install
npm run dev        # interfața în browser
npm test           # testele motorului de calcul
npm run sync       # build web + proiect Android (după „npx cap add android” prima dată)
npm run open       # deschide proiectul în Android Studio
```

Structură: `src/core` (calcule, sărbători legale, stocare, exporturi PDF/Excel), `src/views` (ecrane), `src/ui` (componente), `scripts/patch-android.mjs` (numele, pictogramele, tema și semnătura proiectului Android), `tests/` (testele motorului și scenarii de interfață).

Tehnologii: HTML/CSS/JS fără framework, [Vite](https://vitejs.dev), [Capacitor 8](https://capacitorjs.com), [pdf-lib](https://pdf-lib.js.org). Fonturile Manrope și Unbounded (SIL Open Font License).
