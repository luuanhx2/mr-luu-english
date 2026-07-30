# Hướng dẫn kết nối Google Sheet để nhận điểm

Làm theo các bước này **một lần duy nhất**. Sau đó mọi bài học sinh nộp sẽ tự động thêm một dòng vào Google Sheet của bạn.

---

## Bước 1 — Tạo Google Sheet mới
1. Vào https://sheets.google.com → tạo một trang tính trống.
2. Đặt tên tuỳ ý, ví dụ *"Kết quả Listening"*.

## Bước 2 — Mở trình soạn Apps Script
1. Trên Google Sheet, bấm menu **Tiện ích mở rộng (Extensions)** → **Apps Script**.
2. Một tab mới mở ra, có sẵn một ô code trống (`function myFunction() {}`).

## Bước 3 — Dán code
1. Xoá hết nội dung có sẵn trong ô code.
2. Mở file **google-apps-script.js** trong bộ mã nguồn, copy **toàn bộ**.
3. Dán vào ô code trên Apps Script.
4. Bấm biểu tượng **đĩa mềm (Lưu)**.

## Bước 4 — Triển khai (Deploy) thành Web App
1. Bấm nút xanh **Triển khai (Deploy)** góc phải trên → **Bản triển khai mới (New deployment)**.
2. Bấm biểu tượng bánh răng ⚙ bên cạnh "Chọn loại" → chọn **Ứng dụng web (Web app)**.
3. Điền:
   - **Mô tả**: gõ gì cũng được, ví dụ "Nhận điểm".
   - **Thực thi với tư cách (Execute as)**: **Tôi (Me)**.
   - **Ai có quyền truy cập (Who has access)**: chọn **Bất kỳ ai (Anyone)**.
     > Bắt buộc chọn "Anyone" thì app học sinh mới gửi được. Yên tâm: người khác chỉ *gửi thêm dòng*, không xem được nội dung Sheet.
4. Bấm **Triển khai (Deploy)**.
5. Google sẽ hỏi cấp quyền → bấm **Cho phép (Authorize)** → chọn tài khoản của bạn → nếu hiện cảnh báo "chưa xác minh", bấm **Nâng cao (Advanced)** → **Đi tới ... (không an toàn)** → **Cho phép**. (Đây là script của chính bạn nên an toàn.)

## Bước 5 — Copy đường link Web App
1. Sau khi deploy xong, Google hiện một đường link dài dạng:
   `https://script.google.com/macros/s/AKfy....../exec`
2. Bấm **Sao chép (Copy)** đường link đó.

## Bước 6 — Dán link vào app
1. Trên GitHub, mở file `src/config.js` → bấm biểu tượng **bút chì** để sửa.
2. Tìm dòng:
   ```
   googleSheetUrl: '',
   ```
3. Dán link vào giữa hai dấu nháy:
   ```
   googleSheetUrl: 'https://script.google.com/macros/s/AKfy....../exec',
   ```
4. Bấm **Commit changes**. Chờ ~1 phút để app cập nhật.

## Xong!
Cho một học sinh làm thử một đề và nộp. Mở Google Sheet — bạn sẽ thấy một dòng mới xuất hiện với đầy đủ: họ tên, lớp, cấp độ, tên đề, điểm, thời gian, chi tiết đáp án.

---

### Nếu muốn sửa code Apps Script sau này
Mỗi lần sửa code, phải **Triển khai (Deploy) → Quản lý bản triển khai → sửa (bút chì) → Phiên bản mới → Deploy** để thay đổi có hiệu lực. Link Web App vẫn giữ nguyên nên không cần dán lại vào app.

### Kết quả bị lỗi không về Sheet?
- Kiểm tra lại "Who has access" đã là **Anyone** chưa.
- Mở thử link `.../exec` trên trình duyệt — nếu thấy dòng chữ "script đang hoạt động" là script còn sống.
- Kiểm tra đã dán đúng link (kết thúc bằng `/exec`, không phải `/dev`).
