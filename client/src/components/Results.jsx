import { useState } from 'react'
import Icon from './Icon'
import ScoreRing from './ScoreRing'
import { scoreTone } from './scoreTone'

function Card({ title, icon, iconClass, count, children, className = '' }) {
  return (
    <section className={`rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8 ${className}`}>
      <div className="mb-6 flex items-center gap-3">
        {icon && (
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}>
            <Icon name={icon} />
          </span>
        )}
        <h2 className="text-xl font-bold text-ink">{title}</h2>
        {count != null && <span className="ml-auto rounded-full bg-bg px-2.5 py-1 text-sm font-medium whitespace-nowrap text-muted">{count}</span>}
      </div>
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
      className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-line bg-surface px-3 text-sm font-semibold text-ink-soft transition-colors duration-200 hover:border-primary/40 hover:text-primary active:scale-[0.98]"
    >
      <Icon name={copied ? 'check' : 'copy'} className={`h-4 w-4 ${copied ? 'text-success' : ''}`} />
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  )
}

export default function Results({ analysis, fileName, onReset, onAddJobDescription, headingRef }) {
  const hasJdMatch = typeof analysis.jd_match_score === 'number'
  const tone = scoreTone(analysis.overall_score)

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 lg:py-14">
      <header className="rise mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-primary">Your resume review</p>
          <h1 ref={headingRef} tabIndex={-1} className="mt-2 text-3xl font-extrabold text-ink focus:outline-none sm:text-4xl">
            {tone.label}
          </h1>
          {fileName && (
            <p className="mt-2 flex items-center gap-2 text-muted">
              <Icon name="file" className="h-4 w-4" />
              <span className="truncate">{fileName}</span>
            </p>
          )}
        </div>
        <button
          onClick={onReset}
          className="inline-flex min-h-11 items-center gap-2 self-start rounded-xl border border-line bg-surface px-4 font-semibold text-ink-soft transition-colors duration-200 hover:border-primary/40 hover:text-primary sm:self-auto"
        >
          <Icon name="refresh" className="h-4 w-4" />
          Analyze another resume
        </button>
      </header>

      <div className="space-y-6">
        <section
          className="rise grid items-center gap-8 rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8 md:grid-cols-[auto_1fr]"
          style={{ '--rise-delay': '40ms' }}
        >
          <div className="flex flex-wrap justify-center gap-10">
            <ScoreRing score={analysis.overall_score} label="Overall score" />
            {hasJdMatch && <ScoreRing score={analysis.jd_match_score} label="Job match" size={136} />}
          </div>
          <div className="md:border-l md:border-line md:pl-8">
            <p className="font-semibold text-ink">What this means</p>
            <p className="mt-2 text-ink-soft">
              Scored on clarity, impact and consistency{hasJdMatch ? ', plus how well you match the job description' : ''}. Fix the
              items under <strong className="font-semibold text-ink">What to fix</strong> first, then swap in the rewrites below.
            </p>
            {!hasJdMatch && (
              <button
                onClick={onAddJobDescription}
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary-soft px-4 font-semibold text-primary transition-colors duration-200 hover:bg-primary hover:text-white"
              >
                <Icon name="target" className="h-4 w-4" />
                Add a job description for a match score
              </button>
            )}
          </div>
        </section>

        <div className="rise grid gap-6 md:grid-cols-2" style={{ '--rise-delay': '80ms' }}>
          <Card title="What’s working" icon="checkCircle" iconClass="bg-success-soft text-success" count={analysis.strengths.length}>
            <ul className="space-y-4">
              {analysis.strengths.map((item, i) => (
                <li key={i} className="flex gap-3 text-ink-soft">
                  <Icon name="check" className="mt-1 h-4 w-4 text-success" strokeWidth={3} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title="What to fix" icon="alert" iconClass="bg-warn-soft text-warn" count={analysis.weaknesses.length}>
            <ul className="space-y-4">
              {analysis.weaknesses.map((item, i) => (
                <li key={i} className="flex gap-3 text-ink-soft">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warn" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {hasJdMatch && analysis.missing_keywords?.length > 0 && (
          <Card title="Missing keywords" icon="target" iconClass="bg-primary-soft text-primary" count={analysis.missing_keywords.length} className="rise">
            <p className="-mt-2 mb-5 text-muted">Terms from the job description that are missing or weak. Add the ones you genuinely have.</p>
            <ul className="flex flex-wrap gap-2">
              {analysis.missing_keywords.map((kw, i) => (
                <li key={i} className="rounded-lg border border-line bg-bg px-3 py-1.5 text-sm font-medium text-ink">
                  {kw}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {analysis.rewrite_suggestions.length > 0 && (
          <Card title="Suggested rewrites" icon="edit" iconClass="bg-primary-soft text-primary" count={analysis.rewrite_suggestions.length} className="rise">
            <p className="-mt-2 mb-6 text-muted">
              Replace any <span className="font-medium text-ink">[placeholder]</span> with your real number before using a line.
            </p>
            <div className="space-y-4">
              {analysis.rewrite_suggestions.map((s, i) => (
                <div key={i} className="grid overflow-hidden rounded-xl border border-line md:grid-cols-2">
                  <div className="bg-bg p-5">
                    <p className="mb-2 text-sm font-semibold text-danger">Before</p>
                    <p className="text-ink-soft line-through decoration-danger/50">{s.original}</p>
                  </div>
                  <div className="border-t border-line bg-success-soft/60 p-5 md:border-t-0 md:border-l">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-success">After</p>
                      <CopyButton text={s.improved} />
                    </div>
                    <p className="font-medium text-ink">{s.improved}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <section className="flex flex-col items-center gap-3 rounded-2xl bg-gradient-to-br from-primary to-primary-dark px-6 py-12 text-center">
          <h2 className="text-2xl font-bold text-white">Made your edits?</h2>
          <p className="max-w-md text-white/90">Upload the new version to see how far your score moves.</p>
          <button
            onClick={onReset}
            className="group mt-3 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-7 py-3 font-semibold text-primary-dark transition duration-200 hover:bg-primary-soft active:scale-[0.98]"
          >
            Score My Updated Resume
            <Icon name="arrowRight" className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </section>
      </div>
    </div>
  )
}
