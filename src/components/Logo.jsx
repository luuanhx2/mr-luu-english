import { CONFIG } from '../config'

// Logo tròn: nền navy, viền gold, chữ viết tắt ở giữa.
// size = đường kính (px). Dùng ở header (nhỏ) và màn hình chào (to).
export default function Logo({ size = 46 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'var(--navy)',
        border: `${Math.max(2, size * 0.05)}px solid var(--gold)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: '0 2px 10px rgba(15,37,68,0.35)',
      }}
    >
      <span
        style={{
          color: '#fff',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: size * 0.4,
          letterSpacing: '-0.5px',
        }}
      >
        {CONFIG.brand.logoText}
      </span>
    </div>
  )
}
