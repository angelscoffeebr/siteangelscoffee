/* ----------------------------------------------------------------
   Petals — signature falling-petals animation
   Re-skin of the reference water-drop signature into gentle petals.
   Decorative only: pointer-events-none, disabled under reduced motion.
---------------------------------------------------------------- */

const COLORS = ['#E8A98C', '#9DA98C', '#F0CBB6', '#B7C0A6']

// left%, animationDelay, duration, size(px), drift(px), spin duration, opacity
// Bigger petals (~30-52px) spread across the FULL width, top-left to top-right.
const PETALS = [
  { left: '2%', delay: '0s', dur: '11s', size: 44, drift: 40, spin: '6s', op: 0.7 },
  { left: '11%', delay: '3.2s', dur: '13s', size: 32, drift: -30, spin: '7.5s', op: 0.55 },
  { left: '20%', delay: '1.4s', dur: '12s', size: 50, drift: 48, spin: '8s', op: 0.65 },
  { left: '30%', delay: '5s', dur: '14s', size: 36, drift: -36, spin: '6.5s', op: 0.5 },
  { left: '39%', delay: '2.1s', dur: '11.5s', size: 46, drift: 38, spin: '7s', op: 0.7 },
  { left: '48%', delay: '6.2s', dur: '13.5s', size: 33, drift: -28, spin: '8.5s', op: 0.5 },
  { left: '58%', delay: '1s', dur: '12.5s', size: 52, drift: 44, spin: '6s', op: 0.6 },
  { left: '67%', delay: '4.4s', dur: '14.5s', size: 38, drift: -40, spin: '7.5s', op: 0.55 },
  { left: '76%', delay: '2.7s', dur: '11s', size: 48, drift: 42, spin: '6.5s', op: 0.68 },
  { left: '85%', delay: '5.6s', dur: '13s', size: 34, drift: -32, spin: '8s', op: 0.5 },
  { left: '92%', delay: '0.6s', dur: '12s', size: 42, drift: 36, spin: '7s', op: 0.65 },
  { left: '96%', delay: '3.8s', dur: '14s', size: 30, drift: -24, spin: '6s', op: 0.45 },
]

export default function Petals({ className = '', count = 12 }) {
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
          0%   { transform: translateY(-40px) translateX(0) rotate(0deg); opacity: 0; }
          8%   { opacity: var(--op, 0.8); }
          90%  { opacity: var(--op, 0.8); }
          100% { transform: translateY(820px) translateX(var(--drift, 20px)) rotate(48deg); opacity: 0; }
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
