<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · **Türkçe** · [Русский](README_ru.md) · [Tiếng Việt](README_vi.md) · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../docs/icon.png" width="96" alt="Fable simgesi"></p>

<h1 align="center">Fable</h1>
<p align="center"><b>Saatlerin, brüt maaşın, hesap makinesi olmadan.</b><br>Fransa'daki geçici iş (intérim), belirli süreli (CDD) ve belirsiz süreli (CDI) sözleşmeler için çalışma saati takibi: kademeli fazla mesai, gece, pazar, resmî tatiller, yemek ödeneği, IFM ve ücretli izin.</p>

<p align="center"><a href="https://github.com/apk-fold/fable/releases/latest/download/fable.apk"><b>⬇️ APK'yı indir</b></a> · Android 7 ve üstü · ücretsiz, çevrimdışı, hesap gerektirmez</p>

<p align="center">
  <img src="../../docs/accueil.png" width="200" alt="Ana ekran ve puantaj saati">
  <img src="../../docs/historique.png" width="200" alt="Geçmiş">
  <img src="../../docs/resume.png" width="200" alt="Aylık özet">
  <img src="../../docs/mission.png" width="200" alt="Görev ayarları">
</p>

## Kurulum

1. Telefonunda yukarıdaki **APK'yı indir** bağlantısını (ya da en son [release](https://github.com/apk-fold/fable/releases/latest) sürümünü) aç.
2. Android isterse tarayıcından yüklemeye izin ver, sonra yükle.
3. Yeni sürümler eskisinin üzerine kurulur: imza aynı, veriler korunur.

`main` dalına gönderilen her kod değişikliği APK'yı otomatik olarak yeniden derler (GitHub Actions) ve yeni bir release yayımlar.

### İmza

İmza anahtarı depoda değildir. GitHub Actions onu **`FABLE_KEYSTORE_B64`** gizli değerinden okur (base64 ile kodlanmış `.jks` dosyası, `FABLE_KEYSTORE_PASSWORD` parolası isteğe bağlı). Bu gizli değer yoksa APK geçici bir anahtarla imzalanır: kurulur, ama bir sonraki sürüm öncekini kaldırmanı ister.

## Uygulama neler yapar

**Giriş**
- Puantaj saati: *Başlat*, *Mola*, *Bitir* — gün kendiliğinden oluşturulur (isteğe bağlı çeyrek saate yuvarlama).
- Elle giriş: tarih, başlangıç → bitiş (gece yarısını geçen vardiyalar desteklenir), mola, **+ Fazla mesai** düğmeleri (+15 dk, +30 dk, +1 sa).
- Giriş sırasında hesabın canlı önizlemesi, iki gün çakışırsa uyarı.
- Bir günü haftanın diğer günlerine tekrarlama, bir günü çoğaltma, yemek ödeneğini gün gün zorla ekleme ya da kaldırma.

**Görevler** (her işveren veya ajans için bir tane), her birinin kendi kuralları:
- Sözleşme türü: Geçici (intérim), Belirli süreli (CDD), Belirsiz süreli (CDI), Diğer — brüt saat ücreti, renk.
- Haftalık veya günlük **fazla mesai**, 2 kademe (ör. 35 saatten itibaren +%25, 43 saatten itibaren +%50).
- Ayarlanabilir bir aralıkta **gece saatleri** (varsayılan 21:00 → 06:00) ve kendi zammı.
- **Pazar** ve **resmî tatiller**: varsayılan olarak **Fransa anakarası (Paris)** takvimi ya da **Alsace-Moselle** (+ Kutsal Cuma ve 26 Aralık), tüm görevler için ayarlanır.
- Zamların birleşmesi: toplanır ya da yalnızca en yükseği; cumartesiden pazara geçen geceler başlangıç gününe göre ya da saat saat hesaplanır.
- Her çalışılan gün ya da belirli bir saat sayısından sonra **yemek ödeneği**, günlük **yol ödeneği**.
- **IFM** (geçici işte görev sonu tazminatı) ya da **sözleşme sonu primi** (CDD) ve **ICCP** (ücretli izin tazminatı), varsayılan %10 + %10.
- Tam ay ya da kaydırılmış **ücret dönemi** (ör. 21'inden 20'sine), varsayılan saatler ve mola.

**Takip**
- Ana ekran: puantaj saati, fazla mesai eşiği göstergeli içinde bulunulan hafta, ay toplamları.
- Aylara göre geçmiş, haftalara göre gruplanmış liste ya da takvim olarak, göreve göre filtre.
- Hafta / ay / yıl özeti: saatler, kademelere göre fazla mesai, gece, pazar, tatiller, çalışılan günler, grafik, brütten **tahmini nete** kadar döküm (ayarlanabilir kesinti oranı).
- **PDF dışa aktarma** (göndermeye hazır puantaj cetveli), **Excel .xlsx** ve **CSV** — abonelik yok.

**Gerisi**
- Seçtiğin günlerde ve saatte bildirimle hatırlatma.
- Ayarlar'da **her şey kişiselleştirilebilir**: koyu, siyah (AMOLED), açık ya da otomatik tema; ana renk ve zam renkleri (palet ya da serbest renk); yazı tipleri; metin boyutu; köşeler; yoğunluk; animasyonlar; süre biçimi (7 h 30, 7h30 ya da 7,5 h); tutarları gizleyen gizli mod; açılış ekranı; geçmiş görünümü. Her görev için de serbest renk.
- `.json` dosyasına yedekleme / geri yükleme, uygulamanın özel dosyalarında otomatik yedek kopya.
- Hiçbir veri telefondan çıkmaz: hesap yok, sunucu yok, reklam yok.

## Nasıl hesaplanır

Her gün dakika dakika bölünür. Çalışılan her dakika için Fable onun gece mi, pazar mı, resmî tatil mi olduğunu ve hangi fazla mesai kademesine düştüğünü bilir (pazartesiden pazara haftalık toplam, kronolojik sırayla). Mola orantılı olarak düşülür. İki aya yayılan bir hafta bütün olarak hesaplanır, sonra yalnızca dönem içindeki günler sayılır.

- Brüt maaş = saat × ücret + zamlar
- IFM / sözleşme sonu primi = brüt × %10
- ICCP = (brüt + IFM) × %10
- Tahmini net = toplam brüt − kesintiler (varsayılan %22) + yemek ve yol ödenekleri

Bunlar **tahminlerdir**: toplu iş sözleşmen ve maaş bordron esastır.

## Geliştirme

```bash
npm install
npm run dev        # arayüz tarayıcıda
npm test           # hesap motoru testleri
npm run sync       # web derlemesi + Android projesi (ilk seferde « npx cap add android » sonrası)
npm run open       # projeyi Android Studio'da açar
```

Yapı: `src/core` (hesaplar, resmî tatiller, depolama, PDF/Excel dışa aktarımları), `src/views` (ekranlar), `src/ui` (bileşenler), `scripts/patch-android.mjs` (Android projesinin adı, simgeleri, teması ve imzası), `tests/` (motor testleri ve arayüz senaryoları).

Teknoloji: çatısız HTML/CSS/JS, [Vite](https://vitejs.dev), [Capacitor 8](https://capacitorjs.com), [pdf-lib](https://pdf-lib.js.org). Manrope ve Unbounded yazı tipleri (SIL Open Font License).
