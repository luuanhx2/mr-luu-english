import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import Header from '../components/Header'
import { LEVELS } from '../config'
import { getStudent, hasStudent } from '../utils/student'
import { gradeTest } from '../utils/grading'
import { submitResult } from '../utils/submit'

function fmtTime(sec) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m} phút ${s} giây`
}

export default function Result() {
  const location = useLocation()
  const navigate = useNavigate()
  const student = getStudent()
  const sent = useRef(false)
  const [sendState, setSendState] = useState('sending') // sending | ok | skip | error

  const state = location.state
  const graded = state ? gradeTest(state.test, state.answers) : null

  useEffect(() => {
    if (!state || sent.current) return
    sent.current = true
    const { test, answers, timeSpent } = state
    const g = gradeTest(test, answers)
    const payload = {
      name: student.name,
      className: student.className,
      level: test.level,
      testTitle: test.title,
      score: g.correct,
      total: g.total,
      scoreText: `${g.correct}/${g.total}`,
      timeSpentSeconds: timeSpent,
      submittedAt: new Date().toISOString(),
      answersDetail: g.details.map((d) => `Q${d.questionNumber}:${d.userAnswer || '-'}${d.ok ? '✓' : '✗'}`).join(' | '),
    }
    submitResult(payload).then((r) => {
      if (r.ok) setSendState('ok')
      else if (r.reason === 'no-url') setSendState('skip')
      else setSendState('error')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!hasStudent()) return <Navigate to="/" replace />
  if (!state) return <Navigate to="/levels" replace />

  const { test } = state
  const pct = Math.round((graded.correct / graded.total) * 100)
  const levelInfo = LEVELS[test.level] || {}

  return (
    <div className="app-shell">
      <Header rightLabel={test.examLabel || levelInfo.label} rightTitle={(test.title || '').toUpperCase()} />

      <main style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(24px,5vw,40px) 20px', width: '100%' }}>
        {/* Thẻ điểm */}
        <div className="card" style={{ padding: '30px 26px', textAlign: 'center', marginBottom: 22 }}>
          {state.autoSubmitted && (
            <div style={{ color: 'var(--flagged)', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
              ⏱ Hết giờ — bài đã tự động nộp.
            </div>
          )}
          <div style={{ fontSize: 14, color: 'var(--ink-soft)' }}>Kết quả của {student.name}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 800, color: 'var(--indigo)', lineHeight: 1.1, margin: '8px 0' }}>
            {graded.correct}<span style={{ fontSize: 28, color: 'var(--ink-faint)' }}>/{graded.total}</span>
          </div>
          <div style={{ fontSize: 15, color: 'var(--ink-soft)' }}>Đúng {pct}% · {fmtTime(state.timeSpent)}</div>

          {/* Trạng thái gửi */}
          <div style={{ marginTop: 16, fontSize: 12.5 }}>
            {sendState === 'sending' && <span style={{ color: 'var(--ink-faint)' }}>Đang lưu kết quả…</span>}
            {sendState === 'ok' && <span style={{ color: '#15803d' }}>✓ Đã lưu kết quả về hệ thống của giáo viên.</span>}
            {sendState === 'skip' && <span style={{ color: 'var(--ink-faint)' }}>Chế độ luyện tập (chưa cấu hình lưu kết quả).</span>}
            {sendState === 'error' && <span style={{ color: '#dc2626' }}>Không gửi được kết quả (kiểm tra mạng). Điểm vẫn hiển thị ở trên.</span>}
          </div>
        </div>

        {/* Đối chiếu đáp án */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 12, color: 'var(--ink)' }}>Đối chiếu đáp án</h3>
        <div className="card" style={{ padding: '6px 0', marginBottom: 22 }}>
          {graded.details.map((d, i) => (
            <div key={d.questionNumber} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 18px', borderTop: i === 0 ? 'none' : '1px solid #f0f2f7' }}>
              <span style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12.5, background: d.ok ? 'var(--answered-bg)' : '#fee2e2', color: d.ok ? '#15803d' : '#b91c1c' }}>
                {d.questionNumber}
              </span>
              <span style={{ fontSize: 18 }}>{d.ok ? '✅' : '❌'}</span>
              <div style={{ flex: 1, fontSize: 14 }}>
                <span style={{ color: 'var(--ink-soft)' }}>Em chọn: </span>
                <strong style={{ color: d.ok ? '#15803d' : '#b91c1c' }}>{d.userAnswer || '(bỏ trống)'}</strong>
                {!d.ok && (
                  <>
                    <span style={{ color: 'var(--ink-soft)' }}> · Đáp án đúng: </span>
                    <strong style={{ color: 'var(--ink)' }}>{String(d.correctAnswer).split('|')[0]}</strong>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => navigate(`/tests/${test.level}`)}>Làm đề khác</button>
          <button className="btn-ghost" onClick={() => navigate('/levels')}>Về chọn cấp độ</button>
        </div>
      </main>
    </div>
  )
}
