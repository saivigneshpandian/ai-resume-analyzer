import { useRef, useState } from 'react'

const ACCEPTED_EXTENSIONS = ['.pdf', '.docx']
const MAX_SIZE_MB = 5

function validateFile(file) {
  const name = file.name.toLowerCase()
  if (!ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext))) {
    return 'Unsupported file type. Please upload a PDF or DOCX resume.'
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return `File is too large. Maximum size is ${MAX_SIZE_MB} MB.`
  }
  return null
}

export default function UploadForm({ onSubmit, error, initialInput, ctaText, reassurance = [] }) {
  const [file, setFile] = useState(initialInput?.file ?? null)
  const [jobDescription, setJobDescription] = useState(initialInput?.jobDescription ?? '')
  const [dragActive, setDragActive] = useState(false)
  const [fileError, setFileError] = useState(null)
  const inputRef = useRef(null)

  function pickFile(selected) {
    if (!selected) return
    const problem = validateFile(selected)
    setFileError(problem)
    setFile(problem ? null : selected)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragActive(false)
    pickFile(e.dataTransfer.files?.[0])
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!file) {
      setFileError((current) => current || 'Please choose a resume file first.')
      return
    }
    onSubmit({ file, jobDescription: jobDescription.trim() })
  }

  const shownError = fileError || error

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-label="Upload your resume">
      <div
        id="resume-dropzone"
        role="button"
        tabIndex={0}
        aria-label={file ? `Selected file ${file.name}. Press to choose a different file.` : 'Choose a resume file'}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-9 text-center transition duration-200 ${
          dragActive
            ? 'border-pen bg-pen-soft'
            : file
              ? 'border-good/50 bg-good-soft/60'
              : 'border-line bg-paper/60 hover:border-pen/60 hover:bg-pen-soft/40'
        }`}
      >
        {file ? (
          <>
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-good text-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path d="M5 13 L10 18 L19 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="font-medium break-all text-ink">{file.name}</p>
            <p className="mt-1 text-sm text-muted">{Math.max(1, Math.round(file.size / 1024))} KB · click to replace</p>
          </>
        ) : (
          <>
            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-ink text-paper transition group-hover:bg-pen">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path d="M12 16V4m0 0L7 9m5-5 5 5M4 16v2.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="font-medium text-ink">
              Drop your resume here or <span className="text-pen underline decoration-pen/40 underline-offset-4">browse</span>
            </p>
            <p className="mt-1 text-sm text-muted">PDF or DOCX · up to {MAX_SIZE_MB} MB</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(',')}
          className="hidden"
          onChange={(e) => pickFile(e.target.files?.[0])}
        />
      </div>

      <div>
        <label htmlFor="jd" className="mb-2 flex items-baseline justify-between text-sm font-medium text-ink">
          Job description
          <span className="font-normal text-muted">optional · adds a match score</span>
        </label>
        <textarea
          id="jd"
          rows={3}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description (optional)"
          className="w-full resize-y rounded-xl border border-line bg-sheet px-4 py-3 text-sm text-ink placeholder:text-muted/70 focus:border-pen focus:ring-2 focus:ring-pen/20 focus:outline-none"
        />
      </div>

      {shownError && (
        <p role="alert" className="rounded-xl border border-pen/30 bg-pen-soft px-4 py-3 text-sm text-pen-dark">
          {shownError}
        </p>
      )}

      <button
        type="submit"
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-pen px-6 py-4 text-base font-semibold text-white shadow-[0_8px_24px_-8px_rgba(200,54,27,0.55)] transition duration-200 hover:-translate-y-0.5 hover:bg-pen-dark active:translate-y-0"
      >
        {ctaText}
        <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>
      </button>

      {reassurance.length > 0 && (
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted">
          {reassurance.map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-good" aria-hidden="true">
                <path d="M5 13 L10 18 L19 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {item}
            </li>
          ))}
        </ul>
      )}
    </form>
  )
}
