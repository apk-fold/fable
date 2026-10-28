<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · **繁體中文** · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../docs/icon.png" width="96" alt="Fable 圖示"></p>

<h1 align="center">Fable</h1>
<p align="center"><b>你的工時、你的稅前薪資，不用計算機。</b><br>適用於法國派遣工（intérim）、定期契約（CDD）與不定期契約（CDI）的工時記錄：分級加班、夜班、週日、國定假日、餐費補貼、IFM 與特休。</p>

<p align="center"><a href="https://github.com/apk-fold/fable/releases/latest/download/fable.apk"><b>⬇️ 下載 APK</b></a> · Android 7 以上 · 免費、離線、免帳號</p>

<p align="center">
  <img src="../../docs/accueil.png" width="200" alt="首頁與打卡鐘">
  <img src="../../docs/historique.png" width="200" alt="歷史紀錄">
  <img src="../../docs/resume.png" width="200" alt="每月摘要">
  <img src="../../docs/mission.png" width="200" alt="任務設定">
</p>

## 安裝

1. 在手機上開啟上方的**下載 APK** 連結（或最新的 [release](https://github.com/apk-fold/fable/releases/latest)）。
2. 若 Android 要求，請允許從瀏覽器安裝，然後進行安裝。
3. 新版本會直接覆蓋安裝舊版本：簽署相同，資料保留。

每次推送到 `main` 的程式碼變更都會自動重新編譯 APK（GitHub Actions）並發佈新的 release。

### 簽署

簽署金鑰不在儲存庫中。GitHub Actions 從 secret **`FABLE_KEYSTORE_B64`** 讀取它（以 base64 編碼的 `.jks` 檔案，密碼 `FABLE_KEYSTORE_PASSWORD` 可選）。若沒有這個 secret，APK 會以臨時金鑰簽署：可以安裝，但下一個版本會要求先解除安裝上一版。

## App 的功能

**輸入**
- 打卡鐘：*開始*、*休息*、*結束* —— 當天紀錄會自動建立（可選擇以 15 分鐘為單位取整）。
- 手動輸入：日期、開始 → 結束（支援跨午夜）、休息時間，以及 **+ 加班** 按鈕（+15 分鐘、+30 分鐘、+1 小時）。
- 輸入時即時預覽計算結果，兩天時間重疊時會提醒。
- 將某天套用到本週其他日子、複製某天、逐日強制加上或取消餐費補貼。

**任務**（每個雇主或派遣公司一個），各有自己的規則：
- 契約類型：派遣（intérim）、定期（CDD）、不定期（CDI）、其他 —— 稅前時薪、顏色。
- 依週或依日計算**加班**，分 2 級（例如滿 35 小時 +25%，滿 43 小時 +50%）。
- 可調整時段的**夜班時數**（預設 21 點 → 6 點）及其加成。
- **週日**與**國定假日**：預設使用**法國本土（巴黎）**行事曆，或**亞爾薩斯-摩澤爾**行事曆（+ 耶穌受難日與 12 月 26 日），可統一套用至所有任務。
- 加成的累計方式：相加或只取最高；週六到週日的夜班依開始日或逐小時計算。
- 每個工作日或達一定時數後的**餐費補貼**，以及每日**交通補貼**。
- **IFM**（派遣任務結束補償）或**契約結束獎金**（CDD）以及 **ICCP**（特休補償），預設 10% + 10%。
- **薪資週期**可為整月或錯開（例如 21 日至次月 20 日），並可設定預設工時與休息時間。

**追蹤**
- 首頁：打卡鐘、本週進度及加班門檻量表、本月合計。
- 依月份查看歷史紀錄，可依週分組的清單或月曆顯示，並可依任務篩選。
- 週 / 月 / 年摘要：工時、各級加班、夜班、週日、假日、出勤天數、圖表，以及從稅前薪資到**估算實領**的明細（扣繳比例可調）。
- **PDF 匯出**（可直接寄出的工時表）、**Excel .xlsx** 與 **CSV** —— 無需訂閱。

**其他**
- 在你選擇的日子與時間發送提醒通知。
- **一切都能在設定中自訂**：深色、純黑（AMOLED）、淺色或自動主題；主色與各項加成的顏色（調色盤或自由選色）；字型；文字大小；圓角；密度；動畫；時間長度格式（7 h 30、7h30 或 7,5 h）；隱藏金額的低調模式；啟動畫面；歷史紀錄檢視。每個任務也能自由選色。
- 以 `.json` 檔案備份 / 還原，並在 App 的私人檔案中自動保留一份備份。
- 資料絕不離開手機：無帳號、無伺服器、無廣告。

## 計算方式

每一天都以分鐘為單位切分。對每一分鐘的工作，Fable 都知道它是否落在夜間、週日或國定假日，以及屬於哪一級加班（週一到週日的每週累計，依時間順序）。休息時間按比例扣除。橫跨兩個月的一週會整週計算，再只計入週期內的日子。

- 稅前薪資 = 工時 × 時薪 + 各項加成
- IFM / 契約結束獎金 = 稅前薪資 × 10%
- ICCP = (稅前薪資 + IFM) × 10%
- 估算實領 = 稅前總額 − 扣繳（預設 22%）+ 餐費與交通補貼

這些都是**估算值**：一切以你的團體協約與薪資單為準。

## 開發

```bash
npm install
npm run dev        # 在瀏覽器中執行介面
npm test           # 計算引擎測試
npm run sync       # Web 建置 + Android 專案（第一次需先執行 "npx cap add android"）
npm run open       # 在 Android Studio 中開啟專案
```

結構：`src/core`（計算、國定假日、儲存、PDF/Excel 匯出）、`src/views`（畫面）、`src/ui`（元件）、`scripts/patch-android.mjs`（Android 專案的名稱、圖示、主題與簽署）、`tests/`（引擎測試與介面流程測試）。

技術：不使用框架的 HTML/CSS/JS、[Vite](https://vitejs.dev)、[Capacitor 8](https://capacitorjs.com)、[pdf-lib](https://pdf-lib.js.org)。字型 Manrope 與 Unbounded（SIL Open Font License）。
