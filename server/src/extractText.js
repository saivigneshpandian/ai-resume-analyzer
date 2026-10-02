import { PDFParse } from 'pdf-parse'
import { getData as getPdfWorker } from 'pdf-parse/worker'
import mammoth from 'mammoth'

export const SUPPORTED_TYPES = {
  pdf: ['application/pdf'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
}

export class ExtractionError extends Error {}

// Embed pdf.js's worker as a data URL so PDF parsing also works in serverless bundles (Vercel)
PDFParse.setWorker(getPdfWorker())

// Work out the file type from extension + MIME type (browsers sometimes send
// a generic MIME type for DOCX, so the extension is the primary signal).
export function detectFileType(file) {
  const name = file.originalname.toLowerCase()
  if (name.endsWith('.pdf')) return 'pdf'
  if (name.endsWith('.docx')) return 'docx'
  for (const [type, mimes] of Object.entries(SUPPORTED_TYPES)) {
    if (mimes.includes(file.mimetype)) return type
  }
  return null
}

// Collapse the whitespace noise PDF/DOCX extraction leaves behind.
function cleanText(text) {
  return text
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t ]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export async function extractText(buffer, fileType) {
  let raw
  try {
    if (fileType === 'pdf') {
      const parser = new PDFParse({ data: buffer })
      try {
        // Drop pdf-parse's default "-- 1 of N --" page markers
        raw = (await parser.getText({ pageJoiner: '' })).text
      } finally {
        await parser.destroy()
      }
    } else if (fileType === 'docx') {
      raw = (await mammoth.extractRawText({ buffer })).value
    } else {
      throw new ExtractionError('Unsupported file type. Please upload a PDF or DOCX resume.')
    }
  } catch (err) {
    if (err instanceof ExtractionError) throw err
    throw new ExtractionError(`Could not read the ${fileType.toUpperCase()} file. Is it corrupted or password-protected?`)
  }

  const text = cleanText(raw)
  if (text.length < 50) {
    throw new ExtractionError(
      'Could not find enough text in this file. If it is a scanned image, please upload a text-based PDF or DOCX.',
    )
  }
  return text
}
