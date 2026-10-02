import { ApiError, FinishReason, GoogleGenAI } from '@google/genai'
import { AnalysisError } from '../errors.js'

// Pinned version for consistent scores between runs; fast enough for the ~10-15 s target.
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash'
// Tried in order when the main model is overloaded (429/5xx), so a demand spike doesn't fail the request.
const FALLBACK_MODELS = (process.env.GEMINI_FALLBACK_MODELS ?? 'gemini-flash-latest,gemini-flash-lite-latest')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean)
const RETRYABLE = new Set([429, 500, 503, 504])

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let client

export async function generateWithGemini({ system, user, schema }) {
  if (!process.env.GEMINI_API_KEY) {
    throw new AnalysisError('The server is missing GEMINI_API_KEY. Add it to server/.env and restart.', 500)
  }
  client ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

  const request = (model) =>
    client.models.generateContent({
      model,
      contents: user,
      config: {
        systemInstruction: system,
        // Structured output: the reply must be JSON matching the schema
        responseMimeType: 'application/json',
        responseJsonSchema: schema,
        maxOutputTokens: 16000,
      },
    })

  let response
  let lastError
  const models = [MODEL, ...FALLBACK_MODELS.filter((m) => m !== MODEL)]
  for (const [i, model] of models.entries()) {
    try {
      response = await request(model)
      break
    } catch (err) {
      lastError = err
      if (!(err instanceof ApiError) || !RETRYABLE.has(err.status) || i === models.length - 1) break
      console.warn(`[analyze] ${model} unavailable (${err.status}); trying ${models[i + 1]}`)
      await sleep(800 * (i + 1))
    }
  }

  if (!response) {
    const err = lastError
    if (err instanceof ApiError) {
      console.error('[analyze] Gemini API error', err.status, err.message)
      if (err.status === 401 || err.status === 403 || (err.status === 400 && /api key/i.test(err.message))) {
        throw new AnalysisError('The server’s Gemini API key was rejected. Check GEMINI_API_KEY.', 500)
      }
      if (RETRYABLE.has(err.status)) {
        throw new AnalysisError('The AI service is busy right now. Please try again in a minute.', 503)
      }
      throw new AnalysisError('The AI service returned an error. Please try again.')
    }
    console.error('[analyze] Gemini request failed', err)
    throw new AnalysisError('Could not reach the AI service. Please try again.', 503)
  }

  if (response.promptFeedback?.blockReason) {
    throw new AnalysisError('The AI declined to analyze this document. Please check it is a resume.', 422)
  }
  const finish = response.candidates?.[0]?.finishReason
  if (finish === FinishReason.SAFETY) {
    throw new AnalysisError('The AI declined to analyze this document. Please check it is a resume.', 422)
  }
  if (finish === FinishReason.MAX_TOKENS) {
    throw new AnalysisError('The analysis was cut off before it finished. Please try again.')
  }
  const usage = response.usageMetadata ?? {}
  console.log(
    `[analyze] gemini model=${response.modelVersion ?? MODEL} in=${usage.promptTokenCount} out=${usage.candidatesTokenCount} thinking=${usage.thoughtsTokenCount ?? 0}`,
  )
  return response.text ?? ''
}
