import { CONFIG } from '../config'

// Tên thương hiệu 2 dòng. onDark=true khi đặt trên nền tối (header/banner).
export default function BrandName({ onDark = true, size = 1 }) {
  const b = CONFIG.brand
  const mainColor = onDark ? '#fff' : 'var(--navy)'
  const subColor = onDark ? 'rgba(255,255,255,0.8)' : 'var(--ink-soft)'
  return (
    <div style={{ lineHeight: 1.15 }}>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: `${19 * size}px`,
          letterSpacing: '0.2px',
        }}
      >
        <span style={{ color: mainColor }}>{b.nameLine1White} </span>
        <span style={{ color: 'var(--gold)' }}>{b.nameLine1Gold}</span>
      </div>
      <div
        style={{
          fontSize: `${10 * size}px`,
          fontWeight: 600,
          letterSpacing: '2.5px',
          color: subColor,
          marginTop: 2,
        }}
      >
        {b.subtitle}
      </div>
    </div>
  )
}
