import { scoreTone } from './scoreTone'

export default function ScoreRing({ score, label, size = 168 }) {
  const stroke = size > 140 ? 12 : 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.max(0, Math.min(100, score)) / 100)

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }} role="img" aria-label={`${label}: ${score} out of 100`}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} fill="none" className="stroke-line" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={stroke}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`ring-fill ${scoreTone(score).color}`}
            style={{ '--ring-from': circumference, '--ring-to': offset }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-display font-extrabold text-ink tabular-nums ${size > 140 ? 'text-5xl' : 'text-4xl'}`}>{score}</span>
          <span className="text-sm text-muted">/ 100</span>
        </div>
      </div>
      <p className="mt-3 font-medium text-ink-soft">{label}</p>
    </div>
  )
}
