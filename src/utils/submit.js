import { CONFIG } from '../config'

// ============================================================
//  GỬI KẾT QUẢ VỀ GOOGLE SHEET
//  Dùng "no-cors" + Content-Type text/plain để Apps Script nhận được
//  mà trình duyệt không chặn (đây là cách chuẩn cho Apps Script Web App).
//  Vì no-cors nên ta KHÔNG đọc được phản hồi — coi như gửi là thành công
//  nếu không có lỗi mạng. Kết quả vẫn hiện cho học sinh ngay lập tức.
// ============================================================
export async function submitResult(payload) {
  const url = CONFIG.googleSheetUrl
  if (!url) {
    console.warn('Chưa cấu hình googleSheetUrl trong src/config.js — bỏ qua gửi kết quả.')
    return { ok: false, reason: 'no-url' }
  }
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    })
    return { ok: true }
  } catch (err) {
    console.error('Lỗi gửi kết quả về Google Sheet:', err)
    return { ok: false, reason: 'network' }
  }
}
