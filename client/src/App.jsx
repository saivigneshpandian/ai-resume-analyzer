import { useState } from 'react'
import UploadForm from './components/UploadForm'
import LoadingState from './components/LoadingState'
import Results from './components/Results'
import { mockAnalysis } from './mockData'

export default function App() {
  // 'upload' -> 'loading' -> 'results'
  const [view, setView] = useState('upload')
  const [analysis, setAnalysis] = useState(null)
  const [fileName, setFileName] = useState('')

  function handleSubmit({ file, jobDescription }) {
    setFileName(file.name)
    setView('loading')
    // Mock flow: simulate network latency, then show sample data.
    setTimeout(() => {
      setAnalysis(jobDescription ? mockAnalysis : { ...mockAnalysis, jd_match_score: null, missing_keywords: [] })
      setView('results')
    }, 1500)
  }

  function handleReset() {
    setAnalysis(null)
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
        {view === 'upload' && <UploadForm onSubmit={handleSubmit} />}
        {view === 'loading' && <LoadingState fileName={fileName} />}
        {view === 'results' && analysis && <Results analysis={analysis} onReset={handleReset} />}
      </main>
    </div>
  )
}
