<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · **Roman Urdu** · [Română](README_ro.md)

</div>

<p align="center"><img src="../../docs/icon.png" width="96" alt="Fable ka icon"></p>

<h1 align="center">Fable</h1>
<p align="center"><b>Aap ke ghante, aap ki gross tankhwah, calculator ke baghair.</b><br>France ke kaam ke contracts ke liye ghanton ka hisaab: agency ke zariye aarzi kaam (intérim), muqarrara muddat (CDD) aur mustaqil (CDI): darja-ba-darja overtime, raat, Itwar, sarkari chhuttiyan, khane ka allowance, IFM aur tankhwah wali chhuttiyan.</p>

<p align="center"><a href="https://github.com/apk-fold/fable/releases/latest/download/fable.apk"><b>⬇️ APK download karein</b></a> · Android 7 aur us se upar · muft, offline, account ke baghair</p>

<p align="center">
  <img src="../../docs/accueil.png" width="200" alt="Home aur time clock">
  <img src="../../docs/historique.png" width="200" alt="History">
  <img src="../../docs/resume.png" width="200" alt="Mahine ka khulasa">
  <img src="../../docs/mission.png" width="200" alt="Ek mission ki settings">
</p>

## Install karna

1. Phone par upar wala **APK download karein** link (ya sab se nayi [release](https://github.com/apk-fold/fable/releases/latest)) kholein.
2. Agar Android poochhe to browser se install karne ki ijazat dein, phir install karein.
3. Naye versions purane ke upar install hote hain: wohi signature, data mehfooz.

`main` par push hone wali har code tabdeeli APK ko khud-ba-khud dobara build karti hai (GitHub Actions) aur nayi release publish karti hai.

### Signing

Signing key repository mein nahin hai. GitHub Actions use **`FABLE_KEYSTORE_B64`** secret se parhta hai (base64 mein encode ki gayi `.jks` file, password `FABLE_KEYSTORE_PASSWORD` ikhtiyari). Yeh secret na ho to APK ek aarzi key se sign hota hai: install ho jata hai, lekin agla version pichhla uninstall karne ko kahega.

## App kya karti hai

**Andraaj**
- Time clock: *Shuru*, *Waqfa*, *Khatam* — din khud-ba-khud ban jata hai (pandrah minute tak round karna ikhtiyari).
- Haath se andraaj: tareekh, shuru → khatam (aadhi raat paar karne wali shifts bhi), waqfa, **+ Overtime** buttons (+15 min, +30 min, +1 ghanta).
- Likhte waqt hisaab ka live preview, do din aapas mein takrayein to warning.
- Ek din ko hafte ke doosre dinon par dohrayein, din ki naqal banayein, khane ka allowance har din alag se zabardasti lagayein ya hatayein.

**Missions** (har employer ya agency ke liye ek), har ek ke apne qawaid:
- Contract ki qism: Aarzi (intérim), Muqarrara muddat (CDD), Mustaqil (CDI), Deegar — gross ghanta rate, rang.
- Hafta war ya roz ka **overtime**, 2 darjon ke saath (maslan 35 ghante se +25%, 43 ghante se +50%).
- Set hone wale waqfe mein **raat ke ghante** (default 21:00 → 6:00) apne izafi rate ke saath.
- **Itwar** aur **sarkari chhuttiyan**: default **France mainland (Paris)** ka calendar, ya **Alsace-Moselle** (+ Good Friday aur 26 December), tamam missions ke liye set hota hai.
- Izafi rates ka jor: sab jama hon ya sirf sab se zyada wala; Hafte se Itwar ki raat shuru ke din ke hisaab se ya ghanta-ba-ghanta ginti hoti hai.
- Har kaam ke din ya kuch ghanton ke baad **khane ka allowance**, roz ka **safar allowance**.
- **IFM** (aarzi kaam mein mission khatam hone ka muawza) ya **contract khatam hone ka bonus** (CDD) aur **ICCP** (tankhwah wali chhuttiyon ka muawza), default 10% + 10%.
- Poore mahine ya hate hue **tankhwah ka daur** (maslan 21 se 20 tak), default waqt aur waqfa.

**Nigrani**
- Home: time clock, overtime ki hadd ke gauge ke saath maujooda hafta, mahine ke totals.
- Mahine war history, hafte war group ki gayi list ya calendar ki soorat mein, mission ke hisaab se filter.
- Hafte / mahine / saal ka khulasa: ghante, har darje ka overtime, raat, Itwar, chhuttiyan, kaam ke din, graph, gross se le kar **andazan net** tak tafseel (kataution ka rate set ho sakta hai).
- **PDF export** (bhejne ke liye tayyar time sheet), **Excel .xlsx** aur **CSV** — subscription ke baghair.

**Baqi sab**
- Aap ke chune hue dinon aur waqt par notification se yaad dihani.
- Settings mein **sab kuch apni marzi ka**: dark, black (AMOLED), light ya auto theme; main rang aur izafi rates ke rang (palette ya koi bhi rang); fonts; text ka size; kone; density; animations; muddat ka format (7 h 30, 7h30 ya 7,5 h); raqam chhupane wala discreet mode; shuru ki screen; history ka view. Har mission ke liye bhi apni pasand ka rang.
- `.json` file mein backup / restore, app ki private files mein khud-ba-khud hifazati copy.
- Koi data phone se bahar nahin jata: na account, na server, na ishtehar.

## Hisaab kaise hota hai

Har din ko minute-ba-minute baanta jata hai. Kaam ke har minute ke liye Fable jaanta hai ke woh raat mein hai, Itwar ko hai ya sarkari chhutti par, aur overtime ke kis darje mein aata hai (Peer se Itwar tak hafte ka total, waqt ki tarteeb se). Waqfa tanasub se kaata jata hai. Do mahinon mein bata hua hafta poora hisaab hota hai, phir sirf daur ke andar wale din gine jaate hain.

- Gross tankhwah = ghante × rate + izafi rates
- IFM / contract khatam hone ka bonus = gross × 10%
- ICCP = (gross + IFM) × 10%
- Andazan net = kul gross − kataution (default 22%) + khane aur safar ke allowance

Yeh sirf **andaze** hain: asal faisla aap ke collective agreement aur payslip ka hai.

## Development

```bash
npm install
npm run dev        # browser mein interface
npm test           # hisaab ke engine ke tests
npm run sync       # web build + Android project (pehli baar "npx cap add android" ke baad)
npm run open       # project ko Android Studio mein kholta hai
```

Structure: `src/core` (hisaab, sarkari chhuttiyan, storage, PDF/Excel exports), `src/views` (screens), `src/ui` (components), `scripts/patch-android.mjs` (Android project ka naam, icons, theme aur signing), `tests/` (engine tests aur interface ke scenarios).

Technology: framework ke baghair HTML/CSS/JS, [Vite](https://vitejs.dev), [Capacitor 8](https://capacitorjs.com), [pdf-lib](https://pdf-lib.js.org). Manrope aur Unbounded fonts (SIL Open Font License).
