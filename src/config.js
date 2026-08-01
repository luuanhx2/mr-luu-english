// ============================================================================
//  FILE CẤU HÌNH CHÍNH  —  DÀNH CHO GIÁO VIÊN (KHÔNG CẦN BIẾT CODE)
// ----------------------------------------------------------------------------
//  Đây là file DUY NHẤT bạn cần chỉnh khi muốn thay đổi:
//   • Tên thương hiệu / logo
//   • Danh sách LỚP cho học sinh chọn
//   • Địa chỉ Google Sheet để nhận kết quả
//   • Mật khẩu trang Soạn đề (Admin)
//
//  Cách sửa: chỉ đổi phần chữ nằm GIỮA HAI DẤU NHÁY '...'.
//  Không xoá dấu phẩy, dấu ngoặc. Sau khi sửa, lưu lại là xong.
// ============================================================================

export const CONFIG = {

  // --- 1. THƯƠNG HIỆU (hiển thị ở header và màn hình chào) ---------------
  brand: {
    logoText: 'M1',                 // Chữ trong logo tròn (2 ký tự đẹp nhất)
    nameLine1White: 'MR LUU',       // Phần tên màu trắng/đen
    nameLine1Gold: 'ENGLISH',       // Phần tên màu vàng gold
    subtitle: 'CAMBRIDGE ENGLISH PRACTICE',  // Dòng phụ nhỏ bên dưới
  },

  // --- 2. DANH SÁCH LỚP (học sinh BẮT BUỘC chọn từ đây, không gõ tự do) --
  //  Muốn thêm lớp: thêm một dòng 'Tên lớp', (nhớ dấu phẩy cuối).
  //  Muốn xoá lớp: xoá cả dòng đó.
  classList: [
    'KET 1',
    'KET 2',
    'PET 1',
    'PET 2',
    'IELTS 1',
    'IELTS 2',
  ],

  // --- 3. GOOGLE SHEET (nơi nhận kết quả bài làm của học sinh) -----------
  //  Dán đường link "Web App" bạn lấy được sau khi deploy Google Apps Script.
  //  (Xem file HUONG-DAN-GOOGLE-SHEET.md để biết cách lấy link này.)
  //  Nếu để trống '' thì app vẫn chạy nhưng KHÔNG gửi kết quả đi đâu cả.
  googleSheetUrl: 'https://script.google.com/macros/s/AKfy....../exec',

  // --- 4. MẬT KHẨU TRANG SOẠN ĐỀ (Admin) --------------------------------
  //  Chỉ mình bạn biết. Học sinh không vào được trang Soạn đề nếu không có.
  //  Nên đổi thành mật khẩu riêng của bạn.
  adminPassword: 'mrluu2024',

}

// ============================================================================
//  CẤU HÌNH KỸ THUẬT — thường KHÔNG cần đụng tới.
//  Nhãn hiển thị + số lần nghe mặc định cho từng cấp độ.
// ============================================================================
export const LEVELS = {
  KET:   { label: 'A2 Key · Listening',        defaultPlays: 2, color: '#6366f1' },
  PET:   { label: 'B1 Preliminary · Listening', defaultPlays: 2, color: '#6366f1' },
  IELTS: { label: 'IELTS · Listening',          defaultPlays: 1, color: '#6366f1' },
}
