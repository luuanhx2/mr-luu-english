import { useRef, useState, useEffect } from 'react'
import { resolveAsset } from '../utils/tests'

function fmt(sec) {
  if (!isFinite(sec)) return '00:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// Trình phát audio cho 1 Part.
// allowedPlays: số lần được bấm play (KET/PET=2, IELTS=1). Hết lượt -> khoá.
export default function AudioPlayer({ src, allowedPlays = 2 }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [cur, setCur] = useState(0)
  const [dur, setDur] = useState(0)
  const [playsUsed, setPlaysUsed] = useState(0)
  const playsLeft = Math.max(0, allowedPlays - playsUsed)

  useEffect(() => {
    // Reset khi đổi Part.
    setPlaying(false); setCur(0); setDur(0); setPlaysUsed(0)
  }, [src])

  function togglePlay() {
    const a = audioRef.current
    if (!a) return
    if (playing) {
      a.pause()
      setPlaying(false)
    } else {
      if (playsLeft <= 0) return
      // Mỗi lần bắt đầu nghe từ đầu = tính 1 lượt (đúng luật thi: nghe lại cả đoạn).
      if (a.currentTime === 0 || a.ended) {
        setPlaysUsed((n) => n + 1)
      }
      a.play()
      setPlaying(true)
    }
  }

  return (
    <div
      className="card"
      style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}
    >
      <audio
        ref={audioRef}
        src={resolveAsset(src)}
        onTimeUpdate={(e) => setCur(e.target.currentTime)}
        onLoadedMetadata={(e) => setDur(e.target.duration)}
        onEnded={() => setPlaying(false)}
      />

      {/* Nút play tròn indigo */}
      <button
        onClick={togglePlay}
        disabled={playsLeft <= 0 && !playing}
        aria-label={playing ? 'Tạm dừng' : 'Phát'}
        style={{
          width: 52, height: 52, borderRadius: '50%',
          background: (playsLeft <= 0 && !playing) ? '#c7cbe0' : 'var(--indigo)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, boxShadow: '0 4px 12px rgba(79,70,229,0.35)',
          cursor: (playsLeft <= 0 && !playing) ? 'not-allowed' : 'pointer',
        }}
      >
        {playing ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><rect x="5" y="4" width="5" height="16" rx="1.5"/><rect x="14" y="4" width="5" height="16" rx="1.5"/></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M7 5.5v13a1 1 0 0 0 1.54.84l10-6.5a1 1 0 0 0 0-1.68l-10-6.5A1 1 0 0 0 7 5.5Z"/></svg>
        )}
      </button>

      {/* Progress bar + thời gian */}
      <div style={{ flex: 1, minWidth: 160 }}>
        <div style={{ position: 'relative', height: 6, background: '#e7e9f2', borderRadius: 999 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${dur ? (cur / dur) * 100 : 0}%`, background: 'var(--indigo)', borderRadius: 999 }} />
          <div style={{ position: 'absolute', top: '50%', left: `${dur ? (cur / dur) * 100 : 0}%`, width: 12, height: 12, background: '#fff', border: '2px solid var(--indigo)', borderRadius: '50%', transform: 'translate(-50%, -50%)' }} />
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
          {fmt(cur)} / {fmt(dur)}
        </div>
      </div>

      {/* Plays left */}
      <span className="pill pill-outline" style={{ whiteSpace: 'nowrap' }}>
        Plays left: {playsLeft}
      </span>
    </div>
  )
}
