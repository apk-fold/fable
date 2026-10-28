<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · **Deutsch** · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../docs/icon.png" width="96" alt="Fable-Symbol"></p>

<h1 align="center">Fable</h1>
<p align="center"><b>Deine Stunden, dein Bruttolohn, ohne Taschenrechner.</b><br>Arbeitszeiterfassung für französische Leiharbeit (intérim), befristete (CDD) und unbefristete (CDI) Verträge: gestaffelte Überstunden, Nacht, Sonntag, Feiertage, Essenszulagen, IFM und bezahlter Urlaub.</p>

<p align="center"><a href="https://github.com/apk-fold/fable/releases/latest/download/fable.apk"><b>⬇️ APK herunterladen</b></a> · Android 7 und höher · kostenlos, offline, ohne Konto</p>

<p align="center">
  <img src="../../docs/accueil.png" width="200" alt="Startseite und Stempeluhr">
  <img src="../../docs/historique.png" width="200" alt="Verlauf">
  <img src="../../docs/resume.png" width="200" alt="Monatsübersicht">
  <img src="../../docs/mission.png" width="200" alt="Einstellungen eines Einsatzes">
</p>

## Installieren

1. Öffne auf dem Handy den Link **APK herunterladen** oben (oder das neueste [Release](https://github.com/apk-fold/fable/releases/latest)).
2. Erlaube die Installation aus deinem Browser, falls Android danach fragt, und installiere dann.
3. Neue Versionen werden über die alte installiert: gleiche Signatur, Daten bleiben erhalten.

Jede auf `main` gepushte Codeänderung baut die APK automatisch neu (GitHub Actions) und veröffentlicht ein neues Release.

### Signatur

Der Signaturschlüssel liegt nicht im Repository. GitHub Actions liest ihn aus dem Secret **`FABLE_KEYSTORE_B64`** (die `.jks`-Datei in Base64 kodiert, Passwort `FABLE_KEYSTORE_PASSWORD` optional). Ohne dieses Secret wird die APK mit einem temporären Schlüssel signiert: Sie lässt sich installieren, aber die nächste Version verlangt, die vorherige zu deinstallieren.

## Was die App kann

**Erfassung**
- Stempeluhr: *Beginnen*, *Pause*, *Beenden* — der Tag wird von selbst angelegt (Rundung auf die Viertelstunde optional).
- Manuelle Eingabe: Datum, Beginn → Ende (Schichten über Mitternacht werden unterstützt), Pause, Schaltflächen **+ Überstunden** (+15 Min., +30 Min., +1 Std.).
- Live-Vorschau der Berechnung während der Eingabe, Warnung, wenn sich zwei Tage überschneiden.
- Einen Tag auf andere Wochentage übertragen, einen Tag duplizieren, Essenszulage im Einzelfall erzwingen oder streichen.

**Einsätze** (einer pro Arbeitgeber oder Agentur), jeder mit eigenen Regeln:
- Vertragsart: Leiharbeit (intérim), Befristet (CDD), Unbefristet (CDI), Sonstige — Brutto-Stundenlohn, Farbe.
- **Überstunden** pro Woche oder pro Tag, mit 2 Stufen (z. B. +25 % ab 35 Std., +50 % ab 43 Std.).
- **Nachtstunden** in einem einstellbaren Zeitraum (standardmäßig 21 → 6 Uhr) mit eigenem Zuschlag.
- **Sonntage** und **Feiertage**: standardmäßig Kalender für **Frankreich (Festland, Paris)** oder **Elsass-Mosel** (+ Karfreitag und 26. Dezember), einstellbar für alle Einsätze.
- Kumulierung der Zuschläge: addiert oder nur der höchste; die Nacht von Samstag auf Sonntag nach Anfangstag oder Stunde für Stunde gezählt.
- **Essenszulage** an jedem Arbeitstag oder ab einer bestimmten Stundenzahl, **Fahrtkostenzulage** pro Tag.
- **IFM** (Einsatzende-Entschädigung bei Leiharbeit) oder **Prekaritätsprämie** (CDD) und **ICCP** (Urlaubsabgeltung), standardmäßig 10 % + 10 %.
- **Abrechnungszeitraum** über den ganzen Monat oder versetzt (z. B. vom 21. bis zum 20.), Standardzeiten und -pause.

**Auswertung**
- Startseite: Stempeluhr, laufende Woche mit Anzeige der Überstundenschwelle, Monatssummen.
- Verlauf nach Monaten, als nach Wochen gruppierte Liste oder als Kalender, Filter nach Einsatz.
- Übersicht für Woche / Monat / Jahr: Stunden, Überstunden nach Stufe, Nacht, Sonntag, Feiertage, Arbeitstage, Diagramm, Aufschlüsselung vom Brutto bis zum **geschätzten Netto** (einstellbarer Abgabensatz).
- **PDF-Export** (versandfertiger Stundenzettel), **Excel .xlsx** und **CSV** — ohne Abo.

**Der Rest**
- Erinnerung per Benachrichtigung an den Tagen und zur Uhrzeit deiner Wahl.
- **Alles lässt sich anpassen** in den Einstellungen: dunkles, schwarzes (AMOLED), helles oder automatisches Theme; Hauptfarbe und Farben der Zuschläge (Palette oder freie Farbe); Schriften; Textgröße; Ecken; Dichte; Animationen; Format der Dauer (7 h 30, 7h30 oder 7,5 h); Diskretmodus, der Beträge ausblendet; Startbildschirm; Ansicht des Verlaufs. Freie Farbe auch für jeden Einsatz.
- Sicherung / Wiederherstellung als `.json`-Datei, automatische Sicherheitskopie in den privaten Dateien der App.
- Keine Daten verlassen das Handy: kein Konto, kein Server, keine Werbung.

## Wie gerechnet wird

Jeder Tag wird Minute für Minute zerlegt. Für jede gearbeitete Minute weiß Fable, ob sie in die Nacht, auf einen Sonntag oder einen Feiertag fällt und in welche Überstundenstufe (Wochensumme von Montag bis Sonntag, in chronologischer Reihenfolge). Die Pause wird anteilig abgezogen. Eine Woche, die zwei Monate überspannt, wird vollständig berechnet, danach werden nur die Tage innerhalb des Zeitraums gezählt.

- Bruttolohn = Stunden × Satz + Zuschläge
- IFM / Prekaritätsprämie = Brutto × 10 %
- ICCP = (Brutto + IFM) × 10 %
- Geschätztes Netto = Gesamtbrutto − Abgaben (standardmäßig 22 %) + Essens- und Fahrtzulagen

Das sind **Schätzungen**: Maßgeblich sind dein Tarifvertrag und deine Gehaltsabrechnung.

## Entwickeln

```bash
npm install
npm run dev        # Oberfläche im Browser
npm test           # Tests der Berechnungs-Engine
npm run sync       # Web-Build + Android-Projekt (beim ersten Mal nach „npx cap add android“)
npm run open       # öffnet das Projekt in Android Studio
```

Struktur: `src/core` (Berechnungen, Feiertage, Speicherung, PDF/Excel-Exporte), `src/views` (Bildschirme), `src/ui` (Komponenten), `scripts/patch-android.mjs` (Name, Symbole, Theme und Signatur des Android-Projekts), `tests/` (Engine-Tests und Abläufe der Oberfläche).

Stack: HTML/CSS/JS ohne Framework, [Vite](https://vitejs.dev), [Capacitor 8](https://capacitorjs.com), [pdf-lib](https://pdf-lib.js.org). Schriften Manrope und Unbounded (SIL Open Font License).
