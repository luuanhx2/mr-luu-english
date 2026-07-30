import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ================================================================
// CẤU HÌNH VITE
// ----------------------------------------------------------------
// QUAN TRỌNG: 'base' phải trùng với TÊN REPO GitHub của bạn.
// App sẽ chạy ở địa chỉ: https://<tên-github>.github.io/mr-luu-english/
// Nếu sau này bạn ĐỔI TÊN REPO, chỉ cần sửa đúng 1 dòng 'base' bên dưới.
// ================================================================
export default defineConfig({
  plugins: [react()],
  base: '/mr-luu-english/',
})
