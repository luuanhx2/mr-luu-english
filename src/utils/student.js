// Lưu thông tin học sinh trong bộ nhớ tạm của trang (session hiện tại).
// KHÔNG dùng localStorage — dữ liệu chỉ tồn tại tới khi đóng/refresh tab,
// đúng tinh thần "không đăng nhập, mỗi lần làm ghi nhận riêng".

let _student = { name: '', className: '' }

export function setStudent(name, className) {
  _student = { name: name.trim(), className }
}

export function getStudent() {
  return _student
}

export function hasStudent() {
  return _student.name !== '' && _student.className !== ''
}
