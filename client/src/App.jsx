import { useEffect, useRef, useState } from 'react'
import Landing from './components/Landing'
import LoadingState from './components/LoadingState'
import Results from './components/Results'
import { analyzeResume } from './api'

function focusUpload(fieldId = 'resume-dropzone') {
  document.getElementById('analyze')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  setTimeout(() => document.getElementById(fieldId)?.focus({ preventScroll: true }), 400)
}

function SiteHeader({ view, onHome }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <button onClick={onHome} className="flex items-center gap-2.5" aria-label="AI Resume Analyzer home">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink font-display text-lg font-semibold text-paper italic">R</span>
          <span className="font-display text-lg font-semibold whitespace-nowrap text-ink">
            Resume Analyzer <span className="font-sans text-xs font-medium text-pen">AI</span>
          </span>
        </button>
        {view === 'upload' && (
          <nav className="flex items-center gap-6 text-sm font-medium text-ink-soft">
            <a href="#how-it-works" className="hidden hover:text-ink sm:inline">How it works</a>
            <a href="#faq" className="hidden hover:text-ink sm:inline">FAQ</a>
            <button onClick={() => focusUpload()} className="rounded-lg bg-ink px-3.5 py-2 whitespace-nowrap text-paper transition hover:bg-pen sm:px-4">
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

  useEffect(() => {
    window.scrollTo({ top: 0 })
    if (view === 'upload' && pendingFocus.current) {
      focusUpload(pendingFocus.current)
      pendingFocus.current = null
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
      setView('upload')
      pendingFocus.current = 'resume-dropzone'
    }
  }

  function goHome() {
    setAnalysis(null)
    setLastInput(null)
    setError(null)
    setView('upload')
  }

  function scoreUpdatedResume() {
    goHome()
    pendingFocus.current = 'resume-dropzone'
  }

  function addJobDescription() {
    setView('upload')
    pendingFocus.current = 'jd'
  }

  return (
    <div className="min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <SiteHeader view={view} onHome={goHome} />

      <main id="main">
        {view === 'upload' && (
          <Landing uploadProps={{ onSubmit: handleSubmit, error, initialInput: lastInput }} onCta={() => focusUpload()} />
        )}
        {view === 'loading' && (
          <LoadingState fileName={lastInput?.file.name} hasJobDescription={Boolean(lastInput?.jobDescription)} />
        )}
        {view === 'results' && analysis && (
          <Results
            analysis={analysis}
            fileName={lastInput?.file.name}
            onReset={scoreUpdatedResume}
            onAddJobDescription={addJobDescription}
          />
        )}
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>AI Resume Analyzer — recruiter-style feedback, powered by Claude.</p>
          <p>Your resume is analyzed in memory and never saved.</p>
        </div>
      </footer>
    </div>
  )
}
