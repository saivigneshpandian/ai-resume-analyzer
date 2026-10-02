import UploadForm from './UploadForm'
import { PenStrike, PenTick, PenUnderline } from './PenMark'
import { benefits, faq, finalCta, hero, mechanism, problem } from '../content'

function Eyebrow({ children }) {
  return <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-pen uppercase">{children}</p>
}

// Illustrative markup of one resume line (the few-shot example from the prompt), not a user result.
function MarkedUpLine() {
  return (
    <figure className="rise relative max-w-md rotate-[-1deg] rounded-lg border border-line bg-sheet p-5 shadow-[0_18px_40px_-24px_rgba(28,27,25,0.35)]" style={{ '--rise-delay': '0.35s' }}>
      <figcaption className="mb-3 flex items-center justify-between text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
        <span>Example rewrite</span>
        <span className="rounded-full bg-pen-soft px-2 py-0.5 text-pen">Impact</span>
      </figcaption>
      <p className="text-sm text-muted">
        <PenStrike>Worked on backend development.</PenStrike>
      </p>
      <p className="mt-3 font-display text-[17px] leading-snug text-ink italic">
        “Built and shipped 4 REST API endpoints in Node.js, reducing average response time by 35%.”
      </p>
      <span aria-hidden="true" className="absolute -right-3 -bottom-3 rotate-[-4deg] rounded-md bg-pen px-2 py-1 font-display text-sm font-semibold text-white italic shadow">
        Show results!
      </span>
    </figure>
  )
}

function Hero({ uploadProps }) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 pt-12 pb-20 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16 lg:pt-20 lg:pb-28">
        <div className="min-w-0">
          <p className="rise mb-5 inline-flex items-center gap-2 rounded-2xl sm:rounded-full border border-line bg-sheet px-3 py-1 text-xs font-medium text-ink-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-pen" aria-hidden="true" />
            {hero.preHeadline}
          </p>
          <h1 className="rise font-display text-[2.4rem] leading-[1.08] font-semibold tracking-tight text-ink sm:text-6xl" style={{ '--rise-delay': '0.08s' }}>
            {hero.headlineStart} <PenUnderline>{hero.headlineMarked}</PenUnderline> {hero.headlineEnd}
          </h1>
          <p className="rise mt-6 max-w-xl text-lg leading-relaxed text-ink-soft" style={{ '--rise-delay': '0.16s' }}>
            {hero.subHeadline}
          </p>
          <div className="mt-10 hidden lg:block">
            <MarkedUpLine />
          </div>
        </div>

        <div id="analyze" className="rise min-w-0 scroll-mt-24" style={{ '--rise-delay': '0.22s' }}>
          <div className="rounded-2xl border border-line bg-sheet p-6 shadow-[0_30px_60px_-30px_rgba(28,27,25,0.35)] sm:p-8">
            <div className="mb-6">
              <h2 className="font-display text-2xl font-semibold text-ink">Get your resume score</h2>
              <p className="mt-1 text-sm text-muted">Upload once. Score, feedback and rewrites in one go.</p>
            </div>
            <UploadForm {...uploadProps} ctaText={hero.ctaText} reassurance={hero.reassurance} />
          </div>
        </div>
      </div>
    </section>
  )
}

function Problem() {
  return (
    <section className="border-y border-line bg-sheet/70">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-24">
        <Eyebrow>{problem.eyebrow}</Eyebrow>
        <p className="max-w-3xl font-display text-2xl leading-snug text-ink sm:text-[2rem]">{problem.recognition}</p>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {problem.painPoints.map((p, i) => (
            <div key={p.title} className="bg-sheet p-7">
              <p className="font-display text-sm text-pen italic">0{i + 1}</p>
              <h3 className="mt-2 text-lg font-semibold text-ink">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
        <div>
          <Eyebrow>{mechanism.eyebrow}</Eyebrow>
          <h2 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Scored on <PenUnderline delay="0s">{mechanism.name}</PenUnderline>
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">{mechanism.whatItDoes}</p>
          <ol className="mt-10 space-y-6">
            {mechanism.steps.map((step, i) => (
              <li key={step.title} className="flex gap-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink font-display text-base font-semibold text-ink">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-ink">{step.title}</h3>
                  <p className="mt-1 text-ink-soft">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="self-center rounded-2xl border border-line bg-sheet p-7 sm:p-9">
          <p className="mb-6 text-xs font-semibold tracking-[0.18em] text-muted uppercase">The rubric</p>
          <ul className="divide-y divide-line">
            {mechanism.criteria.map((c) => (
              <li key={c.name} className="flex items-start gap-4 py-5 first:pt-0 last:pb-0">
                <PenTick className="mt-1 text-pen" />
                <div>
                  <p className="font-display text-xl font-semibold text-ink">{c.name}</p>
                  <p className="mt-1 text-ink-soft">{c.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Benefits() {
  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 lg:py-28">
        <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-[#f08a70] uppercase">{benefits.eyebrow}</p>
        <h2 className="max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">{benefits.heading}</h2>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {benefits.items.map((b) => (
            <article key={b.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 transition duration-300 hover:-translate-y-1 hover:border-white/25">
              <h3 className="font-display text-2xl font-semibold">{b.title}</h3>
              <p className="mt-3 text-paper/90">{b.feature}</p>
              <p className="mt-3 leading-relaxed text-paper/60">{b.benefit}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section id="faq" className="scroll-mt-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1fr_1.6fr] lg:py-28">
        <div>
          <Eyebrow>{faq.eyebrow}</Eyebrow>
          <h2 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{faq.heading}</h2>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {faq.items.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-ink [&::-webkit-details-marker]:hidden">
                {item.question}
                <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-pen transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCta({ onCta }) {
  return (
    <section className="px-5 pb-20 sm:px-8">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-pen px-6 py-16 text-center text-white sm:px-12 sm:py-20">
        <svg aria-hidden="true" viewBox="0 0 400 400" className="absolute -top-24 -right-24 h-80 w-80 text-white/10">
          <circle cx="200" cy="200" r="160" fill="none" stroke="currentColor" strokeWidth="18" />
        </svg>
        <h2 className="relative mx-auto max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">{finalCta.heading}</h2>
        <p className="relative mx-auto mt-5 max-w-xl text-lg text-white/85">{finalCta.body}</p>
        <button
          onClick={onCta}
          className="group relative mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-pen shadow-lg transition duration-200 hover:-translate-y-0.5"
        >
          {finalCta.ctaText}
          <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </button>
        <p className="relative mt-4 text-sm text-white/75">{finalCta.microCta}</p>
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
      <Benefits />
      <Faq />
      <FinalCta onCta={onCta} />
    </>
  )
}
