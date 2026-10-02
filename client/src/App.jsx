import { useState } from 'react'
import UploadForm from './components/UploadForm'
import LoadingState from './components/LoadingState'
import Results from './components/Results'
import { analyzeResume } from './api'

export default function App() {
  // 'upload' -> 'loading' -> 'results'
  const [view, setView] = useState('upload')
  const [analysis, setAnalysis] = useState(null)
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState(null)
  // Last submission, so the form is pre-filled if the request fails
  const [lastInput, setLastInput] = useState(null)

  async function handleSubmit({ file, jobDescription }) {
    setFileName(file.name)
    setLastInput({ file, jobDescription })
    setError(null)
    setView('loading')
    try {
      setAnalysis(await analyzeResume(file, jobDescription))
      setView('results')
    } catch (err) {
      setError(err.message)
      setView('upload')
    }
  }

  function handleReset() {
    setAnalysis(null)
    setLastInput(null)
    setView('upload')
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-5">
          <h1 className="text-xl font-bold text-slate-900">AI Resume Analyzer</h1>
          <p className="text-sm text-slate-500">Instant, structured, recruiter-style feedback on your resume.</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        {view === 'upload' && <UploadForm onSubmit={handleSubmit} error={error} initialInput={lastInput} />}
        {view === 'loading' && <LoadingState fileName={fileName} />}
        {view === 'results' && analysis && <Results analysis={analysis} onReset={handleReset} />}
      </main>
    </div>
  )
}
