// ============================================================
//  CHẤM ĐIỂM & XỬ LÝ CÂU HỎI
// ============================================================

// Gom toàn bộ câu hỏi của mọi Part thành 1 danh sách phẳng,
// kèm số Part để hiển thị. Với table/form completion, mỗi ô trống
// (sub-question) được tính là 1 câu riêng.
export function flattenQuestions(test) {
  const flat = []
  ;(test.parts || []).forEach((part) => {
    ;(part.questions || []).forEach((q) => {
      if ((q.type === 'table_completion' || q.type === 'form_completion') && Array.isArray(q.rows)) {
        q.rows.forEach((row) => {
          if (row.blank) {
            flat.push({
              partNumber: part.partNumber,
              questionNumber: row.questionNumber,
              type: 'gap_fill',
              question: row.label,
              correctAnswer: row.correctAnswer,
              _fromTable: true,
            })
          }
        })
      } else {
        flat.push({ ...q, partNumber: part.partNumber })
      }
    })
  })
  return flat.sort((a, b) => a.questionNumber - b.questionNumber)
}

// So sánh đáp án (không phân biệt hoa thường, bỏ khoảng trắng thừa).
export function isCorrect(question, userAnswer) {
  if (userAnswer == null || userAnswer === '') return false
  const correct = question.correctAnswer
  const norm = (s) => String(s).trim().toLowerCase().replace(/\s+/g, ' ')
  // Cho phép nhiều đáp án đúng: "4:20|4.20|twenty past four"
  const accepted = String(correct).split('|').map(norm)
  return accepted.includes(norm(userAnswer))
}

// Chấm toàn bài -> trả về {correct, total, details[]}
export function gradeTest(test, answers) {
  const questions = flattenQuestions(test)
  let correct = 0
  const details = questions.map((q) => {
    const ua = answers[q.questionNumber]
    const ok = isCorrect(q, ua)
    if (ok) correct++
    return {
      questionNumber: q.questionNumber,
      partNumber: q.partNumber,
      userAnswer: ua ?? '',
      correctAnswer: q.correctAnswer,
      ok,
    }
  })
  return { correct, total: questions.length, details }
}
