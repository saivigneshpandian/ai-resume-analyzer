import { ANALYSIS_SCHEMA, SYSTEM_PROMPT, buildUserMessage } from './prompt.js'
import { AnalysisError } from './errors.js'
import { generateWithAnthropic } from './providers/anthropic.js'
import { generateWithGemini } from './providers/gemini.js'

export { AnalysisError }

// Both providers receive the identical prompt (brief Section 7) and JSON schema.
const PROVIDERS = { anthropic: generateWithAnthropic, gemini: generateWithGemini }
export const PROVIDER = (process.env.LLM_PROVIDER || 'gemini').toLowerCase()

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
  const generate = PROVIDERS[PROVIDER]
  if (!generate) {
    throw new AnalysisError(`Unknown LLM_PROVIDER "${PROVIDER}". Use "anthropic" or "gemini".`, 500)
  }

  const text = await generate({
    system: SYSTEM_PROMPT,
    user: buildUserMessage(resumeText, jobDescription),
    schema: ANALYSIS_SCHEMA,
  })

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    console.error('[analyze] Model returned non-JSON output:', text.slice(0, 500))
    throw new AnalysisError('The AI returned an unreadable response. Please try again.')
  }
  return validateAnalysis(parsed, Boolean(jobDescription))
}
