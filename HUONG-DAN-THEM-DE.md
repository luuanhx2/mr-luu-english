# Cách thêm một đề thi mới (không cần biết code)

Có **2 cách**. Cách 1 dễ nhất, khuyên dùng.

---

## CÁCH 1 — Dùng trang Soạn đề (khuyên dùng)

### Bước 1 — Chuẩn bị file audio
- Tách audio thành từng Part (Part 1.mp3, Part 2.mp3, ...).
- Nên nén ở mức 128kbps cho nhẹ (không bắt buộc).

### Bước 2 — Tải audio lên GitHub
1. Vào repo trên GitHub → mở thư mục `public/audio/ket/` (hoặc `pet`, `ielts` tuỳ cấp độ).
2. Bấm **Add file → Upload files** → kéo các file mp3 vào → **Commit changes**.
3. Ghi nhớ đường dẫn mỗi file, ví dụ: `audio/ket/ket-test2-part1.mp3`.
   > Nếu đề có câu **chọn tranh** (KET Part 1): tải ảnh vào `public/images/ket/` tương tự, ghi nhớ đường dẫn ví dụ `images/ket/ket-test2-q1.jpeg`.

### Bước 3 — Soạn đề bằng form
1. Mở trang Soạn đề: địa chỉ app + `#/admin`
   (ví dụ `https://tênbạn.github.io/mr-luu-english/#/admin`).
2. Nhập mật khẩu (mặc định `mrluu2024`, đổi được trong `src/config.js`).
3. Chọn **Cấp độ**, gõ **Tên đề** (Test 2...), điền **Thời gian**.
4. Với mỗi Part: dán **đường dẫn audio** (ở Bước 2), chọn số lần nghe.
5. Bấm **+ Thêm câu hỏi**, chọn loại câu, nhập nội dung + **đáp án đúng**.
   - Nhiều đáp án đúng thì ngăn bằng dấu `|`, ví dụ `Thursday|Thursdays`.
6. Bấm **Kiểm tra đề**. Nếu báo thiếu gì, sửa cho hết lỗi.
7. Bấm nút xanh **⬇ Tải file đề (.json)** → máy tải về một file, ví dụ `ket-test-2.json`.

### Bước 4 — Tải file đề lên GitHub
1. Vào repo → mở thư mục `public/data/ket/` (đúng cấp độ).
2. **Add file → Upload files** → kéo file `ket-test-2.json` vào → **Commit changes**.

### Bước 5 — Thêm đề vào danh sách
1. Vào repo → mở file `public/data/tests-index.json` → bấm **bút chì** để sửa.
2. Thêm một khối mới vào trong `"tests": [ ... ]`, **nhớ dấu phẩy** ngăn cách:
   ```json
   {
     "id": "ket-test-2",
     "level": "KET",
     "title": "Test 2",
     "examLabel": "A2 Key · Listening",
     "file": "data/ket/ket-test-2.json"
   }
   ```
3. **Commit changes**. Chờ ~1 phút — đề mới xuất hiện trên app.

> Mẹo: mở file `ket-test-2.json` bạn vừa tạo, ở đầu file có sẵn `id`, `level`, `title` — chép đúng các giá trị đó vào khối trên là chắc chắn khớp.

---

## CÁCH 2 — Copy đề cũ rồi sửa
Nếu ngại dùng form, bạn có thể:
1. Vào `public/data/ket/`, mở `ket-test-1.json`, copy nội dung.
2. Tạo file mới `ket-test-2.json`, dán vào, sửa các câu hỏi/đáp án/đường dẫn audio.
3. Làm tiếp **Bước 5** ở Cách 1 để thêm vào danh sách.

---

## Sửa hoặc xoá đề đã có
- **Sửa**: mở file `.json` của đề đó trên GitHub, bấm bút chì, sửa, Commit.
- **Xoá**: xoá file `.json` đó **và** xoá khối tương ứng trong `tests-index.json`.

## Các loại câu hỏi hỗ trợ
| Loại | Dùng cho |
|---|---|
| Chọn tranh (A/B/C) | KET Part 1 (ảnh dải ngang 3 lựa chọn) |
| Trắc nghiệm chữ (A/B/C) | KET Part 3–4, PET, IELTS |
| Điền từ / số | KET Part 2, điền form/bảng |
| Nối đáp án | KET Part 5, matching PET/IELTS |
| True/False/Not given | IELTS |
| Yes/No/Not given | IELTS |
