import { useEffect, useState, useMemo, useRef } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import Header from '../components/Header'
import AudioPlayer from '../components/AudioPlayer'
import Question from '../components/Question'
import PartForm from '../components/PartForm'
import PartMatching from '../components/PartMatching'
import { LEVELS } from '../config'
import { getStudent, hasStudent } from '../utils/student'
import { loadTest } from '../utils/tests'
import { flattenQuestions } from '../utils/grading'
import { validateTest } from '../utils/validate'

function fmt(sec) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function Exam() {
  const { file } = useParams()
  const navigate = useNavigate()
  const student = getStudent()

  const [test, setTest] = useState(null)
  const [error, setError] = useState('')
  const [answers, setAnswers] = useState({})
  const [flagged, setFlagged] = useState({})
  const [remaining, setRemaining] = useState(0)
  const [startedAt] = useState(Date.now())
  const timerRef = useRef(null)

  useEffect(() => {
    loadTest(decodeURIComponent(file))
      .then((t) => {
        const errs = validateTest(t)
        if (errs.length) { setError('Đề có lỗi dữ liệu:\n• ' + errs.join('\n• ')); return }
        setTest(t)
        setRemaining((t.totalTimeMinutes || 30) * 60)
      })
      .catch((e) => setError(e.message))
  }, [file])

  // Đồng hồ đếm ngược
  useEffect(() => {
    if (!test) return
    timerRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) { clearInterval(timerRef.current); handleSubmit(true); return 0 }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test])

  const questions = useMemo(() => (test ? flattenQuestions(test) : []), [test])

  function setAnswer(qNum, val) {
    setAnswers((a) => ({ ...a, [qNum]: val }))
  }
  function toggleFlag(qNum) {
    setFlagged((f) => ({ ...f, [qNum]: !f[qNum] }))
  }
  function scrollToQ(qNum) {
    document.getElementById(`q-${qNum}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleSubmit(auto = false) {
    clearInterval(timerRef.current)
    const timeSpent = Math.round((Date.now() - startedAt) / 1000)
    navigate('/result', { state: { test, answers, timeSpent, autoSubmitted: auto } })
  }

  if (!hasStudent()) return <Navigate to="/" replace />

  if (error) {
    return (
      <div className="app-shell">
        <Header />
        <main style={{ maxWidth: 700, margin: '40px auto', padding: 20, width: '100%' }}>
          <div className="card" style={{ padding: 24, borderColor: '#fecaca', background: '#fef2f2', color: '#b91c1c', whiteSpace: 'pre-line' }}>
            ⚠️ {error}
          </div>
          <button className="btn-ghost" style={{ marginTop: 18 }} onClick={() => navigate(-1)}>← Quay lại</button>
        </main>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="app-shell">
        <Header />
        <main style={{ padding: 40, textAlign: 'center', color: 'var(--ink-faint)' }}>Đang tải đề…</main>
      </div>
    )
  }

  const levelInfo = LEVELS[test.level] || {}
  const answeredCount = Object.values(answers).filter((v) => v !== '' && v != null).length

  return (
    <div className="app-shell">
      <Header rightLabel={test.examLabel || levelInfo.label} rightTitle={(test.title || '').toUpperCase()} />

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(16px,3vw,32px) 20px', width: '100%', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: 24, alignItems: 'start' }} className="exam-grid">
        {/* ============ CỘT TRÁI: NỘI DUNG ============ */}
        <div style={{ minWidth: 0 }}>
          {test.parts.map((part) => (
            <section key={part.partNumber} style={{ marginBottom: 34 }}>
              <span className="pill pill-lavender">Listening</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--indigo)', margin: '10px 0 14px' }}>
                Part {part.partNumber}
              </h2>

              {part.audioUrl && (
                <div style={{ marginBottom: 16 }}>
                  <AudioPlayer src={part.audioUrl} allowedPlays={part.allowedPlays ?? levelInfo.defaultPlays ?? 2} />
                </div>
              )}

              {part.instruction && (
                <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginBottom: 14, fontStyle: 'italic' }}>{part.instruction}</p>
              )}

              {/* Chọn cách hiển thị theo kiểu Part */}
              {part.layout === 'form' ? (
                <PartForm
                  part={part}
                  answers={answers}
                  onAnswer={setAnswer}
                  flagged={flagged}
                  onToggleFlag={toggleFlag}
                />
              ) : part.layout === 'matching' ? (
                <PartMatching
                  part={part}
                  options={part.matchOptions || (part.questions[0]?.matchOptions) || []}
                  example={part.example}
                  answers={answers}
                  onAnswer={setAnswer}
                  flagged={flagged}
                  onToggleFlag={toggleFlag}
                />
              ) : (
                <div style={{ display: 'grid', gap: 14 }}>
                  {flattenQuestions({ parts: [part] }).map((q) => (
                    <div key={q.questionNumber} id={`q-${q.questionNumber}`} style={{ position: 'relative' }}>
                      <Question q={q} value={answers[q.questionNumber]} onChange={(v) => setAnswer(q.questionNumber, v)} />
                      <button
                        onClick={() => toggleFlag(q.questionNumber)}
                        title="Đánh dấu xem lại"
                        style={{ position: 'absolute', top: 14, right: 14, fontSize: 12, fontWeight: 700, color: flagged[q.questionNumber] ? 'var(--flagged)' : 'var(--ink-faint)' }}
                      >
                        {flagged[q.questionNumber] ? '★ Đã đánh dấu' : '☆ Đánh dấu'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* ============ CỘT PHẢI: SIDEBAR ============ */}
        <aside className="exam-sidebar" style={{ position: 'sticky', top: 20, display: 'grid', gap: 14 }}>
          {/* Thông tin học sinh */}
          <div style={{ background: 'var(--lavender)', borderRadius: 'var(--radius)', padding: '14px 16px' }}>
            <div style={{ fontWeight: 700, color: 'var(--ink)' }}>{student.name}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Lớp: {student.className}</div>
          </div>

          {/* Đồng hồ */}
          <div className="card" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginBottom: 2 }}>Time remaining</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: remaining < 60 ? '#dc2626' : 'var(--ink)', fontVariantNumeric: 'tabular-nums' }}>
              {fmt(remaining)}
            </div>
          </div>

          {/* Nút SUBMIT */}
          <button className="btn-primary" style={{ textTransform: 'uppercase', fontSize: 16 }} onClick={() => handleSubmit(false)}>
            Submit
          </button>
          <p style={{ fontSize: 11.5, color: 'var(--ink-faint)', lineHeight: 1.5, margin: 0 }}>
            Bấm số câu để nhảy nhanh. Đánh dấu ☆ để xem lại. Câu trả lời được lưu tự động.
          </p>

          {/* Lưới câu hỏi */}
          <div className="card" style={{ padding: '14px 16px' }}>
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: 'var(--ink)' }}>
              Questions <span style={{ color: 'var(--ink-faint)', fontWeight: 500 }}>({answeredCount}/{questions.length})</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
              {questions.map((q) => {
                const ans = answers[q.questionNumber] !== '' && answers[q.questionNumber] != null
                const flag = flagged[q.questionNumber]
                let bg = 'var(--unanswered-bg)', bd = 'var(--unanswered)', col = 'var(--ink-soft)'
                if (flag) { bg = 'var(--flagged-bg)'; bd = 'var(--flagged)'; col = '#c2410c' }
                else if (ans) { bg = 'var(--answered-bg)'; bd = 'var(--answered)'; col = '#15803d' }
                return (
                  <button key={q.questionNumber} onClick={() => scrollToQ(q.questionNumber)} style={{ aspectRatio: '1', borderRadius: 8, border: `1.5px solid ${bd}`, background: bg, color: col, fontWeight: 700, fontSize: 13 }}>
                    {q.questionNumber}
                  </button>
                )
              })}
            </div>
            {/* Legend */}
            <div style={{ marginTop: 12, display: 'grid', gap: 5 }}>
              <Legend color="var(--answered)" label="Answered" />
              <Legend color="var(--flagged)" label="Flagged for review" />
              <Legend color="var(--unanswered)" label="Not answered" />
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}

function Legend({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink-soft)' }}>
      <span style={{ width: 11, height: 11, borderRadius: '50%', background: color, flexShrink: 0 }} />
      {label}
    </div>
  )
}
