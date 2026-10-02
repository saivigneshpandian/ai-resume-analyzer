import { useState } from 'react'
import ScoreRing from './ScoreRing'
import { scoreTone } from './scoreTone'
import { PenStrike } from './PenMark'

function Card({ title, count, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-line bg-sheet p-6 sm:p-8 ${className}`}>
      <h2 className="mb-5 flex items-baseline gap-3 font-display text-2xl font-semibold text-ink">
        {title}
        {count != null && <span className="font-sans text-sm font-normal whitespace-nowrap text-muted">{count}</span>}
      </h2>
      {children}
    </section>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard can be unavailable (e.g. insecure context); the text is still selectable.
    }
  }
  return (
    <button
      onClick={copy}
      className="rounded-lg border border-good/30 bg-white/70 px-3 py-1.5 text-xs font-semibold text-good transition hover:bg-white"
      aria-label="Copy improved line"
    >
      {copied ? 'Copied ✓' : 'Copy'}
    </button>
  )
}

export default function Results({ analysis, fileName, onReset, onAddJobDescription }) {
  const hasJdMatch = typeof analysis.jd_match_score === 'number'
  const tone = scoreTone(analysis.overall_score)

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:py-16">
      <header className="rise mb-10">
        <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-pen uppercase">Your resume review</p>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{tone.label}</h1>
        {fileName && <p className="mt-3 break-all text-muted">{fileName}</p>}
      </header>

      <div className="space-y-6">
        <section className="rise flex flex-col items-center gap-10 rounded-2xl border border-line bg-sheet p-8 sm:flex-row sm:justify-center sm:gap-16" style={{ '--rise-delay': '0.05s' }}>
          <ScoreRing score={analysis.overall_score} label="Overall score" />
          {hasJdMatch ? (
            <ScoreRing score={analysis.jd_match_score} label="Job description match" size={136} />
          ) : (
            <div className="max-w-xs text-center sm:text-left">
              <p className="font-display text-xl font-semibold text-ink">Applying for a specific role?</p>
              <p className="mt-2 text-sm text-ink-soft">Add the job description to see your match score and the keywords you’re missing.</p>
              <button onClick={onAddJobDescription} className="mt-4 text-sm font-semibold text-pen underline decoration-pen/40 underline-offset-4 hover:decoration-pen">
                Add a job description →
              </button>
            </div>
          )}
        </section>

        <div className="rise grid gap-6 md:grid-cols-2" style={{ '--rise-delay': '0.12s' }}>
          <Card title="What’s working" count={analysis.strengths.length}>
            <ul className="space-y-4">
              {analysis.strengths.map((item, i) => (
                <li key={i} className="flex gap-3 leading-relaxed text-ink-soft">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-good-soft text-good" aria-hidden="true">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5"><path d="M5 13 L10 18 L19 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="What to fix" count={analysis.weaknesses.length}>
            <ul className="space-y-4">
              {analysis.weaknesses.map((item, i) => (
                <li key={i} className="flex gap-3 leading-relaxed text-ink-soft">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-warn-soft text-xs font-bold text-warn" aria-hidden="true">
                    !
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {hasJdMatch && analysis.missing_keywords?.length > 0 && (
          <Card title="Missing from your resume" count={`${analysis.missing_keywords.length} keywords`} className="rise">
            <p className="-mt-2 mb-5 text-sm text-muted">Terms from the job description that are missing or weak. Add the ones you genuinely have.</p>
            <div className="flex flex-wrap gap-2">
              {analysis.missing_keywords.map((kw, i) => (
                <span key={i} className="rounded-full border border-warn/30 bg-warn-soft px-3.5 py-1.5 text-sm font-medium text-warn">
                  {kw}
                </span>
              ))}
            </div>
          </Card>
        )}

        {analysis.rewrite_suggestions.length > 0 && (
          <Card title="Line-by-line rewrites" count={analysis.rewrite_suggestions.length} className="rise">
            <p className="-mt-2 mb-6 text-sm text-muted">
              Swap these in. Replace any <span className="font-medium text-ink">[placeholder]</span> with your real number.
            </p>
            <div className="space-y-5">
              {analysis.rewrite_suggestions.map((s, i) => (
                <div key={i} className="grid overflow-hidden rounded-xl border border-line md:grid-cols-2">
                  <div className="bg-paper p-5">
                    <p className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-pen uppercase">Before</p>
                    <p className="text-ink-soft">
                      <PenStrike>{s.original}</PenStrike>
                    </p>
                  </div>
                  <div className="border-t border-line bg-good-soft/70 p-5 md:border-t-0 md:border-l">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-[11px] font-semibold tracking-[0.14em] text-good uppercase">After</p>
                      <CopyButton text={s.improved} />
                    </div>
                    <p className="font-medium text-ink">{s.improved}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <section className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-sheet px-6 py-10 text-center">
          <p className="font-display text-2xl font-semibold text-ink">Made your edits?</p>
          <p className="max-w-md text-ink-soft">Upload the new version to see how far your score moves.</p>
          <button
            onClick={onReset}
            className="group mt-2 inline-flex items-center gap-2 rounded-xl bg-pen px-7 py-3.5 font-semibold text-white shadow-[0_8px_24px_-8px_rgba(200,54,27,0.55)] transition duration-200 hover:-translate-y-0.5 hover:bg-pen-dark"
          >
            Score My Updated Resume
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
        </section>
      </div>
    </div>
  )
}
