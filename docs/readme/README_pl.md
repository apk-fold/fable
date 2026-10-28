<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · **Polski** · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../docs/icon.png" width="96" alt="Ikona Fable"></p>

<h1 align="center">Fable</h1>
<p align="center"><b>Twoje godziny, twoje brutto, bez kalkulatora.</b><br>Ewidencja godzin dla francuskich umów pracy tymczasowej (intérim), na czas określony (CDD) i nieokreślony (CDI): nadgodziny progowe, noc, niedziela, święta, dodatki na posiłki, IFM i płatny urlop.</p>

<p align="center"><a href="https://github.com/apk-fold/fable/releases/latest/download/fable.apk"><b>⬇️ Pobierz APK</b></a> · Android 7 lub nowszy · za darmo, offline, bez konta</p>

<p align="center">
  <img src="../../docs/accueil.png" width="200" alt="Ekran główny i rejestrator czasu">
  <img src="../../docs/historique.png" width="200" alt="Historia">
  <img src="../../docs/resume.png" width="200" alt="Podsumowanie miesiąca">
  <img src="../../docs/mission.png" width="200" alt="Ustawienia zlecenia">
</p>

## Instalacja

1. Na telefonie otwórz link **Pobierz APK** powyżej (albo najnowszy [release](https://github.com/apk-fold/fable/releases/latest)).
2. Zezwól na instalację z przeglądarki, jeśli Android o to poprosi, a potem zainstaluj.
3. Nowe wersje instalują się na starej: ten sam podpis, dane zostają.

Każda zmiana kodu wypchnięta do `main` automatycznie przebudowuje APK (GitHub Actions) i publikuje nowy release.

### Podpis

Klucza podpisu nie ma w repozytorium. GitHub Actions odczytuje go z sekretu **`FABLE_KEYSTORE_B64`** (plik `.jks` zakodowany w base64, hasło `FABLE_KEYSTORE_PASSWORD` opcjonalne). Bez tego sekretu APK jest podpisywany tymczasowym kluczem: zainstaluje się, ale następna wersja poprosi o odinstalowanie poprzedniej.

## Co robi aplikacja

**Wprowadzanie**
- Rejestrator czasu: *Rozpocznij*, *Przerwa*, *Zakończ* — dzień tworzy się sam (opcjonalne zaokrąglanie do kwadransa).
- Wprowadzanie ręczne: data, początek → koniec (obsługa zmian po północy), przerwa, przyciski **+ Nadgodziny** (+15 min, +30 min, +1 h).
- Podgląd obliczeń na żywo podczas wpisywania, ostrzeżenie, gdy dwa dni się nakładają.
- Powtórzenie dnia na inne dni tygodnia, duplikowanie dnia, wymuszenie lub usunięcie dodatku na posiłek w pojedynczych przypadkach.

**Zlecenia** (jedno na pracodawcę lub agencję), każde z własnymi zasadami:
- Rodzaj umowy: Praca tymczasowa (intérim), Na czas określony (CDD), Na czas nieokreślony (CDI), Inna — stawka godzinowa brutto, kolor.
- **Nadgodziny** tygodniowo lub dziennie, z 2 progami (np. +25% od 35 h, +50% od 43 h).
- **Godziny nocne** w regulowanym przedziale (domyślnie 21:00 → 6:00) z własnym dodatkiem.
- **Niedziele** i **święta**: domyślnie kalendarz **Francji kontynentalnej (Paryż)** albo **Alzacji-Mozeli** (+ Wielki Piątek i 26 grudnia), ustawiany dla wszystkich zleceń.
- Łączenie dodatków: sumowane albo tylko najwyższy; noc z soboty na niedzielę liczona według dnia rozpoczęcia lub godzina po godzinie.
- **Dodatek na posiłek** za każdy dzień pracy lub od określonej liczby godzin, **dodatek na dojazd** za dzień.
- **IFM** (odprawa po zakończeniu zlecenia, praca tymczasowa) lub **premia za niestabilność** (CDD) oraz **ICCP** (ekwiwalent za urlop), domyślnie 10% + 10%.
- **Okres rozliczeniowy** za pełny miesiąc lub przesunięty (np. od 21. do 20.), domyślne godziny i przerwa.

**Podsumowania**
- Ekran główny: rejestrator czasu, bieżący tydzień ze wskaźnikiem progu nadgodzin, sumy miesiąca.
- Historia według miesięcy, jako lista pogrupowana tygodniami albo kalendarz, filtr według zlecenia.
- Podsumowanie tygodnia / miesiąca / roku: godziny, nadgodziny według progów, noc, niedziele, święta, przepracowane dni, wykres, rozbicie od brutto aż do **szacowanego netto** (regulowana stawka składek).
- **Eksport do PDF** (ewidencja godzin gotowa do wysłania), **Excel .xlsx** i **CSV** — bez subskrypcji.

**Reszta**
- Przypomnienie powiadomieniem w wybrane dni i o wybranej godzinie.
- **Wszystko da się dostosować** w Ustawieniach: motyw ciemny, czarny (AMOLED), jasny lub automatyczny; kolor główny i kolory dodatków (paleta lub dowolny kolor); czcionki; rozmiar tekstu; zaokrąglenia; gęstość; animacje; format czasu trwania (7 h 30, 7h30 lub 7,5 h); tryb dyskretny ukrywający kwoty; ekran startowy; widok historii. Dowolny kolor także dla każdego zlecenia.
- Kopia zapasowa / przywracanie z pliku `.json`, automatyczna kopia bezpieczeństwa w prywatnych plikach aplikacji.
- Żadne dane nie opuszczają telefonu: bez konta, bez serwera, bez reklam.

## Jak to jest liczone

Każdy dzień jest dzielony minuta po minucie. Dla każdej przepracowanej minuty Fable wie, czy przypada w nocy, w niedzielę czy w święto, i w który próg nadgodzin wpada (suma tygodnia od poniedziałku do niedzieli, w kolejności chronologicznej). Przerwa jest odejmowana proporcjonalnie. Tydzień na przełomie dwóch miesięcy jest liczony w całości, a potem uwzględniane są tylko dni z danego okresu.

- Wynagrodzenie brutto = godziny × stawka + dodatki
- IFM / premia za niestabilność = brutto × 10%
- ICCP = (brutto + IFM) × 10%
- Szacowane netto = suma brutto − składki (domyślnie 22%) + posiłki i dojazdy

To są **szacunki**: wiążące są twój układ zbiorowy i pasek wypłaty.

## Rozwój

```bash
npm install
npm run dev        # interfejs w przeglądarce
npm test           # testy silnika obliczeń
npm run sync       # build web + projekt Android (za pierwszym razem po „npx cap add android”)
npm run open       # otwiera projekt w Android Studio
```

Struktura: `src/core` (obliczenia, święta, przechowywanie, eksport PDF/Excel), `src/views` (ekrany), `src/ui` (komponenty), `scripts/patch-android.mjs` (nazwa, ikony, motyw i podpis projektu Android), `tests/` (testy silnika i scenariusze interfejsu).

Stos: HTML/CSS/JS bez frameworka, [Vite](https://vitejs.dev), [Capacitor 8](https://capacitorjs.com), [pdf-lib](https://pdf-lib.js.org). Czcionki Manrope i Unbounded (SIL Open Font License).
