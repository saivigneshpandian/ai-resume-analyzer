import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { validateAnalysis } from '../src/analyze.js'
import { SYSTEM_PROMPT, buildUserMessage } from '../src/prompt.js'
import { extractText } from '../src/extractText.js'

const sample = (name) => readFile(new URL(`../../samples/${name}`, import.meta.url))

test('system prompt contains role, rubric, few-shot examples and output format', () => {
  assert.match(SYSTEM_PROMPT, /experienced technical recruiter and resume coach/)
  assert.match(SYSTEM_PROMPT, /Impact — Does each line show measurable outcomes/)
  assert.match(SYSTEM_PROMPT, /Coordinated a 5-member team/)
  assert.match(SYSTEM_PROMPT, /"rewrite_suggestions"/)
})

test('user message includes the JD only when supplied', () => {
  assert.match(buildUserMessage('resume', 'Need Go dev'), /<job_description>\nNeed Go dev/)
  const noJd = buildUserMessage('resume', '')
  assert.doesNotMatch(noJd, /<job_description>/)
  assert.match(noJd, /jd_match_score to null/)
})

test('validateAnalysis clamps scores, trims lists and drops JD fields without a JD', () => {
  const result = validateAnalysis(
    {
      overall_score: 140,
      jd_match_score: 50,
      strengths: ['a', ' ', 'b', 'c', 'd', 'e', 'f'],
      weaknesses: ['x'],
      missing_keywords: ['Docker'],
      rewrite_suggestions: [{ original: 'o', improved: 'i' }, { original: '', improved: 'i' }],
    },
    false,
  )
  assert.equal(result.overall_score, 100)
  assert.equal(result.jd_match_score, null)
  assert.deepEqual(result.missing_keywords, [])
  assert.equal(result.strengths.length, 5)
  assert.deepEqual(result.rewrite_suggestions, [{ original: 'o', improved: 'i' }])
})

test('validateAnalysis rejects output missing required fields', () => {
  assert.throws(() => validateAnalysis({ strengths: [] }, false), /missing "overall_score"/)
})

test('extracts the same text from the sample PDF and DOCX', async () => {
  const pdf = await extractText(await sample('sample-resume.pdf'), 'pdf')
  const docx = await extractText(await sample('sample-resume.docx'), 'docx')
  for (const text of [pdf, docx]) {
    assert.match(text, /Priya Sharma/)
    assert.match(text, /Responsible for managing the team's tasks\./)
    assert.doesNotMatch(text, /-- 1 of 1 --/)
  }
})

test('extracts all pages of a multi-page PDF', async () => {
  const text = await extractText(await sample('long-resume.pdf'), 'pdf')
  assert.match(text, /Certified Kubernetes Application Developer/)
})
