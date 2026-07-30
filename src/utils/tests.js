// ============================================================
//  ĐỌC DANH SÁCH ĐỀ THI
//  App đọc file /public/data/tests-index.json để biết có những đề nào.
//  Mỗi khi bạn thêm đề mới, chỉ cần thêm 1 dòng vào file index đó
//  (trang Soạn đề sẽ tạo sẵn dòng này giúp bạn — không phải gõ tay).
// ============================================================

// Đường dẫn gốc (khớp base path trong vite.config.js).
const BASE = import.meta.env.BASE_URL // vd '/mr-luu-english/'

// Đọc file index liệt kê toàn bộ đề.
export async function loadIndex() {
  const res = await fetch(`${BASE}data/tests-index.json?t=${Date.now()}`)
  if (!res.ok) throw new Error('Không đọc được danh sách đề (tests-index.json).')
  return res.json()
}

// Lọc đề theo cấp độ (KET / PET / IELTS).
export async function loadTestsByLevel(level) {
  const index = await loadIndex()
  return (index.tests || []).filter((t) => t.level === level)
}

// Đọc nội dung chi tiết của 1 đề (file JSON riêng của đề đó).
export async function loadTest(file) {
  const res = await fetch(`${BASE}${file}?t=${Date.now()}`)
  if (!res.ok) throw new Error(`Không đọc được đề: ${file}`)
  return res.json()
}

// Chuyển đường dẫn tương đối trong đề (audio/ảnh) thành đường dẫn đầy đủ.
// Nếu là link http(s) đầy đủ thì giữ nguyên.
export function resolveAsset(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return `${BASE}${path.replace(/^\//, '')}`
}
