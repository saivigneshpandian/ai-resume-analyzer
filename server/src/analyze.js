import Anthropic from '@anthropic-ai/sdk'
import { ANALYSIS_SCHEMA, SYSTEM_PROMPT, buildUserMessage } from './prompt.js'

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-5-5'
// 'low' keeps responses inside the brief's ~10-15 s target; raise for deeper reviews.
const EFFORT = process.env.ANTHROPIC_EFFORT || 'low'

let client
function getClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new AnalysisError('The server is missing ANTHROPIC_API_KEY. Add it to server/.env and restart.', 500)
  }
  client ??= new Anthropic()
  return client
}

export class AnalysisError extends Error {
  constructor(message, status = 502) {
    super(message)
    this.status = status
  }
}

const clampScore = (n) => Math.max(0, Math.min(100, Math.round(n)))
const cleanList = (items, max) =>
  items
    .map((s) => (typeof s === 'string' ? s.trim() : ''))
    .filter(Boolean)
    .slice(0, max)

// Step 5 of the architecture: parse + validate the model's JSON before it
// reaches the UI. Structured outputs guarantee the shape; this enforces the
// ranges and list sizes the schema can't express.
export function validateAnalysis(data, hasJobDescription) {
  if (!data || typeof data !== 'object') throw new AnalysisError('The model returned an empty analysis.')
  const required = ['overall_score', 'strengths', 'weaknesses', 'rewrite_suggestions']
  for (const key of required) {
    if (data[key] === undefined) throw new AnalysisError(`The model's analysis is missing "${key}".`)
  }
  if (typeof data.overall_score !== 'number') throw new AnalysisError('The model returned an invalid score.')

  return {
    overall_score: clampScore(data.overall_score),
    jd_match_score:
      hasJobDescription && typeof data.jd_match_score === 'number' ? clampScore(data.jd_match_score) : null,
    strengths: cleanList(data.strengths ?? [], 5),
    weaknesses: cleanList(data.weaknesses ?? [], 5),
    missing_keywords: hasJobDescription ? cleanList(data.missing_keywords ?? [], 15) : [],
    rewrite_suggestions: (data.rewrite_suggestions ?? [])
      .filter((s) => s && typeof s.original === 'string' && typeof s.improved === 'string')
      .map((s) => ({ original: s.original.trim(), improved: s.improved.trim() }))
      .filter((s) => s.original && s.improved)
      .slice(0, 5),
  }
}

export async function analyzeResume(resumeText, jobDescription) {
  const hasJobDescription = Boolean(jobDescription)

  let response
  try {
    response = await getClient().beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserMessage(resumeText, jobDescription) }],
      output_config: {
        effort: EFFORT,
        format: { type: 'json_schema', schema: ANALYSIS_SCHEMA },
      },
      // If a safety classifier declines, retry server-side on Anthropic's recommended fallback model.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
    })
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      throw new AnalysisError('The server’s Anthropic API key was rejected. Check ANTHROPIC_API_KEY.', 500)
    }
    if (err instanceof Anthropic.RateLimitError) {
      throw new AnalysisError('The AI service is busy right now. Please try again in a minute.', 503)
    }
    if (err instanceof Anthropic.APIConnectionError) {
      throw new AnalysisError('Could not reach the AI service. Please try again.', 503)
    }
    if (err instanceof Anthropic.APIError) {
      console.error('[analyze] Anthropic API error', err.status, err.message)
      throw new AnalysisError('The AI service returned an error. Please try again.')
    }
    throw err
  }

  if (response.stop_reason === 'refusal') {
    throw new AnalysisError('The AI declined to analyze this document. Please check it is a resume.', 422)
  }
  if (response.stop_reason === 'max_tokens') {
    throw new AnalysisError('The analysis was cut off before it finished. Please try again.')
  }

  const text = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('')

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    console.error('[analyze] Model returned non-JSON output:', text.slice(0, 500))
    throw new AnalysisError('The AI returned an unreadable response. Please try again.')
  }

  console.log(
    `[analyze] model=${response.model} in=${response.usage.input_tokens} out=${response.usage.output_tokens} tokens`,
  )
  return validateAnalysis(parsed, hasJobDescription)
}
