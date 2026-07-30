import { useState } from 'react'
import Header from '../components/Header'
import { CONFIG, LEVELS } from '../config'
import { validateTest } from '../utils/validate'

// ============================================================
//  TRANG SOẠN ĐỀ (ADMIN)
//  Giáo viên điền form -> bấm "Tạo file đề" -> tải file JSON về
//  -> kéo-thả lên GitHub. Không cần gõ JSON tay.
// ============================================================

const QTYPE_LABELS = {
  multiple_choice_image: 'Chọn tranh (A/B/C) — KET Part 1',
  multiple_choice_text: 'Trắc nghiệm chữ (A/B/C)',
  gap_fill: 'Điền từ / số',
  matching: 'Nối đáp án',
  true_false_notgiven: 'True / False / Not given',
  yes_no: 'Yes / No / Not given',
}

function emptyQuestion(num) {
  return { questionNumber: num, type: 'multiple_choice_text', question: '', options: [{ key: 'A', text: '' }, { key: 'B', text: '' }, { key: 'C', text: '' }], correctAnswer: '', imageUrl: '', matchOptions: [] }
}

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')

  if (!authed) {
    return (
      <div className="app-shell">
        <Header rightLabel="Khu vực giáo viên" />
        <main style={{ maxWidth: 400, margin: '60px auto', padding: 20, width: '100%' }}>
          <div className="card" style={{ padding: 26 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 6 }}>Trang Soạn đề</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginBottom: 18 }}>Nhập mật khẩu giáo viên để tiếp tục.</p>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setAuthed(pw === CONFIG.adminPassword)} placeholder="Mật khẩu" style={{ width: '100%', padding: '12px 14px', border: '1.5px solid #e2e6ef', borderRadius: 10, fontSize: 15 }} />
            <button className="btn-primary" style={{ width: '100%', marginTop: 14 }} onClick={() => setAuthed(pw === CONFIG.adminPassword)}>Vào trang</button>
            {pw && pw !== CONFIG.adminPassword && <p style={{ color: '#dc2626', fontSize: 13, marginTop: 10 }}>Sai mật khẩu.</p>}
          </div>
        </main>
      </div>
    )
  }

  return <AdminEditor />
}

function AdminEditor() {
  const [level, setLevel] = useState('KET')
  const [title, setTitle] = useState('Test 1')
  const [totalTime, setTotalTime] = useState(30)
  const [parts, setParts] = useState([{ partNumber: 1, audioUrl: '', allowedPlays: 2, instruction: '', questions: [emptyQuestion(1)] }])
  const [output, setOutput] = useState(null)
  const [errors, setErrors] = useState([])

  function buildTest() {
    const id = `${level.toLowerCase()}-${title.toLowerCase().replace(/\s+/g, '-')}`
    return {
      id,
      level,
      title,
      examLabel: LEVELS[level].label,
      totalTimeMinutes: Number(totalTime),
      parts: parts.map((p) => ({
        partNumber: p.partNumber,
        audioUrl: p.audioUrl,
        allowedPlays: Number(p.allowedPlays),
        instruction: p.instruction,
        questions: p.questions.map((q) => {
          const base = { questionNumber: q.questionNumber, type: q.type, question: q.question, correctAnswer: q.correctAnswer }
          if (q.type === 'multiple_choice_text') base.options = q.options
          if (q.type === 'multiple_choice_image') base.imageUrl = q.imageUrl
          if (q.type === 'matching') base.matchOptions = q.matchOptions
          return base
        }),
      })),
    }
  }

  function handleGenerate() {
    const test = buildTest()
    const errs = validateTest(test)
    setErrors(errs)
    if (errs.length === 0) setOutput(test)
    else setOutput(null)
  }

  function download() {
    const test = buildTest()
    const blob = new Blob([JSON.stringify(test, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${test.id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // ---- Thao tác Part / câu hỏi ----
  function addPart() {
    const nextPartNum = parts.length + 1
    const lastQ = Math.max(0, ...parts.flatMap((p) => p.questions.map((q) => q.questionNumber)))
    setParts([...parts, { partNumber: nextPartNum, audioUrl: '', allowedPlays: LEVELS[level].defaultPlays, instruction: '', questions: [emptyQuestion(lastQ + 1)] }])
  }
  function updatePart(pi, patch) {
    setParts(parts.map((p, i) => (i === pi ? { ...p, ...patch } : p)))
  }
  function addQuestion(pi) {
    const lastQ = Math.max(0, ...parts.flatMap((p) => p.questions.map((q) => q.questionNumber)))
    updatePart(pi, { questions: [...parts[pi].questions, emptyQuestion(lastQ + 1)] })
  }
  function updateQuestion(pi, qi, patch) {
    const qs = parts[pi].questions.map((q, i) => (i === qi ? { ...q, ...patch } : q))
    updatePart(pi, { questions: qs })
  }
  function removeQuestion(pi, qi) {
    updatePart(pi, { questions: parts[pi].questions.filter((_, i) => i !== qi) })
  }

  return (
    <div className="app-shell">
      <Header rightLabel="Khu vực giáo viên" rightTitle="SOẠN ĐỀ" />
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '28px 20px', width: '100%' }}>

        <div className="card" style={{ padding: 20, marginBottom: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14 }}>
            <Field label="Cấp độ">
              <select value={level} onChange={(e) => setLevel(e.target.value)} style={inp}>
                {Object.keys(LEVELS).map((l) => <option key={l}>{l}</option>)}
              </select>
            </Field>
            <Field label="Tên đề"><input value={title} onChange={(e) => setTitle(e.target.value)} style={inp} placeholder="Test 1" /></Field>
            <Field label="Thời gian (phút)"><input type="number" value={totalTime} onChange={(e) => setTotalTime(e.target.value)} style={inp} /></Field>
          </div>
        </div>

        {parts.map((part, pi) => (
          <div key={pi} className="card" style={{ padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--indigo)', marginBottom: 14 }}>Part {part.partNumber}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 12, marginBottom: 14 }}>
              <Field label="Link audio (vd: audio/ket/test1-part1.mp3)"><input value={part.audioUrl} onChange={(e) => updatePart(pi, { audioUrl: e.target.value })} style={inp} placeholder="audio/ket/..." /></Field>
              <Field label="Số lần nghe"><input type="number" value={part.allowedPlays} onChange={(e) => updatePart(pi, { allowedPlays: e.target.value })} style={inp} /></Field>
            </div>
            <Field label="Hướng dẫn (instruction)"><input value={part.instruction} onChange={(e) => updatePart(pi, { instruction: e.target.value })} style={inp} placeholder="For each question, choose the correct answer." /></Field>

            <div style={{ marginTop: 14 }}>
              {part.questions.map((q, qi) => (
                <div key={qi} style={{ background: '#fafbfe', border: '1px solid #eceef4', borderRadius: 12, padding: 14, marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <strong style={{ fontSize: 14 }}>Câu {q.questionNumber}</strong>
                    <button onClick={() => removeQuestion(pi, qi)} style={{ color: '#dc2626', fontSize: 12.5, fontWeight: 600 }}>Xoá câu</button>
                  </div>
                  <Field label="Loại câu hỏi">
                    <select value={q.type} onChange={(e) => updateQuestion(pi, qi, { type: e.target.value })} style={inp}>
                      {Object.entries(QTYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </Field>
                  <div style={{ marginTop: 10 }}>
                    <Field label="Nội dung câu hỏi"><input value={q.question} onChange={(e) => updateQuestion(pi, qi, { question: e.target.value })} style={inp} placeholder="Where's the girl going?" /></Field>
                  </div>

                  {q.type === 'multiple_choice_image' && (
                    <div style={{ marginTop: 10 }}>
                      <Field label="Link ảnh (dải ngang A/B/C)"><input value={q.imageUrl} onChange={(e) => updateQuestion(pi, qi, { imageUrl: e.target.value })} style={inp} placeholder="images/ket/test1-q1.jpg" /></Field>
                    </div>
                  )}

                  {q.type === 'multiple_choice_text' && (
                    <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
                      {q.options.map((o, oi) => (
                        <div key={oi} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, width: 20 }}>{o.key}</span>
                          <input value={o.text} onChange={(e) => { const opts = q.options.map((x, i) => i === oi ? { ...x, text: e.target.value } : x); updateQuestion(pi, qi, { options: opts }) }} style={inp} placeholder={`Lựa chọn ${o.key}`} />
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'matching' && (
                    <div style={{ marginTop: 10 }}>
                      <Field label="Các đáp án để nối (mỗi dòng: Ký tự = Nội dung, vd A=actor)">
                        <textarea rows={4} value={(q.matchOptions || []).map((m) => `${m.key}=${m.text}`).join('\n')} onChange={(e) => { const mo = e.target.value.split('\n').filter(Boolean).map((line) => { const [k, ...rest] = line.split('='); return { key: (k || '').trim(), text: rest.join('=').trim() } }); updateQuestion(pi, qi, { matchOptions: mo }) }} style={{ ...inp, fontFamily: 'monospace' }} placeholder={'A=actor\nB=coach\nC=dentist'} />
                      </Field>
                    </div>
                  )}

                  <div style={{ marginTop: 10 }}>
                    <Field label='Đáp án đúng (vd "B" hoặc "Robinson". Nhiều đáp án đúng ngăn bằng dấu | )'>
                      <input value={q.correctAnswer} onChange={(e) => updateQuestion(pi, qi, { correctAnswer: e.target.value })} style={inp} placeholder="B" />
                    </Field>
                  </div>
                </div>
              ))}
              <button className="btn-ghost" onClick={() => addQuestion(pi)} style={{ marginTop: 4 }}>+ Thêm câu hỏi</button>
            </div>
          </div>
        ))}

        <button className="btn-ghost" onClick={addPart} style={{ marginBottom: 20 }}>+ Thêm Part</button>

        {errors.length > 0 && (
          <div className="card" style={{ padding: 18, marginBottom: 16, borderColor: '#fecaca', background: '#fef2f2', color: '#b91c1c' }}>
            <strong>Đề còn thiếu:</strong>
            <ul style={{ margin: '8px 0 0 18px' }}>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={handleGenerate}>Kiểm tra đề</button>
          <button className="btn-primary" style={{ background: '#15803d', boxShadow: '0 4px 14px rgba(21,128,61,0.28)' }} onClick={download}>⬇ Tải file đề (.json)</button>
        </div>

        {output && (
          <div className="card" style={{ padding: 18, marginTop: 18, background: '#f0fdf4', borderColor: '#bbf7d0' }}>
            <strong style={{ color: '#15803d' }}>✓ Đề hợp lệ!</strong>
            <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginTop: 8, lineHeight: 1.6 }}>
              Bấm nút xanh <strong>"Tải file đề"</strong> để tải file <code>{output.id}.json</code>.
              Sau đó làm theo file <strong>HUONG-DAN-THEM-DE.md</strong> để kéo file lên GitHub (chỉ vài cú click).
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-soft)', display: 'block', marginBottom: 5 }}>{label}</span>
      {children}
    </label>
  )
}
const inp = { width: '100%', padding: '10px 12px', border: '1.5px solid #e2e6ef', borderRadius: 9, fontSize: 14, background: '#fff' }
