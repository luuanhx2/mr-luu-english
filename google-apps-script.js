// ============================================================================
//  GOOGLE APPS SCRIPT — NHẬN KẾT QUẢ BÀI LÀM & GHI VÀO GOOGLE SHEET
//  ---------------------------------------------------------------------------
//  Bạn KHÔNG cần hiểu code này. Chỉ cần copy toàn bộ, dán vào Google Sheet
//  theo hướng dẫn trong file HUONG-DAN-GOOGLE-SHEET.md, rồi bấm Deploy.
// ============================================================================

// Tên các cột trên Google Sheet (dòng tiêu đề). Có thể đổi chữ tuỳ ý.
var HEADERS = [
  'Thời điểm nhận',
  'Họ tên',
  'Lớp',
  'Cấp độ',
  'Tên đề',
  'Điểm',
  'Số câu đúng',
  'Tổng số câu',
  'Thời gian làm (giây)',
  'Ngày giờ nộp',
  'Chi tiết đáp án'
];

// Hàm chạy mỗi khi app gửi kết quả tới.
function doPost(e) {
  var lock = LockService.getScriptLock();
  // Khoá để nhiều học sinh nộp cùng lúc không ghi đè nhau (chờ tối đa 30 giây).
  lock.waitLock(30000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Nếu sheet trống, tự tạo dòng tiêu đề.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),                        // Thời điểm nhận (do server tự điền)
      data.name || '',
      data.className || '',
      data.level || '',
      data.testTitle || '',
      data.scoreText || (data.score + '/' + data.total),
      data.score != null ? data.score : '',
      data.total != null ? data.total : '',
      data.timeSpentSeconds != null ? data.timeSpentSeconds : '',
      data.submittedAt || '',
      data.answersDetail || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Cho phép mở link bằng trình duyệt để kiểm tra script còn sống hay không.
function doGet() {
  return ContentService
    .createTextOutput('Mr Luu English — script nhận kết quả đang hoạt động.')
    .setMimeType(ContentService.MimeType.TEXT);
}
