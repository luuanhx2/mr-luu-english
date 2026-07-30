# Mr Luu English — App luyện Listening (KET / PET / IELTS)

App web luyện nghe cho học sinh, bám sát cấu trúc đề thi thật. Học sinh không cần đăng nhập; kết quả tự động gửi về Google Sheet của giáo viên.

---

## Phần A — Đưa app lên mạng lần đầu (chỉ làm 1 lần)

Bạn cần một tài khoản **GitHub** (miễn phí). Nếu chưa có, vào https://github.com bấm **Sign up**.

### Bước 1 — Tạo kho chứa (repository)
1. Đăng nhập GitHub, bấm dấu **+** góc phải trên → **New repository**.
2. Ô **Repository name**: gõ đúng `mr-luu-english`.
3. Chọn **Public**.
4. Bấm **Create repository**.

> ⚠️ Tên repo phải là `mr-luu-english`. Nếu bạn muốn tên khác, phải sửa dòng `base` trong file `vite.config.js` cho khớp.

### Bước 2 — Tải toàn bộ mã nguồn lên
1. Ở trang repo vừa tạo, bấm **uploading an existing file** (hoặc **Add file → Upload files**).
2. Kéo **tất cả file và thư mục** trong bộ mã nguồn này vào (trừ thư mục `node_modules` và `dist` nếu có).
3. Bấm **Commit changes**.

### Bước 3 — Bật GitHub Pages
1. Trong repo, vào tab **Settings** → mục **Pages** (cột trái).
2. Ở **Build and deployment → Source**, chọn **GitHub Actions**.
3. Xong. GitHub sẽ tự build. Chờ khoảng 1–2 phút.

### Bước 4 — Lấy địa chỉ app
- Địa chỉ app của bạn là: `https://<tên-github-của-bạn>.github.io/mr-luu-english/`
- Ví dụ nếu tài khoản GitHub tên `mrluu` thì địa chỉ là `https://mrluu.github.io/mr-luu-english/`
- Gửi địa chỉ này cho học sinh là các em vào làm bài được.

> Trang Soạn đề (chỉ dành cho bạn) ở địa chỉ: thêm `#/admin` vào cuối, ví dụ
> `https://mrluu.github.io/mr-luu-english/#/admin`

---

## Phần B — Kết nối Google Sheet để nhận điểm
Xem file **HUONG-DAN-GOOGLE-SHEET.md**.

## Phần C — Thêm đề thi mới
Xem file **HUONG-DAN-THEM-DE.md**.

---

## Đổi tên thương hiệu / logo / danh sách lớp
Mở file `src/config.js` (bấm vào file đó trên GitHub → biểu tượng bút chì để sửa).
Chỉ đổi phần chữ trong dấu nháy. Ví dụ đổi danh sách lớp, đổi tên trường, dán link Google Sheet.
Lưu lại (**Commit changes**) là app tự cập nhật sau ~1 phút.

## Chạy thử trên máy tính (không bắt buộc)
Nếu bạn muốn xem trước trên máy mình:
```
npm install
npm run dev
```
Rồi mở địa chỉ hiện ra trong cửa sổ lệnh.
