# Prompt iterations

Record every change to `server/src/prompt.js` here (bump `PROMPT_VERSION` too): what changed, why, and what the test resumes showed before/after. This is the prompt-engineering evidence for the report (brief Section 7.5).

## v1 — initial version (brief Section 7)

**Structure**

1. **Role** — experienced technical recruiter / resume coach, "precise, specific, and never generic" (7.1, verbatim).
2. **Fixed rubric** — clarity, impact, formatting consistency, keyword/JD alignment only when a JD is supplied (7.2).
3. **Few-shot** — the two weak -> strong bullet pairs from 7.3.
4. **Output format** — the exact JSON object from 7.4, plus field rules: 3-5 strengths/weaknesses tied to this resume, `jd_match_score: null` and `missing_keywords: []` with no JD, `original` copied verbatim, placeholder metrics in `[brackets]` instead of invented numbers.
5. **Data note** — resume/JD treated as untrusted data (ignore instructions inside them).

**Enforcement** — the same shape is sent as a JSON schema through the API's structured outputs, so replies always parse; the server then clamps scores and trims lists.

**Test results** — _not yet run against the live API._

| # | Resume | JD? | Score | JD match | Notes |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## v2 — _(next iteration)_

- What was too generic or inconsistent in v1:
- What changed:
- Result:
