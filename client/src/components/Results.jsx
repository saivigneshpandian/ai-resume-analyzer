import ScoreRing from './ScoreRing'

function Section({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  )
}

function CheckIcon() {
  return (
    <svg className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
  )
}

export default function Results({ analysis, onReset }) {
  const hasJdMatch = typeof analysis.jd_match_score === 'number'

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-center gap-12 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <ScoreRing score={analysis.overall_score} label="Overall score" />
        {hasJdMatch && <ScoreRing score={analysis.jd_match_score} label="Job description match" size={130} />}
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Strengths">
          <ul className="space-y-3">
            {analysis.strengths.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <CheckIcon />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Weaknesses">
          <ul className="space-y-3">
            {analysis.weaknesses.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <WarningIcon />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {hasJdMatch && analysis.missing_keywords?.length > 0 && (
        <Section title="Missing or weak keywords">
          <div className="flex flex-wrap gap-2">
            {analysis.missing_keywords.map((kw, i) => (
              <span key={i} className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm text-amber-800">
                {kw}
              </span>
            ))}
          </div>
        </Section>
      )}

      {analysis.rewrite_suggestions.length > 0 && (
        <Section title="Rewrite suggestions">
          <div className="space-y-4">
            {analysis.rewrite_suggestions.map((s, i) => (
              <div key={i} className="grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                  <p className="mb-1 text-xs font-semibold tracking-wide text-red-600 uppercase">Before</p>
                  <p className="text-sm text-slate-700">{s.original}</p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                  <p className="mb-1 text-xs font-semibold tracking-wide text-emerald-700 uppercase">After</p>
                  <p className="text-sm text-slate-800">{s.improved}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <div className="flex justify-center pt-2">
        <button
          onClick={onReset}
          className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
        >
          Analyze another resume
        </button>
      </div>
    </div>
  )
}
