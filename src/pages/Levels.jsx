import { useNavigate, Navigate } from 'react-router-dom'
import Header from '../components/Header'
import { LEVELS } from '../config'
import { getStudent, hasStudent } from '../utils/student'

const LEVEL_INFO = {
  KET:   { name: 'KET', full: 'A2 Key', desc: 'Trình độ cơ bản · 25 câu · 5 phần', emoji: '🌱' },
  PET:   { name: 'PET', full: 'B1 Preliminary', desc: 'Trình độ trung cấp · 25 câu · 4 phần', emoji: '📘' },
  IELTS: { name: 'IELTS', full: 'IELTS', desc: 'Trình độ nâng cao · 40 câu · 4 phần', emoji: '🎯' },
}

export default function Levels() {
  const navigate = useNavigate()
  const student = getStudent()
  if (!hasStudent()) return <Navigate to="/" replace />

  return (
    <div className="app-shell">
      <Header />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(24px,5vw,48px) 20px', width: '100%' }}>
        <div style={{ marginBottom: 28 }}>
          <span className="pill pill-lavender">Xin chào, {student.name}</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginTop: 14, color: 'var(--ink)' }}>
            Chọn cấp độ em muốn luyện
          </h1>
          <p style={{ color: 'var(--ink-soft)', marginTop: 6 }}>
            Mỗi cấp độ bám sát cấu trúc đề thi thật.
          </p>
        </div>

        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {Object.keys(LEVELS).map((key) => {
            const info = LEVEL_INFO[key]
            return (
              <button
                key={key}
                className="card"
                onClick={() => navigate(`/tests/${key}`)}
                style={{
                  textAlign: 'left',
                  padding: '24px 22px',
                  transition: 'transform 0.14s ease, box-shadow 0.14s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
              >
                <div style={{ fontSize: 34, marginBottom: 14 }}>{info.emoji}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--indigo)' }}>
                  {info.name}
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginTop: 2 }}>{info.full}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-faint)', marginTop: 12 }}>{info.desc}</div>
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}
