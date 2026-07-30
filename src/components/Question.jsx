import { resolveAsset } from '../utils/tests'

// Vòng tròn số thứ tự câu hỏi.
function QNum({ n }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: '50%', background: 'var(--lavender)', color: 'var(--indigo)', fontWeight: 800, fontSize: 13.5, flexShrink: 0 }}>
      {n}
    </span>
  )
}

// Nút chọn A/B/C dạng chữ.
function ChoiceButton({ selected, onClick, keyLabel, text }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
        padding: '12px 14px', borderRadius: 12, marginBottom: 8,
        border: selected ? '2px solid var(--indigo)' : '1.5px solid #e4e7f0',
        background: selected ? 'var(--lavender)' : '#fff',
        transition: 'all 0.12s ease',
      }}
    >
      <span style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, background: selected ? 'var(--indigo)' : '#eef1f7', color: selected ? '#fff' : 'var(--ink-soft)' }}>
        {keyLabel}
      </span>
      <span style={{ color: 'var(--ink)', fontSize: 14.5 }}>{text}</span>
    </button>
  )
}

// Component chính: nhận 1 câu hỏi + giá trị đang chọn + hàm cập nhật.
export default function Question({ q, value, onChange }) {
  const wrap = (children) => (
    <div className="card" style={{ padding: '18px 20px', scrollMarginTop: 90 }}>
      <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
        <QNum n={q.questionNumber} />
        <div>
          <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: 15.5 }}>{q.question}</div>
          {q.instruction && <div style={{ fontSize: 13, color: 'var(--ink-soft)', marginTop: 3 }}>{q.instruction}</div>}
        </div>
      </div>
      {children}
    </div>
  )

  switch (q.type) {
    // --- Chọn 1 trong 3 tranh (ảnh dải ngang A/B/C) ---
    case 'multiple_choice_image':
      return wrap(
        <div>
          {q.imageUrl && (
            <img src={resolveAsset(q.imageUrl)} alt={`Câu ${q.questionNumber}`} style={{ width: '100%', borderRadius: 10, border: '1px solid #eee', marginBottom: 14 }} />
          )}
          {/* Nếu đề cung cấp ảnh riêng cho từng lựa chọn thì hiện dạng lưới */}
          {Array.isArray(q.options) && q.options.some((o) => o.imageUrl) && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
              {q.options.map((o) => (
                <button key={o.key} onClick={() => onChange(o.key)} style={{ border: value === o.key ? '2px solid var(--indigo)' : '1.5px solid #e4e7f0', borderRadius: 10, padding: 6, background: value === o.key ? 'var(--lavender)' : '#fff' }}>
                  <img src={resolveAsset(o.imageUrl)} alt={o.key} style={{ width: '100%', borderRadius: 6 }} />
                  <div style={{ fontWeight: 700, marginTop: 4, color: value === o.key ? 'var(--indigo)' : 'var(--ink-soft)' }}>{o.key}</div>
                </button>
              ))}
            </div>
          )}
          {/* 3 nút A / B / C */}
          <div style={{ display: 'flex', gap: 10 }}>
            {['A', 'B', 'C'].map((k) => (
              <button
                key={k}
                onClick={() => onChange(k)}
                style={{ flex: 1, padding: '11px 0', borderRadius: 10, fontWeight: 800, fontSize: 16, border: value === k ? '2px solid var(--indigo)' : '1.5px solid #e4e7f0', background: value === k ? 'var(--indigo)' : '#fff', color: value === k ? '#fff' : 'var(--ink-soft)' }}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      )

    // --- Trắc nghiệm A/B/C dạng chữ ---
    case 'multiple_choice_text':
      return wrap(
        <div>
          {(q.options || []).map((o) => (
            <ChoiceButton key={o.key} keyLabel={o.key} text={o.text} selected={value === o.key} onClick={() => onChange(o.key)} />
          ))}
        </div>
      )

    // --- Điền từ / số ---
    case 'gap_fill':
      return wrap(
        <input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Nhập câu trả lời…"
          style={{ width: '100%', padding: '12px 14px', fontSize: 15, border: '1.5px solid #e4e7f0', borderRadius: 10, background: '#fbfbfd' }}
        />
      )

    // --- True/False/Not given hoặc Yes/No ---
    case 'true_false_notgiven':
    case 'yes_no': {
      const opts = q.type === 'yes_no'
        ? [['YES', 'Yes'], ['NO', 'No'], ['NOT GIVEN', 'Not given']]
        : [['TRUE', 'True'], ['FALSE', 'False'], ['NOT GIVEN', 'Not given']]
      return wrap(
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {opts.map(([val, label]) => (
            <button key={val} onClick={() => onChange(val)} style={{ flex: '1 1 120px', padding: '11px 0', borderRadius: 10, fontWeight: 700, fontSize: 14, border: value === val ? '2px solid var(--indigo)' : '1.5px solid #e4e7f0', background: value === val ? 'var(--indigo)' : '#fff', color: value === val ? '#fff' : 'var(--ink-soft)' }}>
              {label}
            </button>
          ))}
        </div>
      )
    }

    // --- Nối (matching): chọn đáp án từ danh sách cho mỗi mục ---
    case 'matching':
      return wrap(
        <select value={value || ''} onChange={(e) => onChange(e.target.value)} style={{ width: '100%', padding: '12px 14px', fontSize: 15, border: '1.5px solid #e4e7f0', borderRadius: 10, background: '#fbfbfd' }}>
          <option value="">— Chọn đáp án —</option>
          {(q.matchOptions || []).map((o) => (
            <option key={o.key} value={o.key}>{o.key} — {o.text}</option>
          ))}
        </select>
      )

    default:
      return wrap(<div style={{ color: '#dc2626', fontSize: 13 }}>⚠️ Loại câu hỏi không hỗ trợ: {q.type}</div>)
  }
}
