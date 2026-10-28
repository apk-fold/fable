<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · **日本語** · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../docs/icon.png" width="96" alt="Fable のアイコン"></p>

<h1 align="center">Fable</h1>
<p align="center"><b>あなたの労働時間と総支給額を、電卓なしで。</b><br>フランスの派遣（intérim）、有期契約（CDD）、無期契約（CDI）向けの勤務時間記録アプリ：段階制の残業、深夜、日曜、祝日、食事手当、IFM、有給休暇に対応。</p>

<p align="center"><a href="https://github.com/apk-fold/fable/releases/latest/download/fable.apk"><b>⬇️ APK をダウンロード</b></a> · Android 7 以降 · 無料・オフライン・アカウント不要</p>

<p align="center">
  <img src="../../docs/accueil.png" width="200" alt="ホームとタイムレコーダー">
  <img src="../../docs/historique.png" width="200" alt="履歴">
  <img src="../../docs/resume.png" width="200" alt="月のまとめ">
  <img src="../../docs/mission.png" width="200" alt="勤務先の設定">
</p>

## インストール

1. スマホで上の **APK をダウンロード** リンク（または最新の [release](https://github.com/apk-fold/fable/releases/latest)）を開きます。
2. Android に求められたらブラウザからのインストールを許可し、インストールします。
3. 新しいバージョンは古いバージョンに上書きインストールされます：署名は同じで、データはそのまま残ります。

`main` にプッシュされたコード変更のたびに、APK が自動で再ビルドされ（GitHub Actions）、新しい release が公開されます。

### 署名

署名鍵はリポジトリに含まれていません。GitHub Actions はシークレット **`FABLE_KEYSTORE_B64`**（base64 でエンコードした `.jks` ファイル。パスワード `FABLE_KEYSTORE_PASSWORD` は任意）から読み込みます。このシークレットがない場合、APK は一時的な鍵で署名されます：インストールはできますが、次のバージョンでは前のバージョンのアンインストールを求められます。

## アプリでできること

**入力**
- タイムレコーダー：*開始*、*休憩*、*終了* —— その日の記録は自動で作成されます（15 分単位の丸めも選択可）。
- 手入力：日付、開始 → 終了（日付をまたぐ勤務にも対応）、休憩、**+ 残業** ボタン（+15 分、+30 分、+1 時間）。
- 入力中に計算結果をリアルタイムでプレビュー。2 つの日が重なると警告します。
- ある日の記録を同じ週のほかの曜日に繰り返す、1 日を複製する、食事手当を日ごとに強制または取り消す。

**勤務先**（雇用主または派遣会社ごとに 1 つ）。それぞれに独自のルールを設定できます：
- 契約の種類：派遣（intérim）、有期（CDD）、無期（CDI）、その他 —— 時給（総支給）、色。
- 週単位または日単位の**残業**、2 段階（例：35 時間から +25%、43 時間から +50%）。
- 時間帯を調整できる**深夜時間**（デフォルトは 21 時 → 6 時）とその割増。
- **日曜**と**祝日**：デフォルトは**フランス本土（パリ）**のカレンダー、または**アルザス＝モゼル**（+ 聖金曜日と 12 月 26 日）。全勤務先に共通で設定します。
- 割増の重ね方：合算するか最も高いもののみ。土曜から日曜にかけての夜勤は開始日基準か 1 時間ごとに計算。
- 勤務日ごと、または一定時間以上働いた日の**食事手当**、1 日あたりの**交通手当**。
- **IFM**（派遣の契約終了手当）または**契約終了手当**（CDD）と **ICCP**（有給休暇手当）、デフォルトは 10% + 10%。
- 月まるごと、またはずらした**給与期間**（例：21 日から翌月 20 日）、デフォルトの勤務時間と休憩。

**集計**
- ホーム：タイムレコーダー、残業しきい値ゲージ付きの今週の状況、今月の合計。
- 月ごとの履歴を、週ごとにまとめたリストかカレンダーで表示。勤務先で絞り込み可能。
- 週 / 月 / 年のまとめ：勤務時間、段階別の残業、深夜、日曜、祝日、出勤日数、グラフ、総支給額から**手取りの見積もり**までの内訳（社会保険料率は調整可能）。
- **PDF 書き出し**（そのまま送れる勤務表）、**Excel .xlsx**、**CSV** —— サブスクリプション不要。

**そのほか**
- 選んだ曜日と時刻にリマインダー通知。
- 設定で**すべてをカスタマイズ**：ダーク、ブラック（AMOLED）、ライト、自動のテーマ；メインカラーと割増ごとの色（パレットまたは自由な色）；フォント；文字サイズ；角の丸み；密度；アニメーション；時間の表示形式（7 h 30、7h30、7,5 h）；金額を隠す目立たないモード；起動画面；履歴の表示。勤務先ごとにも自由に色を選べます。
- `.json` ファイルへのバックアップ / 復元、アプリの非公開ファイルへの自動バックアップ。
- データはスマホの外に出ません：アカウントなし、サーバーなし、広告なし。

## 計算のしくみ

1 日を 1 分単位に分割します。働いた 1 分ごとに、それが深夜か、日曜か、祝日か、どの残業段階に入るか（月曜から日曜までの週の累計、時系列順）を Fable が判断します。休憩は按分して差し引きます。2 か月にまたがる週は週全体で計算し、そのうえで期間内の日だけを集計します。

- 総支給額 = 時間 × 時給 + 割増
- IFM / 契約終了手当 = 総支給額 × 10%
- ICCP = (総支給額 + IFM) × 10%
- 手取りの見積もり = 総支給額合計 − 社会保険料（デフォルト 22%）+ 食事手当と交通手当

これらはあくまで**見積もり**です。労働協約と給与明細が正式なものになります。

## 開発

```bash
npm install
npm run dev        # ブラウザでインターフェースを起動
npm test           # 計算エンジンのテスト
npm run sync       # Web ビルド + Android プロジェクト（初回は先に "npx cap add android"）
npm run open       # Android Studio でプロジェクトを開く
```

構成：`src/core`（計算、祝日、保存、PDF/Excel 書き出し）、`src/views`（画面）、`src/ui`（コンポーネント）、`scripts/patch-android.mjs`（Android プロジェクトの名前、アイコン、テーマ、署名）、`tests/`（エンジンのテストとインターフェースの操作テスト）。

技術スタック：フレームワークなしの HTML/CSS/JS、[Vite](https://vitejs.dev)、[Capacitor 8](https://capacitorjs.com)、[pdf-lib](https://pdf-lib.js.org)。フォントは Manrope と Unbounded（SIL Open Font License）。
