// ============================================================
//  PART DẠNG FORM ĐIỀN CHỖ TRỐNG — kiểu KET Part 2
//  Hiển thị như một tờ ghi chú: tiêu đề, vài dòng cho sẵn,
//  và các dòng có ô trống nằm GIỮA câu chữ.
//
//  Cách khai báo trong đề (mỗi câu 1 dòng):
//   - "label": chữ hiển thị. Dùng ký hiệu {} để đánh dấu chỗ điền.
//       Ví dụ: "Time: {} to 5 p.m."  ->  Time: [ô trống] to 5 p.m.
//       Nếu không có {} thì ô trống tự thêm vào cuối dòng.
//  part.formTitle: tiêu đề khối (vd "New music club")
//  part.formGiven: mảng dòng cho sẵn (vd ["Start date: 15th September"])
// ============================================================

function QNum({ n }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: 'var(--lavender)', color: 'var(--indigo)', fontWeight: 800, fontSize: 12, flexShrink: 0, margin: '0 4px' }}>
      {n}
    </span>
  )
}

function BlankInput({ value, onChange }) {
  return (
    <input
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="answer"
      style={{
        display: 'inline-block',
        minWidth: 150,
        padding: '4px 4px',
        margin: '0 4px',
        fontSize: 15,
        border: 'none',
        borderBottom: value ? '2px solid var(--indigo)' : '1.5px solid #c7cbe0',
        background: 'transparent',
        color: 'var(--indigo)',
        fontWeight: value ? 700 : 400,
        outline: 'none',
      }}
    />
  )
}

export default function PartForm({ part, answers, onAnswer, flagged, onToggleFlag }) {
  return (
    <div className="card" style={{ padding: '22px 24px' }}>
      {part.formTitle && (
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, color: 'var(--ink)', marginBottom: 14 }}>
          {part.formTitle}
        </h3>
      )}

      {/* Các dòng cho sẵn (không cần điền) */}
      {(part.formGiven || []).map((line, i) => (
        <div key={i} style={{ fontSize: 15, color: 'var(--ink)', marginBottom: 12 }}>{line}</div>
      ))}

      {/* Các dòng có ô trống */}
      <div style={{ display: 'grid', gap: 14 }}>
        {part.questions.map((q) => {
          const label = q.question || ''
          const hasMarker = label.includes('{}')
          const parts = hasMarker ? label.split('{}') : [label, '']
          return (
            <div key={q.questionNumber} id={`q-${q.questionNumber}`} style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 2, scrollMarginTop: 90, display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              <span>{parts[0]}</span>
              <QNum n={q.questionNumber} />
              <BlankInput value={answers[q.questionNumber]} onChange={(v) => onAnswer(q.questionNumber, v)} />
              <span>{parts[1]}</span>
              <button
                onClick={() => onToggleFlag(q.questionNumber)}
                title="Đánh dấu xem lại"
                style={{ fontSize: 14, color: flagged[q.questionNumber] ? 'var(--flagged)' : 'var(--ink-faint)', marginLeft: 8 }}
              >
                {flagged[q.questionNumber] ? '★' : '☆'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
