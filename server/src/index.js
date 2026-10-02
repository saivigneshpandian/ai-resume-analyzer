import express from 'express'
import cors from 'cors'
import multer from 'multer'
import { detectFileType, extractText, ExtractionError } from './extractText.js'
import { analyzeResume, AnalysisError, PROVIDER } from './analyze.js'
import { mockAnalysis } from './mockAnalysis.js'

const PORT = process.env.PORT || 5000
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const MAX_JD_LENGTH = 20000
// MOCK_LLM=true skips the Claude call and returns canned data (UI work without an API key)
const MOCK_LLM = process.env.MOCK_LLM === 'true'

const app = express()
app.use(cors())

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: MAX_FILE_SIZE } })

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.post('/api/analyze', upload.single('resume'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded. Use the "resume" form field.' })
    }
    const fileType = detectFileType(req.file)
    if (!fileType) {
      return res.status(415).json({ error: 'Unsupported file type. Please upload a PDF or DOCX resume.' })
    }
    const jobDescription = (req.body.jobDescription || '').trim()
    if (jobDescription.length > MAX_JD_LENGTH) {
      return res.status(400).json({ error: `Job description is too long (max ${MAX_JD_LENGTH} characters).` })
    }

    const resumeText = await extractText(req.file.buffer, fileType)
    console.log(`[analyze] ${req.file.originalname} (${fileType}) -> ${resumeText.length} chars extracted`)
    console.log(resumeText.slice(0, 500) + (resumeText.length > 500 ? '\n…' : ''))

    const started = Date.now()
    const analysis = MOCK_LLM ? mockAnalysis(Boolean(jobDescription)) : await analyzeResume(resumeText, jobDescription)
    console.log(`[analyze] done in ${((Date.now() - started) / 1000).toFixed(1)}s`)
    console.log(JSON.stringify(analysis, null, 2))
    res.json(analysis)
  } catch (err) {
    next(err)
  }
})

// Central error handler: turn known errors into clean JSON, never crash.
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE' ? 'File is too large. Maximum size is 5 MB.' : `Upload error: ${err.message}`
    return res.status(400).json({ error: message })
  }
  if (err instanceof AnalysisError) {
    return res.status(err.status).json({ error: err.message })
  }
  if (err instanceof ExtractionError) {
    return res.status(422).json({ error: err.message })
  }
  console.error(err)
  res.status(500).json({ error: 'Something went wrong while analyzing the resume. Please try again.' })
})

app.listen(PORT, () => {
  console.log(`Resume Analyzer API listening on http://localhost:${PORT} (${MOCK_LLM ? 'MOCK_LLM mode' : `LLM: ${PROVIDER}`})`)
})
