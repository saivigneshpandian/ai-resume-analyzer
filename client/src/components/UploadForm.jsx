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

export default function UploadForm({ onSubmit, error, initialInput }) {
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition ${
          dragActive
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-slate-50'
        }`}
      >
        <svg className="mb-3 h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V3m0 0L7.5 7.5M12 3l4.5 4.5M3 15v3.75A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V15" />
        </svg>
        {file ? (
          <>
            <p className="font-medium text-slate-900">{file.name}</p>
            <p className="mt-1 text-sm text-slate-500">
              {(file.size / 1024).toFixed(0)} KB · click or drop to replace
            </p>
          </>
        ) : (
          <>
            <p className="font-medium text-slate-900">
              Drag & drop your resume here, or <span className="text-indigo-600">browse</span>
            </p>
            <p className="mt-1 text-sm text-slate-500">PDF or DOCX, up to {MAX_SIZE_MB} MB</p>
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
        <label htmlFor="jd" className="mb-2 block text-sm font-medium text-slate-700">
          Job description <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          id="jd"
          rows={6}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description (optional)"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
        />
      </div>

      {shownError && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {shownError}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 focus:outline-none disabled:opacity-50"
      >
        Analyze Resume
      </button>
    </form>
  )
}
