import Logo from './Logo'
import BrandName from './BrandName'

// Header ngang full-width, gradient navy -> teal.
// rightLabel / rightTitle: hiển thị góc phải (vd "A2 Key · Listening" + "TEST 1")
export default function Header({ rightLabel, rightTitle }) {
  return (
    <header
      style={{
        background: 'linear-gradient(100deg, var(--navy-deep) 0%, var(--navy) 45%, var(--teal) 130%)',
        padding: '16px clamp(16px, 4vw, 40px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Logo size={48} />
        <BrandName onDark />
      </div>

      {(rightLabel || rightTitle) && (
        <div style={{ textAlign: 'right', color: '#fff' }}>
          {rightLabel && (
            <div style={{ fontSize: 13, opacity: 0.85, fontWeight: 500 }}>{rightLabel}</div>
          )}
          {rightTitle && (
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '0.5px' }}>
              {rightTitle}
            </div>
          )}
        </div>
      )}
    </header>
  )
}
