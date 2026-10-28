<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · **Bahasa Indonesia** · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../docs/icon.png" width="96" alt="Ikon Fable"></p>

<h1 align="center">Fable</h1>
<p align="center"><b>Jam kerjamu, gaji kotormu, tanpa kalkulator.</b><br>Pencatat jam kerja untuk kontrak kerja di Prancis: kerja sementara lewat agensi (intérim), kontrak waktu tertentu (CDD), dan kontrak tetap (CDI): lembur bertingkat, malam, Minggu, hari libur, tunjangan makan, IFM, dan cuti berbayar.</p>

<p align="center"><a href="https://github.com/apk-fold/fable/releases/latest/download/fable.apk"><b>⬇️ Unduh APK</b></a> · Android 7 ke atas · gratis, offline, tanpa akun</p>

<p align="center">
  <img src="../../docs/accueil.png" width="200" alt="Beranda dan mesin absen">
  <img src="../../docs/historique.png" width="200" alt="Riwayat">
  <img src="../../docs/resume.png" width="200" alt="Ringkasan bulan">
  <img src="../../docs/mission.png" width="200" alt="Pengaturan penugasan">
</p>

## Instalasi

1. Di ponsel, buka tautan **Unduh APK** di atas (atau [release](https://github.com/apk-fold/fable/releases/latest) terbaru).
2. Izinkan instalasi dari browser jika Android memintanya, lalu instal.
3. Versi baru terpasang di atas versi lama: tanda tangan sama, data tetap aman.

Setiap perubahan kode yang di-push ke `main` mengompilasi ulang APK secara otomatis (GitHub Actions) dan menerbitkan release baru.

### Tanda tangan

Kunci tanda tangan tidak ada di repositori. GitHub Actions membacanya dari secret **`FABLE_KEYSTORE_B64`** (file `.jks` yang dienkode base64, kata sandi `FABLE_KEYSTORE_PASSWORD` opsional). Tanpa secret ini, APK ditandatangani dengan kunci sementara: tetap bisa dipasang, tetapi versi berikutnya akan meminta mencopot versi sebelumnya.

## Apa yang dilakukan aplikasi ini

**Pencatatan**
- Mesin absen: *Mulai*, *Istirahat*, *Selesai* — hari kerja dibuat otomatis (pembulatan ke seperempat jam opsional).
- Input manual: tanggal, mulai → selesai (sif yang melewati tengah malam didukung), istirahat, tombol **+ Lembur** (+15 mnt, +30 mnt, +1 jam).
- Pratinjau perhitungan langsung saat mengetik, peringatan jika dua hari tumpang tindih.
- Ulangi satu hari ke hari lain dalam minggu, duplikat satu hari, paksa atau hapus tunjangan makan per kasus.

**Penugasan** (satu per pemberi kerja atau agensi), masing-masing dengan aturannya sendiri:
- Jenis kontrak: Sementara (intérim), Waktu tertentu (CDD), Tetap (CDI), Lainnya — tarif per jam kotor, warna.
- **Lembur** per minggu atau per hari, dengan 2 tingkat (mis. +25% mulai 35 jam, +50% mulai 43 jam).
- **Jam malam** dalam rentang yang bisa diatur (bawaan 21.00 → 06.00) dengan tambahannya sendiri.
- **Hari Minggu** dan **hari libur nasional**: kalender **Prancis daratan (Paris)** secara bawaan, atau **Alsace-Moselle** (+ Jumat Agung dan 26 Desember), diatur untuk semua penugasan.
- Penggabungan tambahan: dijumlahkan atau hanya yang tertinggi; malam Sabtu ke Minggu dihitung berdasarkan hari mulai atau per jam.
- **Tunjangan makan** setiap hari kerja atau mulai dari jumlah jam tertentu, **tunjangan transport** per hari.
- **IFM** (kompensasi akhir penugasan kerja sementara) atau **bonus kontrak berakhir** (CDD) dan **ICCP** (kompensasi cuti berbayar), bawaan 10% + 10%.
- **Periode gaji** satu bulan penuh atau digeser (mis. tanggal 21 sampai 20), jam dan istirahat bawaan.

**Pemantauan**
- Beranda: mesin absen, minggu berjalan dengan indikator ambang lembur, total bulan.
- Riwayat per bulan, sebagai daftar yang dikelompokkan per minggu atau sebagai kalender, filter per penugasan.
- Ringkasan minggu / bulan / tahun: jam, lembur per tingkat, malam, Minggu, hari libur, hari kerja, grafik, rincian dari gaji kotor hingga **gaji bersih perkiraan** (tarif potongan bisa diatur).
- **Ekspor PDF** (lembar jam kerja siap kirim), **Excel .xlsx**, dan **CSV** — tanpa langganan.

**Lainnya**
- Pengingat lewat notifikasi pada hari dan jam pilihanmu.
- **Semua bisa dipersonalisasi** di Pengaturan: tema gelap, hitam (AMOLED), terang, atau otomatis; warna utama dan warna tambahan (palet atau warna bebas); font; ukuran teks; sudut; kepadatan; animasi; format durasi (7 h 30, 7h30, atau 7,5 h); mode samar yang menyembunyikan nominal; layar pembuka; tampilan riwayat. Warna bebas juga untuk setiap penugasan.
- Cadangkan / pulihkan ke file `.json`, salinan cadangan otomatis di file privat aplikasi.
- Tidak ada data yang keluar dari ponsel: tanpa akun, tanpa server, tanpa iklan.

## Cara menghitungnya

Setiap hari dibagi menit demi menit. Untuk setiap menit kerja, Fable tahu apakah menit itu jatuh di malam hari, hari Minggu, atau hari libur, dan masuk ke tingkat lembur yang mana (total mingguan dari Senin sampai Minggu, sesuai urutan waktu). Istirahat dipotong secara proporsional. Minggu yang melintasi dua bulan dihitung utuh, lalu hanya hari-hari dalam periode yang dihitung.

- Gaji kotor = jam × tarif + tambahan
- IFM / bonus kontrak berakhir = kotor × 10%
- ICCP = (kotor + IFM) × 10%
- Bersih perkiraan = total kotor − potongan (bawaan 22%) + tunjangan makan dan transport

Ini adalah **perkiraan**: yang berlaku adalah perjanjian kerja bersama dan slip gajimu.

## Pengembangan

```bash
npm install
npm run dev        # antarmuka di browser
npm test           # tes mesin perhitungan
npm run sync       # build web + proyek Android (setelah "npx cap add android" pertama kali)
npm run open       # membuka proyek di Android Studio
```

Struktur: `src/core` (perhitungan, hari libur, penyimpanan, ekspor PDF/Excel), `src/views` (layar), `src/ui` (komponen), `scripts/patch-android.mjs` (nama, ikon, tema, dan tanda tangan proyek Android), `tests/` (tes mesin dan alur antarmuka).

Teknologi: HTML/CSS/JS tanpa framework, [Vite](https://vitejs.dev), [Capacitor 8](https://capacitorjs.com), [pdf-lib](https://pdf-lib.js.org). Font Manrope dan Unbounded (SIL Open Font License).
