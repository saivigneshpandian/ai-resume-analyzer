import { useRef, useState } from 'react'
import Icon from './Icon'

const ACCEPTED_EXTENSIONS = ['.pdf', '.docx']
const MAX_SIZE_MB = 4

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

export default function UploadForm({ onSubmit, error, initialInput, ctaText, reassurance = [], submitting = false }) {
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
      document.getElementById('resume-dropzone')?.focus()
      return
    }
    onSubmit({ file, jobDescription: jobDescription.trim() })
  }

  const shownError = fileError || error

  return (
    <form onSubmit={handleSubmit} className="space-y-5" aria-label="Upload your resume" noValidate>
      <div>
        <p id="resume-label" className="mb-2 text-sm font-medium text-ink">
          Resume <span className="font-normal text-muted">· PDF or DOCX, up to {MAX_SIZE_MB} MB</span>
        </p>
        <div
          id="resume-dropzone"
          role="button"
          tabIndex={0}
          aria-labelledby="resume-label"
          aria-describedby={shownError ? 'upload-error' : undefined}
          aria-invalid={Boolean(shownError)}
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
          className={`group flex items-center gap-4 rounded-xl border-2 border-dashed p-5 transition-colors duration-200 ${
            dragActive
              ? 'border-primary bg-primary-soft'
              : shownError
                ? 'border-danger/50 bg-danger-soft/40'
                : file
                  ? 'border-success/40 bg-success-soft'
                  : 'border-line bg-bg hover:border-primary/50 hover:bg-primary-soft/50'
          }`}
        >
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
              file ? 'bg-success text-white' : 'bg-primary-soft text-primary group-hover:bg-primary group-hover:text-white'
            } transition-colors duration-200`}
          >
            <Icon name={file ? 'file' : 'upload'} className="h-6 w-6" />
          </span>
          <span className="min-w-0 flex-1">
            {file ? (
              <>
                <span className="block truncate font-medium text-ink" title={file.name}>
                  {file.name}
                </span>
                <span className="block text-sm text-muted">
                  {Math.max(1, Math.round(file.size / 1024))} KB · <span className="text-primary">Replace file</span>
                </span>
              </>
            ) : (
              <>
                <span className="block font-medium text-ink">
                  <span className="sm:hidden">
                    Tap to <span className="text-primary underline underline-offset-4">choose a file</span>
                  </span>
                  <span className="hidden sm:inline">
                    Drag & drop or <span className="text-primary underline underline-offset-4">browse files</span>
                  </span>
                </span>
                <span className="block text-sm text-muted">Text-based files work best (not scanned images)</span>
              </>
            )}
          </span>
          {file && <Icon name="checkCircle" className="h-6 w-6 text-success" />}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(',')}
          className="hidden"
          onChange={(e) => pickFile(e.target.files?.[0])}
        />
        {shownError && (
          <p id="upload-error" role="alert" className="mt-2 flex items-start gap-2 text-sm text-danger">
            <Icon name="alert" className="mt-0.5 h-4 w-4" />
            {shownError}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="jd" className="mb-2 block text-sm font-medium text-ink">
          Job description <span className="font-normal text-muted">· optional</span>
        </label>
        <textarea
          id="jd"
          rows={3}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description (optional)"
          aria-describedby="jd-help"
          className="block w-full resize-y rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink placeholder:text-muted/80 focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none"
        />
        <p id="jd-help" className="mt-1.5 text-sm text-muted">
          Adds a job-match score and a list of missing keywords.
        </p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-[var(--shadow-cta)] transition duration-200 hover:bg-primary-dark active:scale-[0.98] disabled:opacity-50"
      >
        {ctaText}
        <Icon name="arrowRight" className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </button>

      {reassurance.length > 0 && (
        <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-sm text-muted">
          {reassurance.map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <Icon name="check" className="h-4 w-4 text-success" strokeWidth={2.5} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </form>
  )
}
