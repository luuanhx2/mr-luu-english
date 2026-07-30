import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import BrandName from '../components/BrandName'
import { CONFIG } from '../config'
import { setStudent } from '../utils/student'

export default function Welcome() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [className, setClassName] = useState('')
  const [error, setError] = useState('')

  function handleStart() {
    if (!name.trim()) { setError('Vui lòng nhập họ và tên của em.'); return }
    if (!className) { setError('Vui lòng chọn lớp của em.'); return }
    setStudent(name, className)
    navigate('/levels')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(150deg, var(--navy-deep) 0%, var(--navy) 40%, var(--teal) 120%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo + tên thương hiệu, canh giữa */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            <Logo size={92} />
          </div>
          <div style={{ display: 'inline-block' }}>
            <div style={{ transform: 'scale(1.35)', transformOrigin: 'center' }}>
              <BrandName onDark size={1} />
            </div>
          </div>
        </div>

        {/* Thẻ nhập liệu */}
        <div
          className="card"
          style={{ padding: '28px 24px', boxShadow: 'var(--shadow-lg)' }}
        >
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 21, color: 'var(--ink)', marginBottom: 6 }}>
            Chào em! 👋
          </h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14.5, marginBottom: 22 }}>
            Nhập thông tin để bắt đầu luyện nghe.
          </p>

          <label style={labelStyle}>Họ và tên</label>
          <input
            style={inputStyle}
            value={name}
            onChange={(e) => { setName(e.target.value); setError('') }}
            placeholder="Ví dụ: Nguyễn Văn An"
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          />

          <label style={{ ...labelStyle, marginTop: 16 }}>Lớp</label>
          <select
            style={inputStyle}
            value={className}
            onChange={(e) => { setClassName(e.target.value); setError('') }}
          >
            <option value="">— Chọn lớp của em —</option>
            {CONFIG.classList.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {error && (
            <div style={{ color: '#dc2626', fontSize: 13.5, marginTop: 14, fontWeight: 500 }}>
              {error}
            </div>
          )}

          <button className="btn-primary" style={{ width: '100%', marginTop: 22, textTransform: 'uppercase' }} onClick={handleStart}>
            Bắt đầu
          </button>
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 18 }}>
          {CONFIG.brand.subtitle}
        </p>
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--ink-soft)',
  marginBottom: 7,
}
const inputStyle = {
  width: '100%',
  padding: '13px 15px',
  fontSize: 15,
  border: '1.5px solid #e2e6ef',
  borderRadius: 'var(--radius-sm)',
  background: '#fff',
  color: 'var(--ink)',
  outline: 'none',
}
