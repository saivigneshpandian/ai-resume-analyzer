// Sample analysis matching the backend's JSON schema (brief Section 7.4).
// Used to build and validate the UI before the real API is wired in.
export const mockAnalysis = {
  overall_score: 72,
  jd_match_score: 64,
  strengths: [
    'Clear, well-organised sections with a scannable one-page layout.',
    'Strong technical skills section covering React, Node.js and SQL.',
    'Two relevant projects with links to live demos and source code.',
  ],
  weaknesses: [
    'Most experience bullets describe duties rather than measurable outcomes.',
    'Inconsistent tense — mixes "Built" and "Building" across the same role.',
    'Summary is generic ("hard-working team player") and adds no signal.',
    'No metrics on project scale (users, data size, performance).',
  ],
  missing_keywords: ['TypeScript', 'CI/CD', 'Docker', 'REST API design', 'unit testing'],
  rewrite_suggestions: [
    {
      original: 'Responsible for managing the team’s tasks.',
      improved:
        'Coordinated a 5-member team to deliver 3 projects ahead of schedule, improving sprint completion rate by 20%.',
    },
    {
      original: 'Worked on backend development.',
      improved:
        'Built and shipped 4 REST API endpoints in Node.js, reducing average response time by 35%.',
    },
    {
      original: 'Helped with testing the application.',
      improved:
        'Wrote 60+ Jest unit tests covering the payments module, raising coverage from 40% to 85%.',
    },
  ],
}
