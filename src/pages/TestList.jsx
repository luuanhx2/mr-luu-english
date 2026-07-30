import { useEffect, useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import Header from '../components/Header'
import { LEVELS } from '../config'
import { hasStudent } from '../utils/student'
import { loadTestsByLevel } from '../utils/tests'

export default function TestList() {
  const { level } = useParams()
  const navigate = useNavigate()
  const [tests, setTests] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadTestsByLevel(level)
      .then(setTests)
      .catch((e) => setError(e.message))
  }, [level])

  if (!hasStudent()) return <Navigate to="/" replace />
  if (!LEVELS[level]) return <Navigate to="/levels" replace />

  return (
    <div className="app-shell">
      <Header rightLabel={LEVELS[level].label} />
      <main style={{ maxWidth: 820, margin: '0 auto', padding: 'clamp(24px,5vw,48px) 20px', width: '100%' }}>
        <button className="btn-ghost" style={{ marginBottom: 20 }} onClick={() => navigate('/levels')}>
          ← Chọn cấp độ khác
        </button>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--ink)', marginBottom: 4 }}>
          Đề luyện {level}
        </h1>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 24 }}>Chọn một đề để bắt đầu làm bài.</p>

        {error && <ErrorBox msg={error} />}

        {tests === null && !error && <p style={{ color: 'var(--ink-faint)' }}>Đang tải danh sách đề…</p>}

        {tests && tests.length === 0 && (
          <div className="card" style={{ padding: 28, textAlign: 'center', color: 'var(--ink-soft)' }}>
            Chưa có đề nào cho cấp độ {level}. Giáo viên có thể thêm đề ở trang Soạn đề.
          </div>
        )}

        <div style={{ display: 'grid', gap: 12 }}>
          {tests && tests.map((t) => (
            <button
              key={t.id}
              className="card"
              onClick={() => navigate(`/exam/${encodeURIComponent(t.file)}`)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', textAlign: 'left', cursor: 'pointer' }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--indigo)', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                  {t.title?.replace(/[^0-9]/g, '') || '•'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--ink)', fontSize: 16 }}>{t.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-faint)' }}>{t.examLabel || LEVELS[level].label}</div>
                </div>
              </div>
              <span style={{ color: 'var(--indigo)', fontWeight: 700, fontSize: 22 }}>›</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

function ErrorBox({ msg }) {
  return (
    <div className="card" style={{ padding: 20, borderColor: '#fecaca', background: '#fef2f2', color: '#b91c1c' }}>
      ⚠️ {msg}
    </div>
  )
}
