import { useEffect, useState } from 'react'

const STAGES = ['Reading your resume', 'Scoring it on the recruiter rubric', 'Drafting rewrites for your weakest lines']

export default function LoadingState({ fileName, hasJobDescription }) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-5 py-20 text-center" aria-live="polite">
      <div className="relative h-20 w-20">
        <div className="absolute inset-0 rounded-full border-4 border-line" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-pen" />
      </div>
      <h1 className="mt-8 font-display text-3xl font-semibold text-ink">Reviewing your resume…</h1>
      {fileName && <p className="mt-2 break-all text-muted">{fileName}</p>}

      <ol className="mt-10 w-full max-w-sm space-y-3 text-left">
        {STAGES.map((label, i) => (
          <li key={label} className={`flex items-center gap-3 text-sm transition-colors ${i <= stage ? 'text-ink' : 'text-muted/60'}`}>
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                i < stage ? 'border-good bg-good text-white' : i === stage ? 'border-pen text-pen' : 'border-line'
              }`}
              aria-hidden="true"
            >
              {i < stage ? '✓' : i + 1}
            </span>
            {label}
            {i === STAGES.length - 1 && hasJobDescription && ' and matching the job description'}
          </li>
        ))}
      </ol>
      <p className="mt-10 text-sm text-muted">This usually takes 10–20 seconds. Keep this tab open.</p>
    </section>
  )
}
