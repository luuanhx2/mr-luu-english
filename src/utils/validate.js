// ============================================================
//  KIỂM TRA DỮ LIỆU ĐỀ THI (validate)
//  Trả về mảng các thông báo lỗi bằng tiếng Việt.
//  Mảng rỗng = đề hợp lệ.
//  Dùng ở cả trang làm bài (chặn đề lỗi) và trang Soạn đề.
// ============================================================

const VALID_TYPES = [
  'multiple_choice_image', 'multiple_choice_text', 'gap_fill',
  'matching', 'true_false_notgiven', 'yes_no',
  'table_completion', 'form_completion',
]

export function validateTest(test) {
  const errs = []
  if (!test || typeof test !== 'object') return ['Đề trống hoặc sai định dạng.']

  if (!test.level) errs.push('Thiếu "level" (KET/PET/IELTS).')
  if (!test.title) errs.push('Thiếu "title" (tên đề, ví dụ Test 1).')
  if (!Array.isArray(test.parts) || test.parts.length === 0) {
    errs.push('Đề chưa có Part nào.')
    return errs
  }

  test.parts.forEach((part, pi) => {
    const pn = part.partNumber ?? pi + 1
    if (!Array.isArray(part.questions) || part.questions.length === 0) {
      errs.push(`Part ${pn}: chưa có câu hỏi nào.`)
    }
    ;(part.questions || []).forEach((q) => {
      const qn = q.questionNumber ?? '?'
      if (!q.type || !VALID_TYPES.includes(q.type)) {
        errs.push(`Câu ${qn} (Part ${pn}): loại câu hỏi không hợp lệ ("${q.type || 'trống'}").`)
      }
      // Table/form: kiểm tra các ô trống
      if (q.type === 'table_completion' || q.type === 'form_completion') {
        const blanks = (q.rows || []).filter((r) => r.blank)
        if (blanks.length === 0) errs.push(`Câu ${qn} (Part ${pn}): bảng chưa có ô trống nào cần điền.`)
        blanks.forEach((r) => {
          if (r.correctAnswer == null || r.correctAnswer === '') errs.push(`Ô ${r.questionNumber} (Part ${pn}): thiếu đáp án đúng.`)
        })
      } else {
        if (q.correctAnswer == null || q.correctAnswer === '') {
          errs.push(`Câu ${qn} (Part ${pn}): thiếu đáp án đúng.`)
        }
      }
      // Trắc nghiệm chữ cần options
      if (q.type === 'multiple_choice_text' && (!Array.isArray(q.options) || q.options.length < 2)) {
        errs.push(`Câu ${qn} (Part ${pn}): cần ít nhất 2 lựa chọn A/B/C.`)
      }
      // Matching cần danh sách đáp án (ở cấp câu HOẶC cấp Part)
      if (q.type === 'matching') {
        const hasPartOpts = Array.isArray(part.matchOptions) && part.matchOptions.length > 0
        const hasQOpts = Array.isArray(q.matchOptions) && q.matchOptions.length > 0
        if (!hasPartOpts && !hasQOpts) {
          errs.push(`Câu ${qn} (Part ${pn}): thiếu danh sách đáp án để nối (matchOptions).`)
        }
      }
    })
  })

  return errs
}
