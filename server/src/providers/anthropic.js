import Anthropic from '@anthropic-ai/sdk'
import { AnalysisError } from '../errors.js'

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-5-5'
// 'low' keeps responses inside the brief's ~10-15 s target; raise for deeper reviews.
const EFFORT = process.env.ANTHROPIC_EFFORT || 'low'

let client

export async function generateWithAnthropic({ system, user, schema }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new AnalysisError('The server is missing ANTHROPIC_API_KEY. Add it to server/.env and restart.', 500)
  }
  client ??= new Anthropic()

  let response
  try {
    response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      system,
      messages: [{ role: 'user', content: user }],
      output_config: { effort: EFFORT, format: { type: 'json_schema', schema } },
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
  console.log(`[analyze] anthropic model=${response.model} in=${response.usage.input_tokens} out=${response.usage.output_tokens}`)
  return response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('')
}
