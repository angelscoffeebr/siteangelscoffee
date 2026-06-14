/* ----------------------------------------------------------------
   Petals — signature falling-petals animation
   Re-skin of the reference water-drop signature into gentle petals.
   Decorative only: pointer-events-none, disabled under reduced motion.
---------------------------------------------------------------- */

const COLORS = ['#E8A98C', '#9DA98C', '#F0CBB6', '#B7C0A6']

// left%, animationDelay, duration, size(px), drift(px), spin duration, opacity
const PETALS = [
  { left: '8%', delay: '0s', dur: '9s', size: 18, drift: 26, spin: '5s', op: 0.85 },
  { left: '22%', delay: '2.4s', dur: '11s', size: 13, drift: -18, spin: '6.5s', op: 0.7 },
  { left: '37%', delay: '1.1s', dur: '10s', size: 22, drift: 34, spin: '7s', op: 0.8 },
  { left: '52%', delay: '3.6s', dur: '12s', size: 15, drift: -28, spin: '5.5s', op: 0.6 },
  { left: '66%', delay: '0.6s', dur: '9.5s', size: 19, drift: 22, spin: '6s', op: 0.85 },
  { left: '79%', delay: '2.9s', dur: '11.5s', size: 14, drift: -20, spin: '7.5s', op: 0.65 },
  { left: '90%', delay: '1.7s', dur: '10.5s', size: 17, drift: 30, spin: '5s', op: 0.75 },
]

export default function Petals({ className = '', count = 7 }) {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return null

  const petals = PETALS.slice(0, count)

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none overflow-hidden ${className}`}
    >
      {petals.map((p, i) => (
        <span
          key={i}
          className="absolute -top-6"
          style={{
            left: p.left,
            willChange: 'transform, opacity',
            animation: `petal-fall ${p.dur} linear ${p.delay} infinite`,
            ['--drift']: `${p.drift}px`,
            ['--op']: p.op,
          }}
        >
          <svg
            width={p.size}
            height={p.size}
            viewBox="0 0 24 24"
            style={{
              display: 'block',
              willChange: 'transform',
              animation: `petal-spin ${p.spin} ease-in-out ${p.delay} infinite`,
              filter: 'drop-shadow(0 1px 2px rgba(30,42,56,0.12))',
            }}
          >
            <path
              d="M12 1.5 C 6.5 7, 4.5 15, 12 22.5 C 19.5 15, 17.5 7, 12 1.5 Z"
              fill={COLORS[i % COLORS.length]}
              fillOpacity="0.9"
            />
            <path
              d="M12 4 C 10 9, 10 16, 12 21"
              fill="none"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="0.8"
            />
          </svg>
        </span>
      ))}

      <style>{`
        @keyframes petal-fall {
          0%   { transform: translateY(-30px) translateX(0) rotate(0deg); opacity: 0; }
          10%  { opacity: var(--op, 0.8); }
          90%  { opacity: var(--op, 0.8); }
          100% { transform: translateY(440px) translateX(var(--drift, 20px)) rotate(40deg); opacity: 0; }
        }
        @keyframes petal-spin {
          0%   { transform: rotate(-16deg); }
          50%  { transform: rotate(20deg); }
          100% { transform: rotate(-16deg); }
        }
        @keyframes petal-fadein {
          from { opacity: 0; transform: translateY(2px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
