// ============================================================
//  PART DẠNG NỐI (MATCHING) — kiểu KET Part 5
//  Danh sách câu bên trái + bảng đáp án chung (A–H) cố định bên phải.
//  Đề chỉ cần khai báo bảng đáp án 1 lần ở part.matchOptions
//  (không phải lặp lại trong từng câu).
// ============================================================

function QNum({ n }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', background: 'var(--lavender)', color: 'var(--indigo)', fontWeight: 800, fontSize: 13.5, flexShrink: 0 }}>
      {n}
    </span>
  )
}

export default function PartMatching({ part, options, answers, onAnswer, flagged, onToggleFlag, example }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(180px, 240px)', gap: 18, alignItems: 'start' }} className="matching-grid">
      {/* Cột trái: danh sách câu */}
      <div className="card" style={{ padding: '18px 20px' }}>
        {example && (
          <div style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 14 }}>
            <strong style={{ color: 'var(--ink)' }}>Example:</strong> {example}
          </div>
        )}
        <div style={{ display: 'grid', gap: 4 }}>
          {part.questions.map((q) => (
            <div key={q.questionNumber} id={`q-${q.questionNumber}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #f2f3f8', scrollMarginTop: 90 }}>
              <QNum n={q.questionNumber} />
              <span style={{ flex: 1, fontWeight: 700, color: 'var(--ink)', fontSize: 15.5 }}>{q.question}</span>
              <select
                value={answers[q.questionNumber] || ''}
                onChange={(e) => onAnswer(q.questionNumber, e.target.value)}
                style={{ width: 80, padding: '9px 10px', fontSize: 15, fontWeight: 700, textAlign: 'center', border: answers[q.questionNumber] ? '2px solid var(--indigo)' : '1.5px solid #e4e7f0', borderRadius: 10, background: answers[q.questionNumber] ? 'var(--lavender)' : '#fff', color: 'var(--indigo)' }}
              >
                <option value="">—</option>
                {options.map((o) => (
                  <option key={o.key} value={o.key}>{o.key}</option>
                ))}
              </select>
              <button
                onClick={() => onToggleFlag(q.questionNumber)}
                title="Đánh dấu xem lại"
                style={{ fontSize: 14, color: flagged[q.questionNumber] ? 'var(--flagged)' : 'var(--ink-faint)' }}
              >
                {flagged[q.questionNumber] ? '★' : '☆'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cột phải: bảng đáp án cố định */}
      <div className="card matching-legend" style={{ padding: '18px 20px', position: 'sticky', top: 20, background: '#fafbfe' }}>
        <div style={{ fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--ink)', marginBottom: 12, fontSize: 16 }}>Jobs</div>
        <div style={{ display: 'grid', gap: 9 }}>
          {options.map((o) => (
            <div key={o.key} style={{ display: 'flex', gap: 10, fontSize: 14.5 }}>
              <span style={{ fontWeight: 800, color: 'var(--indigo)', width: 16 }}>{o.key}</span>
              <span style={{ color: 'var(--ink)' }}>{o.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
