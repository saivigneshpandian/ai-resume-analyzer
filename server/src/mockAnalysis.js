// Canned analysis returned when MOCK_LLM=true, so the full upload -> results
// flow can be exercised without an API key or spending tokens.
export function mockAnalysis(hasJobDescription) {
  return {
    overall_score: 58,
    jd_match_score: hasJobDescription ? 47 : null,
    strengths: [
      '[MOCK] Clear section structure: Summary, Education, Experience, Projects, Skills.',
      '[MOCK] Relevant internship using Node.js and Express.',
      '[MOCK] Skills list covers a modern JavaScript stack.',
    ],
    weaknesses: [
      '[MOCK] Experience bullets describe duties ("Responsible for…") with no measurable outcomes.',
      '[MOCK] Tense is inconsistent ("Building dashboards" vs. past-tense bullets).',
      '[MOCK] Summary relies on filler ("hard-working", "team player").',
    ],
    missing_keywords: hasJobDescription ? ['[MOCK] TypeScript', '[MOCK] Docker'] : [],
    rewrite_suggestions: [
      {
        original: "Responsible for managing the team's tasks.",
        improved: '[MOCK] Coordinated task planning for a [X]-member intern team, delivering [N] features on schedule.',
      },
    ],
  }
}
