import { useEffect, useState } from 'react'
import Icon from './Icon'

const STAGES = ['Reading your resume', 'Scoring it on the recruiter rubric', 'Writing rewrites for your weakest lines']

export default function LoadingState({ fileName, hasJobDescription, headingRef }) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setStage((s) => Math.min(s + 1, STAGES.length - 1)), 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="mx-auto flex min-h-[70dvh] w-full max-w-lg flex-col justify-center px-5 py-16" aria-live="polite" aria-busy="true">
      <div className="rounded-2xl border border-line bg-surface p-7 shadow-[var(--shadow-lift)] sm:p-9">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <Icon name="file" className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h1 ref={headingRef} tabIndex={-1} className="text-xl font-bold text-ink focus:outline-none">
              Reviewing your resume…
            </h1>
            {fileName && <p className="truncate text-muted" title={fileName}>{fileName}</p>}
          </div>
        </div>

        <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-label="Analysis in progress">
          <div className="progress-slide h-full w-2/5 rounded-full bg-primary" />
        </div>

        <ol className="mt-7 space-y-4">
          {STAGES.map((label, i) => {
            const done = i < stage
            const active = i === stage
            return (
              <li key={label} className={`flex items-center gap-3 transition-colors duration-200 ${done || active ? 'text-ink' : 'text-muted'}`}>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                    done ? 'border-success bg-success text-white' : active ? 'border-primary text-primary' : 'border-line'
                  }`}
                  aria-hidden="true"
                >
                  {done ? (
                    <Icon name="check" className="h-3.5 w-3.5" strokeWidth={3} />
                  ) : active ? (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    <span className="text-xs font-semibold">{i + 1}</span>
                  )}
                </span>
                <span>
                  {label}
                  {i === STAGES.length - 1 && hasJobDescription && ' and matching the job'}
                </span>
                <span className="sr-only">{done ? '(done)' : active ? '(in progress)' : '(pending)'}</span>
              </li>
            )
          })}
        </ol>
        <p className="mt-8 border-t border-line pt-5 text-sm text-muted">Usually takes 10–20 seconds. Keep this tab open.</p>
      </div>
    </section>
  )
}
