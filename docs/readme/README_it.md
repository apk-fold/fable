<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · **Italiano**
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../docs/icon.png" width="96" alt="Icona di Fable"></p>

<h1 align="center">Fable</h1>
<p align="center"><b>Le tue ore, il tuo lordo, senza calcolatrice.</b><br>Registro delle ore per i contratti francesi di lavoro interinale (intérim), a tempo determinato (CDD) e indeterminato (CDI): straordinari a scaglioni, notte, domenica, festivi, buoni pasto, IFM e ferie retribuite.</p>

<p align="center"><a href="https://github.com/apk-fold/fable/releases/latest/download/fable.apk"><b>⬇️ Scarica l'APK</b></a> · Android 7 o successivo · gratuito, offline, senza account</p>

<p align="center">
  <img src="../../docs/accueil.png" width="200" alt="Home e timbratura">
  <img src="../../docs/historique.png" width="200" alt="Cronologia">
  <img src="../../docs/resume.png" width="200" alt="Riepilogo del mese">
  <img src="../../docs/mission.png" width="200" alt="Impostazioni di una missione">
</p>

## Installazione

1. Sul telefono, apri il link **Scarica l'APK** qui sopra (o l'ultima [release](https://github.com/apk-fold/fable/releases/latest)).
2. Consenti l'installazione dal browser se Android lo chiede, poi installa.
3. Le nuove versioni si installano sopra la precedente: stessa firma, dati conservati.

Ogni modifica del codice inviata su `main` ricompila automaticamente l'APK (GitHub Actions) e pubblica una nuova release.

### Firma

La chiave di firma non è nel repository. GitHub Actions la legge dal secret **`FABLE_KEYSTORE_B64`** (il file `.jks` codificato in base64, password `FABLE_KEYSTORE_PASSWORD` facoltativa). Senza questo secret, l'APK viene firmato con una chiave temporanea: si installa, ma la versione successiva chiederà di disinstallare la precedente.

## Cosa fa l'app

**Inserimento**
- Timbratura: *Inizia*, *Pausa*, *Termina* — la giornata si crea da sola (arrotondamento al quarto d'ora facoltativo).
- Inserimento manuale: data, inizio → fine (turni oltre la mezzanotte gestiti), pausa, pulsanti **+ Straordinari** (+15 min, +30 min, +1 h).
- Anteprima del calcolo in tempo reale durante l'inserimento, avviso se due giornate si sovrappongono.
- Ripetere una giornata in altri giorni della settimana, duplicare una giornata, forzare o togliere il buono pasto caso per caso.

**Missioni** (una per datore di lavoro o agenzia), ognuna con le sue regole:
- Tipo di contratto: Interinale (intérim), Tempo determinato (CDD), Indeterminato (CDI), Altro — paga oraria lorda, colore.
- **Straordinari** a settimana o al giorno, con 2 scaglioni (es. +25% dalle 35 h, +50% dalle 43 h).
- **Ore notturne** in una fascia regolabile (dalle 21 alle 6 di default) con la relativa maggiorazione.
- **Domenica** e **festivi**: calendario della **Francia metropolitana (Parigi)** di default, oppure **Alsazia-Mosella** (+ Venerdì santo e 26 dicembre), impostabile per tutte le missioni.
- Cumulo delle maggiorazioni: sommate o solo la più alta; la notte dal sabato alla domenica conteggiata in base al giorno di inizio oppure ora per ora.
- **Buono pasto** per ogni giorno lavorato o a partire da un certo numero di ore, **indennità di trasferta** giornaliera.
- **IFM** (indennità di fine missione, lavoro interinale) o **premio di precarietà** (CDD) e **ICCP** (indennità per ferie), 10% + 10% di default.
- **Periodo di paga** sul mese intero o sfalsato (es. dal 21 al 20), orari e pausa predefiniti.

**Monitoraggio**
- Home: timbratura, settimana in corso con l'indicatore della soglia degli straordinari, totali del mese.
- Cronologia per mese, in elenco raggruppato per settimana o in calendario, filtro per missione.
- Riepilogo di settimana / mese / anno: ore, straordinari per scaglione, notte, domenica, festivi, giorni lavorati, grafico, dettaglio dal lordo fino al **netto stimato** (aliquota contributiva regolabile).
- **Esportazione PDF** (prospetto ore pronto da inviare), **Excel .xlsx** e **CSV** — senza abbonamento.

**Il resto**
- Promemoria tramite notifica nei giorni e all'ora che scegli.
- **Tutto si personalizza** nelle Impostazioni: tema scuro, nero (AMOLED), chiaro o automatico; colore principale e colori delle maggiorazioni (tavolozza o colore libero); caratteri; dimensione del testo; angoli; densità; animazioni; formato delle durate (7 h 30, 7h30 o 7,5 h); modalità discreta che nasconde gli importi; schermata iniziale; vista della cronologia. Colore libero anche per ogni missione.
- Backup / ripristino in un file `.json`, copia di sicurezza automatica nei file privati dell'app.
- Nessun dato lascia il telefono: niente account, niente server, niente pubblicità.

## Come si calcola

Ogni giornata viene suddivisa minuto per minuto. Per ogni minuto lavorato, Fable sa se cade di notte, di domenica o in un festivo e in quale scaglione di straordinari (totale della settimana dal lunedì alla domenica, in ordine cronologico). La pausa viene detratta in proporzione. Una settimana a cavallo di due mesi viene calcolata per intero, poi si contano solo i giorni del periodo.

- Paga lorda = ore × tariffa + maggiorazioni
- IFM / premio di precarietà = lordo × 10%
- ICCP = (lordo + IFM) × 10%
- Netto stimato = totale lordo − contributi (22% di default) + buoni pasto e trasferte

Sono **stime**: fanno fede il tuo contratto collettivo e la tua busta paga.

## Sviluppo

```bash
npm install
npm run dev        # interfaccia nel browser
npm test           # test del motore di calcolo
npm run sync       # build web + progetto Android (dopo «npx cap add android» la prima volta)
npm run open       # apre il progetto in Android Studio
```

Struttura: `src/core` (calcoli, festivi, archiviazione, esportazioni PDF/Excel), `src/views` (schermate), `src/ui` (componenti), `scripts/patch-android.mjs` (nome, icone, tema e firma del progetto Android), `tests/` (test del motore e percorsi dell'interfaccia).

Stack: HTML/CSS/JS senza framework, [Vite](https://vitejs.dev), [Capacitor 8](https://capacitorjs.com), [pdf-lib](https://pdf-lib.js.org). Caratteri Manrope e Unbounded (SIL Open Font License).
