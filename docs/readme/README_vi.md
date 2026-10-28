<div align="center">

[English](README_en.md) · [简体中文](README_zh.md) · [繁體中文](README_zh-TW.md) · [日本語](README_ja.md) · [한국어](README_ko.md) · [Türkçe](README_tr.md) · [Русский](README_ru.md) · **Tiếng Việt** · [ไทย](README_th.md) · [Deutsch](README_de.md) · [Español](README_es.md) · [Français](../../README.md) · [Українська](README_uk.md) · [Polski](README_pl.md) · [Português (Brasil)](README_pt-BR.md) · [العربية](README_ar.md) · [فارسی](README_fa.md) · [Bahasa Indonesia](README_id.md) · [Italiano](README_it.md)
· [Ελληνικά](README_el.md) · [മലയാളം](README_ml.md) · [Roman Urdu](README_ur-Latn.md) · [Română](README_ro.md)

</div>

<p align="center"><img src="../../docs/icon.png" width="96" alt="Biểu tượng Fable"></p>

<h1 align="center">Fable</h1>
<p align="center"><b>Giờ làm và lương gộp của bạn, không cần máy tính.</b><br>Theo dõi giờ làm cho các loại hợp đồng tại Pháp: làm thời vụ qua agency (intérim), có thời hạn (CDD) và không thời hạn (CDI): tăng ca theo bậc, ca đêm, Chủ nhật, ngày lễ, phụ cấp ăn, IFM và nghỉ phép có lương.</p>

<p align="center"><a href="https://github.com/apk-fold/fable/releases/latest/download/fable.apk"><b>⬇️ Tải APK</b></a> · Android 7 trở lên · miễn phí, ngoại tuyến, không cần tài khoản</p>

<p align="center">
  <img src="../../docs/accueil.png" width="200" alt="Màn hình chính và máy chấm công">
  <img src="../../docs/historique.png" width="200" alt="Lịch sử">
  <img src="../../docs/resume.png" width="200" alt="Tổng kết tháng">
  <img src="../../docs/mission.png" width="200" alt="Cài đặt nơi làm việc">
</p>

## Cài đặt

1. Trên điện thoại, mở liên kết **Tải APK** ở trên (hoặc [release](https://github.com/apk-fold/fable/releases/latest) mới nhất).
2. Cho phép cài đặt từ trình duyệt nếu Android yêu cầu, rồi cài đặt.
3. Các phiên bản mới cài đè lên bản cũ: cùng chữ ký, dữ liệu được giữ nguyên.

Mỗi thay đổi mã nguồn được đẩy lên `main` sẽ tự động biên dịch lại APK (GitHub Actions) và phát hành một release mới.

### Chữ ký

Khóa ký không nằm trong kho mã. GitHub Actions đọc nó từ secret **`FABLE_KEYSTORE_B64`** (tệp `.jks` mã hóa base64, mật khẩu `FABLE_KEYSTORE_PASSWORD` không bắt buộc). Nếu không có secret này, APK được ký bằng khóa tạm thời: vẫn cài được, nhưng phiên bản sau sẽ yêu cầu gỡ bản trước.

## Ứng dụng làm được gì

**Nhập liệu**
- Máy chấm công: *Bắt đầu*, *Nghỉ*, *Kết thúc* — ngày làm việc tự được tạo (tùy chọn làm tròn đến 15 phút).
- Nhập tay: ngày, bắt đầu → kết thúc (hỗ trợ ca qua nửa đêm), giờ nghỉ, các nút **+ Tăng ca** (+15 phút, +30 phút, +1 giờ).
- Xem trước kết quả tính ngay khi nhập, cảnh báo nếu hai ngày bị chồng lên nhau.
- Lặp lại một ngày sang các ngày khác trong tuần, nhân bản một ngày, bật hoặc tắt phụ cấp ăn cho từng ngày.

**Nơi làm việc** (mỗi chủ lao động hoặc agency một mục), mỗi nơi có quy tắc riêng:
- Loại hợp đồng: Thời vụ (intérim), Có thời hạn (CDD), Không thời hạn (CDI), Khác — lương giờ gộp, màu sắc.
- **Tăng ca** theo tuần hoặc theo ngày, 2 bậc (ví dụ +25% từ 35 giờ, +50% từ 43 giờ).
- **Giờ làm đêm** trong khoảng tùy chỉnh (mặc định 21 giờ → 6 giờ) với mức phụ cấp riêng.
- **Chủ nhật** và **ngày lễ**: mặc định theo lịch **Pháp lục địa (Paris)**, hoặc **Alsace-Moselle** (+ Thứ Sáu Tuần Thánh và ngày 26 tháng 12), áp dụng cho mọi nơi làm việc.
- Cộng dồn phụ cấp: cộng lại hoặc chỉ lấy mức cao nhất; đêm từ thứ Bảy sang Chủ nhật tính theo ngày bắt đầu hoặc theo từng giờ.
- **Phụ cấp ăn** mỗi ngày làm việc hoặc từ một số giờ nhất định, **phụ cấp đi lại** theo ngày.
- **IFM** (trợ cấp kết thúc nhiệm vụ thời vụ) hoặc **trợ cấp kết thúc hợp đồng** (CDD) và **ICCP** (trợ cấp nghỉ phép), mặc định 10% + 10%.
- **Kỳ lương** trọn tháng hoặc lệch (ví dụ từ ngày 21 đến ngày 20), giờ làm và giờ nghỉ mặc định.

**Theo dõi**
- Màn hình chính: máy chấm công, tuần hiện tại với thanh đo ngưỡng tăng ca, tổng của tháng.
- Lịch sử theo tháng, dạng danh sách nhóm theo tuần hoặc dạng lịch, lọc theo nơi làm việc.
- Tổng kết tuần / tháng / năm: số giờ, tăng ca theo bậc, ca đêm, Chủ nhật, ngày lễ, số ngày đã làm, biểu đồ, chi tiết từ lương gộp đến **lương thực nhận ước tính** (tỷ lệ khấu trừ tùy chỉnh).
- **Xuất PDF** (bảng chấm công sẵn sàng gửi), **Excel .xlsx** và **CSV** — không cần đăng ký trả phí.

**Phần còn lại**
- Nhắc nhở bằng thông báo vào những ngày và giờ bạn chọn.
- **Mọi thứ đều tùy chỉnh được** trong Cài đặt: giao diện tối, đen (AMOLED), sáng hoặc tự động; màu chính và màu các loại phụ cấp (bảng màu hoặc màu tự do); phông chữ; cỡ chữ; bo góc; mật độ; hiệu ứng; định dạng thời lượng (7 h 30, 7h30 hoặc 7,5 h); chế độ kín đáo ẩn số tiền; màn hình mở đầu; kiểu xem lịch sử. Màu tự do cho từng nơi làm việc.
- Sao lưu / khôi phục bằng tệp `.json`, bản sao dự phòng tự động trong tệp riêng của ứng dụng.
- Không dữ liệu nào rời khỏi điện thoại: không tài khoản, không máy chủ, không quảng cáo.

## Cách tính

Mỗi ngày được chia theo từng phút. Với mỗi phút làm việc, Fable biết nó rơi vào ban đêm, Chủ nhật hay ngày lễ, và thuộc bậc tăng ca nào (tổng theo tuần từ thứ Hai đến Chủ nhật, theo thứ tự thời gian). Giờ nghỉ được trừ theo tỷ lệ. Một tuần nằm vắt qua hai tháng được tính trọn tuần, sau đó chỉ những ngày trong kỳ mới được tính.

- Lương gộp = số giờ × đơn giá + phụ cấp
- IFM / trợ cấp kết thúc hợp đồng = lương gộp × 10%
- ICCP = (lương gộp + IFM) × 10%
- Thực nhận ước tính = tổng lương gộp − khấu trừ (mặc định 22%) + phụ cấp ăn và đi lại

Đây chỉ là **ước tính**: thỏa ước lao động tập thể và phiếu lương của bạn mới là căn cứ chính thức.

## Phát triển

```bash
npm install
npm run dev        # giao diện trong trình duyệt
npm test           # kiểm thử bộ máy tính toán
npm run sync       # build web + dự án Android (lần đầu sau « npx cap add android »)
npm run open       # mở dự án trong Android Studio
```

Cấu trúc: `src/core` (tính toán, ngày lễ, lưu trữ, xuất PDF/Excel), `src/views` (màn hình), `src/ui` (thành phần giao diện), `scripts/patch-android.mjs` (tên, biểu tượng, giao diện và chữ ký của dự án Android), `tests/` (kiểm thử bộ máy và kịch bản giao diện).

Công nghệ: HTML/CSS/JS không dùng framework, [Vite](https://vitejs.dev), [Capacitor 8](https://capacitorjs.com), [pdf-lib](https://pdf-lib.js.org). Phông chữ Manrope và Unbounded (SIL Open Font License).
