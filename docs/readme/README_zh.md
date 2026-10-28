<div align="center">

[English](README_en.md) · **简体中文** · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../docs/icon.png" width="96" alt="Fable 图标"></p>

<h1 align="center">Fable</h1>
<p align="center"><b>你的工时、你的税前工资，无需计算器。</b><br>面向法国临时工（intérim）、定期合同（CDD）和无固定期限合同（CDI）的工时记录：分档加班、夜班、周日、法定节假日、餐补、IFM 和带薪假。</p>

<p align="center"><a href="https://github.com/apk-fold/fable/releases/latest/download/fable.apk"><b>⬇️ 下载 APK</b></a> · Android 7 及以上 · 免费、离线、无需账号</p>

<p align="center">
  <img src="../../docs/accueil.png" width="200" alt="首页和打卡">
  <img src="../../docs/historique.png" width="200" alt="历史记录">
  <img src="../../docs/resume.png" width="200" alt="月度汇总">
  <img src="../../docs/mission.png" width="200" alt="任务设置">
</p>

## 安装

1. 在手机上打开上方的**下载 APK** 链接（或最新的 [release](https://github.com/apk-fold/fable/releases/latest)）。
2. 如果 Android 提示，请允许浏览器安装应用，然后安装。
3. 新版本会直接覆盖安装旧版本：签名相同，数据保留。

每次推送到 `main` 的代码变更都会自动重新编译 APK（GitHub Actions）并发布新的 release。

### 签名

签名密钥不在仓库中。GitHub Actions 从 secret **`FABLE_KEYSTORE_B64`** 读取它（base64 编码的 `.jks` 文件，密码 `FABLE_KEYSTORE_PASSWORD` 可选）。如果没有这个 secret，APK 会用临时密钥签名：可以安装，但下一个版本会要求先卸载上一个版本。

## 应用功能

**录入**
- 打卡：*开始*、*暂停*、*结束* —— 当天记录会自动创建（可选按 15 分钟取整）。
- 手动录入：日期、开始 → 结束（支持跨午夜）、休息时间，以及 **+ 加班** 按钮（+15 分钟、+30 分钟、+1 小时）。
- 录入时实时预览计算结果，两天时间重叠时发出提醒。
- 将某一天复制到本周其他日子、复制某一天、逐日强制添加或取消餐补。

**任务**（每个雇主或中介一个），各自有独立规则：
- 合同类型：临时工（intérim）、定期合同（CDD）、无固定期限合同（CDI）、其他 —— 税前时薪、颜色。
- 按周或按天计算**加班**，分 2 档（例如 35 小时起 +25%，43 小时起 +50%）。
- 可调时间段内的**夜班工时**（默认 21 点 → 6 点）及其加成。
- **周日**和**法定节假日**：默认使用**法国本土（巴黎）**日历，或**阿尔萨斯-摩泽尔**日历（+ 耶稣受难日和 12 月 26 日），对所有任务统一设置。
- 加成叠加方式：相加或只取最高；周六到周日的夜班按开始日期计算或逐小时计算。
- 每个工作日或达到一定工时后的**餐补**，以及每天的**交通补贴**。
- **IFM**（临时工任务结束补贴）或**合同结束补贴**（CDD）以及 **ICCP**（带薪假补偿），默认 10% + 10%。
- **工资周期**可为整月或错开（例如 21 日至次月 20 日），并可设置默认工时和休息时间。

**统计**
- 首页：打卡、本周进度及加班阈值进度条、本月合计。
- 按月查看历史记录，可按周分组列表或日历显示，并可按任务筛选。
- 周 / 月 / 年汇总：工时、各档加班、夜班、周日、节假日、出勤天数、图表，以及从税前工资到**估算税后工资**的明细（社保扣除比例可调）。
- **PDF 导出**（可直接发送的工时表）、**Excel .xlsx** 和 **CSV** —— 无需订阅。

**其他**
- 在你选择的日期和时间发送提醒通知。
- **所有内容都可在设置中自定义**：深色、纯黑（AMOLED）、浅色或自动主题；主色和各类加成的颜色（调色板或自由选色）；字体；文字大小；圆角；密度；动画；时长格式（7 h 30、7h30 或 7,5 h）；隐藏金额的隐私模式；启动页面；历史记录视图。每个任务也可自由选色。
- 以 `.json` 文件备份 / 恢复，并在应用私有文件中自动保存一份备份。
- 数据绝不离开手机：无账号、无服务器、无广告。

## 计算方式

每一天都按分钟拆分。对于每一分钟的工作，Fable 都知道它是否落在夜间、周日或法定节假日，以及属于哪一档加班（周一到周日的周累计，按时间顺序）。休息时间按比例扣除。跨两个月的一周会整周计算，然后只统计周期内的日子。

- 税前工资 = 工时 × 时薪 + 各项加成
- IFM / 合同结束补贴 = 税前工资 × 10%
- ICCP = (税前工资 + IFM) × 10%
- 估算税后工资 = 税前总额 − 社保扣除（默认 22%）+ 餐补和交通补贴

这些都是**估算值**：以你的集体协议和工资单为准。

## 开发

```bash
npm install
npm run dev        # 在浏览器中运行界面
npm test           # 计算引擎测试
npm run sync       # Web 构建 + Android 项目（首次需先执行 "npx cap add android"）
npm run open       # 在 Android Studio 中打开项目
```

结构：`src/core`（计算、法定节假日、存储、PDF/Excel 导出）、`src/views`（页面）、`src/ui`（组件）、`scripts/patch-android.mjs`（Android 项目的名称、图标、主题和签名）、`tests/`（引擎测试和界面流程测试）。

技术栈：不使用框架的 HTML/CSS/JS、[Vite](https://vitejs.dev)、[Capacitor 8](https://capacitorjs.com)、[pdf-lib](https://pdf-lib.js.org)。字体 Manrope 和 Unbounded（SIL Open Font License）。
