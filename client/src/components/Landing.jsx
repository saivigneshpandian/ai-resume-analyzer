import UploadForm from './UploadForm'
import Icon from './Icon'
import { benefits, faq, finalCta, hero, mechanism, problem } from '../content'

const container = 'mx-auto w-full max-w-6xl px-5 sm:px-8'

function SectionHeading({ eyebrow, title, intro }) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold text-ink sm:text-4xl">{title}</h2>
      {intro && <p className="mt-4 text-lg text-ink-soft">{intro}</p>}
    </div>
  )
}

function Hero({ uploadProps }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-surface">
      {/* Soft grid + glow backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgb(194_65_12/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(194_65_12/0.05)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[880px] -translate-x-1/2 rounded-full bg-accent/15 blur-3xl" />

      <div className={`${container} relative grid grid-cols-1 gap-12 py-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:py-24`}>
        <div className="min-w-0">
          <p className="rise inline-flex items-center gap-2 rounded-2xl border border-primary/20 bg-primary-soft px-3.5 py-1.5 text-sm font-medium text-primary-dark sm:rounded-full">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            {hero.preHeadline}
          </p>
          <h1 className="rise mt-6 text-4xl leading-[1.1] font-extrabold text-ink sm:text-5xl lg:text-[3.5rem]" style={{ '--rise-delay': '40ms' }}>
            {hero.headlineStart} <span className="bg-[linear-gradient(transparent_62%,rgb(249_115_22/0.18)_62%)] text-primary">{hero.headlineMarked}</span> {hero.headlineEnd}
          </h1>
          <p className="rise mt-6 max-w-xl text-lg text-ink-soft" style={{ '--rise-delay': '80ms' }}>
            {hero.subHeadline}
          </p>
          <ul className="rise mt-8 hidden max-w-xl gap-3 sm:grid sm:grid-cols-2" style={{ '--rise-delay': '120ms' }}>
            {['Score out of 100', 'Strengths & weaknesses', 'Line-by-line rewrites', 'Job-match keywords'].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-ink-soft">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success-soft text-success">
                  <Icon name="check" className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div id="analyze" className="rise min-w-0 scroll-mt-24" style={{ '--rise-delay': '160ms' }}>
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-lift)] sm:p-8">
            <h2 className="text-xl font-bold text-ink">Get your resume score</h2>
            <p className="mt-1 mb-6 text-muted">Upload once — score, feedback and rewrites in one go.</p>
            <UploadForm {...uploadProps} ctaText={hero.ctaText} reassurance={hero.reassurance} />
          </div>
        </div>
      </div>
    </section>
  )
}

function Problem() {
  return (
    <section className="py-20 lg:py-28">
      <div className={container}>
        <SectionHeading eyebrow={problem.eyebrow} title="Most resume feedback is slow, shallow or inconsistent" intro={problem.recognition} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {problem.painPoints.map((p) => (
            <article key={p.title} className="rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-card)]">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon name={p.icon} />
              </span>
              <h3 className="mt-5 text-lg font-bold text-ink">{p.title}</h3>
              <p className="mt-2 text-ink-soft">{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 border-y border-line bg-surface py-20 lg:py-28">
      <div className={container}>
        <SectionHeading eyebrow={mechanism.eyebrow} title={`Every resume is scored on ${mechanism.name}`} intro={mechanism.whatItDoes} />

        <ol className="mt-14 grid gap-8 md:grid-cols-3">
          {mechanism.steps.map((step, i) => (
            <li key={step.title}>
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary font-display text-lg font-bold text-white">{i + 1}</span>
                {i < mechanism.steps.length - 1 && <span aria-hidden="true" className="hidden h-px flex-1 bg-line md:block" />}
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink">{step.title}</h3>
              <p className="mt-2 text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 rounded-2xl border border-line bg-bg p-6 sm:p-8">
          <p className="font-semibold text-ink">The four criteria</p>
          <dl className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {mechanism.criteria.map((c) => (
              <div key={c.name} className="flex gap-3">
                <Icon name="checkCircle" className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <dt className="font-semibold text-ink">{c.name}</dt>
                  <dd className="mt-1 text-ink-soft">{c.detail}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

// Static, clearly-labelled preview of the report layout (uses the prompt's few-shot example, not a user result).
function ExampleReport() {
  return (
    <figure className="min-w-0 rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-lift)]" aria-label="Example report preview">
      <figcaption className="flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">Example report</span>
        <span className="rounded-full bg-bg px-2.5 py-1 text-xs font-medium text-muted">Illustration</span>
      </figcaption>
      <div className="mt-5 flex items-center gap-5 rounded-xl bg-bg p-4">
        <div className="relative h-16 w-16 shrink-0">
          <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90" aria-hidden="true">
            <circle cx="32" cy="32" r="27" strokeWidth="7" fill="none" className="stroke-line" />
            <circle cx="32" cy="32" r="27" strokeWidth="7" fill="none" strokeLinecap="round" strokeDasharray="169.6" strokeDashoffset="47.5" className="stroke-warn" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-display text-lg font-bold text-ink">72</span>
        </div>
        <div>
          <p className="font-semibold text-ink">Solid — needs sharpening</p>
          <p className="text-sm text-muted">Overall score out of 100</p>
        </div>
      </div>
      <ul className="mt-4 space-y-2.5 text-sm">
        <li className="flex gap-2 text-ink-soft"><Icon name="checkCircle" className="h-4 w-4 text-success" /> Clear structure that’s quick to scan</li>
        <li className="flex gap-2 text-ink-soft"><Icon name="alert" className="h-4 w-4 text-warn" /> Bullets describe duties, not results</li>
      </ul>
      <div className="mt-5 overflow-hidden rounded-xl border border-line text-sm">
        <p className="bg-danger-soft/60 px-4 py-3 text-ink-soft">
          <span className="mr-2 font-semibold text-danger">Before</span>
          <span className="line-through decoration-danger/60">Worked on backend development.</span>
        </p>
        <p className="border-t border-line bg-success-soft px-4 py-3 text-ink">
          <span className="mr-2 font-semibold text-success">After</span>
          Built and shipped 4 REST API endpoints in Node.js, reducing average response time by 35%.
        </p>
      </div>
    </figure>
  )
}

function Benefits({ onCta }) {
  return (
    <section className="py-20 lg:py-28">
      <div className={`${container} grid gap-14 lg:grid-cols-2 lg:items-center`}>
        <div className="min-w-0">
          <SectionHeading eyebrow={benefits.eyebrow} title={benefits.heading} />
          <div className="mt-10 space-y-7">
            {benefits.items.map((b) => (
              <div key={b.title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon name={b.icon} />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-ink">{b.title}</h3>
                  <p className="mt-1 text-ink-soft">{b.feature}</p>
                  <p className="mt-1 text-muted">{b.benefit}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={onCta}
            className="group mt-10 inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-[var(--shadow-cta)] transition duration-200 hover:bg-primary-dark active:scale-[0.98]"
          >
            {hero.ctaText}
            <Icon name="arrowRight" className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
        <ExampleReport />
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-line bg-surface py-20 lg:py-28">
      <div className={`${container} grid gap-12 lg:grid-cols-[1fr_1.6fr]`}>
        <SectionHeading eyebrow={faq.eyebrow} title={faq.heading} />
        <div className="divide-y divide-line rounded-2xl border border-line">
          {faq.items.map((item) => (
            <details key={item.question} className="group px-5 sm:px-6">
              <summary className="flex min-h-14 list-none items-center justify-between gap-6 py-4 text-left font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {item.question}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg text-primary transition-transform duration-200 group-open:rotate-45">
                  <Icon name="plus" className="h-4 w-4" />
                </span>
              </summary>
              <p className="pb-5 text-ink-soft">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCta({ onCta }) {
  return (
    <section className="py-20">
      <div className={container}>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-dark px-6 py-14 text-center sm:px-12 sm:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[640px] -translate-x-1/2 rounded-full bg-accent/50 blur-3xl" />
          <h2 className="relative mx-auto max-w-3xl text-3xl font-bold text-white sm:text-4xl">{finalCta.heading}</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/90">{finalCta.body}</p>
          <button
            onClick={onCta}
            className="group relative mt-9 inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-primary-dark shadow-lg transition duration-200 hover:bg-primary-soft active:scale-[0.98]"
          >
            {finalCta.ctaText}
            <Icon name="arrowRight" className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
          <p className="relative mt-4 text-sm text-white/85">{finalCta.microCta}</p>
        </div>
      </div>
    </section>
  )
}

export default function Landing({ uploadProps, onCta }) {
  return (
    <>
      <Hero uploadProps={uploadProps} />
      <Problem />
      <HowItWorks />
      <Benefits onCta={onCta} />
      <Faq />
      <FinalCta onCta={onCta} />
    </>
  )
}
