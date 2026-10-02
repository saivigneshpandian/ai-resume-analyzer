import { useEffect, useRef, useState } from 'react'
import Landing from './components/Landing'
import LoadingState from './components/LoadingState'
import Results from './components/Results'
import Icon from './components/Icon'
import { analyzeResume, IS_DEMO } from './api'

const YEAR = new Date().getFullYear()

function focusUpload(fieldId = 'resume-dropzone') {
  document.getElementById('analyze')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  setTimeout(() => document.getElementById(fieldId)?.focus({ preventScroll: true }), 350)
}

function Logo({ onClick }) {
  return (
    <button onClick={onClick} className="flex min-h-11 items-center gap-2.5" aria-label="AI Resume Analyzer — home">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white sm:h-9 sm:w-9 sm:rounded-xl">
        <Icon name="file" className="h-5 w-5" />
      </span>
      <span className="font-display text-base font-bold whitespace-nowrap text-ink sm:text-lg">
        Resume Analyzer<span className="hidden text-primary sm:inline"> AI</span>
      </span>
    </button>
  )
}

function SiteHeader({ view, onHome }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-8">
        <Logo onClick={onHome} />
        {view === 'upload' && (
          <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
            <a href="#how-it-works" className="hidden min-h-11 items-center rounded-lg px-3 font-medium text-ink-soft transition-colors hover:text-ink md:inline-flex">
              How it works
            </a>
            <a href="#faq" className="hidden min-h-11 items-center rounded-lg px-3 font-medium text-ink-soft transition-colors hover:text-ink md:inline-flex">
              FAQ
            </a>
            <button
              onClick={() => focusUpload()}
              className="inline-flex min-h-11 items-center rounded-xl bg-primary px-3.5 text-sm font-semibold whitespace-nowrap text-white sm:text-base transition-colors duration-200 hover:bg-primary-dark active:scale-[0.98]"
            >
              Get my score
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}

export default function App() {
  // 'upload' -> 'loading' -> 'results'
  const [view, setView] = useState('upload')
  const [analysis, setAnalysis] = useState(null)
  const [error, setError] = useState(null)
  // Last submission, so the form is pre-filled after an error or "add a JD"
  const [lastInput, setLastInput] = useState(null)
  // Form field to focus once the upload view has rendered
  const pendingFocus = useRef(null)
  // Heading of the loading/results screen; focused on screen change for screen-reader users
  const screenHeading = useRef(null)

  useEffect(() => {
    window.scrollTo({ top: 0 })
    if (view === 'upload') {
      if (pendingFocus.current) {
        focusUpload(pendingFocus.current)
        pendingFocus.current = null
      }
    } else {
      screenHeading.current?.focus({ preventScroll: true })
    }
  }, [view])

  async function handleSubmit({ file, jobDescription }) {
    setLastInput({ file, jobDescription })
    setError(null)
    setView('loading')
    try {
      setAnalysis(await analyzeResume(file, jobDescription))
      setView('results')
    } catch (err) {
      setError(err.message)
      pendingFocus.current = 'resume-dropzone'
      setView('upload')
    }
  }

  function goHome() {
    setAnalysis(null)
    setLastInput(null)
    setError(null)
    setView('upload')
  }

  function scoreUpdatedResume() {
    pendingFocus.current = 'resume-dropzone'
    goHome()
  }

  function addJobDescription() {
    pendingFocus.current = 'jd'
    setView('upload')
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      {IS_DEMO && (
        <p className="border-b border-warn/20 bg-warn-soft px-4 py-2.5 text-center text-sm text-warn">
          <strong className="font-semibold">Preview mode:</strong> any upload shows one saved example — a real Gemini review of a
          fictional student resume against an Agentic AI Engineer job description. Your file is not analyzed.
        </p>
      )}
      <SiteHeader view={view} onHome={goHome} />

      <main id="main" className="flex-1">
        {view === 'upload' && (
          <Landing uploadProps={{ onSubmit: handleSubmit, error, initialInput: lastInput }} onCta={() => focusUpload()} />
        )}
        {view === 'loading' && (
          <LoadingState
            fileName={lastInput?.file.name}
            hasJobDescription={Boolean(lastInput?.jobDescription)}
            headingRef={screenHeading}
          />
        )}
        {view === 'results' && analysis && (
          <Results
            analysis={analysis}
            fileName={lastInput?.file.name}
            onReset={scoreUpdatedResume}
            onAddJobDescription={addJobDescription}
            headingRef={screenHeading}
          />
        )}
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {YEAR} AI Resume Analyzer · Recruiter-style feedback, powered by Claude.</p>
          <p className="flex items-center gap-1.5">
            <Icon name="shield" className="h-4 w-4 text-success" />
            Your resume is analyzed in memory and never saved.
          </p>
        </div>
      </footer>
    </div>
  )
}
