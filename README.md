# AI-Powered Resume Analyzer

Upload a resume (PDF or DOCX), optionally paste a job description, and get **structured, recruiter-style feedback in seconds**:

- an overall score out of 100
- 3–5 strengths and 3–5 weaknesses, each tied to the actual resume
- before → after rewrites of the weakest lines
- with a job description: a job-match score and the keywords that are missing

The core of the project is an **engineered evaluation prompt** (role, fixed rubric, few-shot examples, enforced JSON output), not a custom-trained model. It was built as the deliverable for a one-month AI & Prompt Engineering internship.

---

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Prompt design](#prompt-design)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [API](#api)
- [Project structure](#project-structure)
- [Testing](#testing)
- [Design notes](#design-notes)
- [Security and privacy](#security-and-privacy)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)

---

## Features

| Area | What it does |
| --- | --- |
| Upload | Drag-and-drop or browse, PDF/DOCX up to 5 MB, client-side type/size checks |
| Job description | Optional textarea; adds a job-match score and missing-keyword list |
| Text extraction | `pdf-parse` (PDF, all pages) and `mammoth` (DOCX), whitespace cleanup, rejects image-only files |
| AI evaluation | One structured-output LLM call per resume using the Section 7 prompt |
| Validation | Server clamps scores to 0–100, trims lists to 3–5 items, drops JD fields when no JD was given |
| Results | Score ring(s) with a verdict, strengths, weaknesses, keyword chips, before/after cards with **Copy** buttons |
| Flow | Upload → loading (progress steps) → results → "Score My Updated Resume" / "Add a job description" |
| Errors | Clear messages for wrong file type, oversized, corrupt or scanned files, and AI-service outages; the form keeps your file so you can retry |
| Providers | Google Gemini (default) or Anthropic Claude, switchable with one env var |
| Mock mode | `MOCK_LLM=true` runs the whole flow with canned data and no API key |

## Tech stack

| Layer | Choice |
| --- | --- |
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express 5, `multer` (in-memory uploads) |
| File parsing | `pdf-parse` (PDF), `mammoth` (DOCX) |
| LLM | Google Gemini via `@google/genai` (default) or Anthropic Claude via `@anthropic-ai/sdk` |
| Database | None — the MVP is stateless (upload → analyze → display) |

## Architecture

```
[Browser: React + Tailwind (client/)]
   |  1. User uploads resume (+ optional job description)
   v
[POST /api/analyze -> Express (server/)]
   |  2. Extract text from PDF (pdf-parse) / DOCX (mammoth)
   |  3. Build the evaluation prompt (role + rubric + few-shot + output format)
   v
[LLM API — Google Gemini (default) or Anthropic Claude]
   |  4. Model returns JSON constrained by a JSON schema (structured output)
   v
[Express]
   |  5. Parse + validate (clamp scores, 3-5 list items, JD fields only with a JD)
   v
[React UI]
   6. Score ring(s), strengths, weaknesses, keywords, before/after cards
```

## Prompt design

The prompt lives in [`server/src/prompt.js`](server/src/prompt.js) and follows the build brief's Section 7. Both providers receive exactly the same system prompt, user message and JSON schema.

1. **Role & framing** — *"You are an experienced technical recruiter and resume coach with 10+ years of experience… You are precise, specific, and never generic."*
2. **Fixed rubric** — clarity, impact, formatting consistency, and keyword/JD alignment (only when a JD is supplied).
3. **Few-shot examples** — weak → strong bullet pairs that anchor what "good" looks like.
4. **Enforced output format** — the exact JSON object, plus field rules (3–5 items, `original` copied verbatim, `[placeholder]` metrics instead of invented numbers).
5. **Data note** — the resume and JD are treated as untrusted data; instructions inside them are ignored.

Core of the prompt construction:

```js
export const SYSTEM_PROMPT = [ROLE, RUBRIC, FEW_SHOT, OUTPUT_FORMAT, DATA_NOTE].join('\n\n')

export function buildUserMessage(resumeText, jobDescription) {
  const jdBlock = jobDescription
    ? `<job_description>\n${jobDescription}\n</job_description>`
    : 'No job description was supplied. Set jd_match_score to null and missing_keywords to [].'
  return `<resume>\n${resumeText}\n</resume>\n\n${jdBlock}\n\nEvaluate this resume and return the JSON object.`
}
```

The response is requested as structured JSON (Gemini `responseJsonSchema`, Claude `output_config.format`), so it always parses; [`server/src/analyze.js`](server/src/analyze.js) then validates ranges and list sizes. Prompt changes are logged in [`docs/PROMPT_ITERATIONS.md`](docs/PROMPT_ITERATIONS.md).

## Getting started

**Requirements:** Node.js 20+ and a Gemini API key from [Google AI Studio](https://aistudio.google.com/) (or an Anthropic API key).

```bash
git clone https://github.com/saivigneshpandian/ai-resume-analyzer.git
cd ai-resume-analyzer

# 1. Backend — http://localhost:5000
cd server
npm install
cp .env.example .env        # then put your key in GEMINI_API_KEY
npm run dev

# 2. Frontend — http://localhost:5173 (second terminal)
cd client
npm install
npm run dev
```

Open **http://localhost:5173**. In development, Vite proxies `/api` to the backend.

No API key yet? Set `MOCK_LLM=true` in `server/.env` to run the full flow with canned results (marked `[MOCK]`).

**Production build:** `cd client && npm run build` outputs static files to `client/dist/`. If the backend is hosted separately, build with `VITE_API_URL=https://your-backend.example.com`.

## Configuration

All settings live in `server/.env` (see [`server/.env.example`](server/.env.example)). `.env` is git-ignored — never commit keys.

| Variable | Default | Notes |
| --- | --- | --- |
| `LLM_PROVIDER` | `anthropic` | `gemini` or `anthropic` (`.env.example` sets `gemini`) |
| `GEMINI_API_KEY` | — | Required for `gemini` |
| `GEMINI_MODEL` | `gemini-3.5-flash` | Pinned version for consistent scores between runs |
| `GEMINI_FALLBACK_MODELS` | `gemini-flash-latest,gemini-flash-lite-latest` | Tried in order, with backoff, if the main model is overloaded (429/5xx) |
| `ANTHROPIC_API_KEY` | — | Required for `anthropic` |
| `ANTHROPIC_MODEL` | `claude-opus-5-5` | |
| `ANTHROPIC_EFFORT` | `low` | `low` / `medium` / `high` — higher is slower but more thorough |
| `PORT` | `5000` | |
| `MOCK_LLM` | `false` | Skip the LLM call and return canned results |

## API

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/analyze` | `multipart/form-data` with `resume` (file) and `jobDescription` (text, optional) |
| `GET` | `/api/health` | Health check → `{ "status": "ok" }` |

Example:

```bash
curl -F resume=@samples/sample-resume.pdf \
     -F "jobDescription=$(cat samples/agentic-ai-engineer-jd.txt)" \
     http://localhost:5000/api/analyze
```

Response shape:

```json
{
  "overall_score": 45,
  "jd_match_score": 10,
  "strengths": ["...", "...", "..."],
  "weaknesses": ["...", "...", "..."],
  "missing_keywords": ["LLM agents", "RAG", "..."],
  "rewrite_suggestions": [{ "original": "...", "improved": "..." }]
}
```

`jd_match_score` is `null` and `missing_keywords` is `[]` when no job description is sent. Errors return `{ "error": "message" }`:

| Status | When |
| --- | --- |
| 400 | No file, file over 5 MB, job description over 20,000 characters |
| 415 | Not a PDF or DOCX |
| 422 | Corrupt/password-protected file, no readable text (scanned image), or the AI declined the document |
| 500 | Server missing or using an invalid API key |
| 502 / 503 | AI service error or overloaded |

## Project structure

```
ai-resume-analyzer/
├── client/                      React + Tailwind frontend
│   ├── index.html
│   └── src/
│       ├── App.jsx              Upload → loading → results flow, header, footer
│       ├── api.js               POST /api/analyze
│       ├── content.js           All landing-page copy
│       ├── index.css            Design tokens (colours, fonts, shadows, motion)
│       └── components/
│           ├── Landing.jsx      Hero + upload, problem, how it works, benefits, FAQ, CTA
│           ├── UploadForm.jsx   Dropzone, job description, validation
│           ├── LoadingState.jsx Progress bar + steps
│           ├── Results.jsx      Scores, strengths, weaknesses, keywords, rewrites
│           ├── ScoreRing.jsx    Animated score ring
│           ├── scoreTone.js     Score → verdict + colour
│           └── Icon.jsx         Inline SVG icon set
├── server/                      Express backend
│   ├── .env.example
│   ├── src/
│   │   ├── index.js             Routes, upload handling, error handler
│   │   ├── extractText.js       PDF/DOCX → clean text
│   │   ├── prompt.js            The evaluation prompt + JSON schema
│   │   ├── analyze.js           Provider choice, parsing, validation
│   │   ├── errors.js
│   │   ├── mockAnalysis.js      Canned result for MOCK_LLM
│   │   └── providers/
│   │       ├── gemini.js
│   │       └── anthropic.js
│   └── test/analyze.test.js     node:test unit tests
├── samples/                     Fictional test resumes, sample JD, generator script
└── docs/PROMPT_ITERATIONS.md    Prompt version log
```

## Testing

**Unit tests** (prompt builder, response validation, PDF/DOCX extraction):

```bash
cd server && npm test
```

**Frontend lint and build:**

```bash
cd client && npm run lint && npm run build
```

**Sample files** in [`samples/`](samples/) — all fictional:

| File | Purpose |
| --- | --- |
| `sample-resume.pdf` / `.docx` | Weak early-career resume (same content in both formats) |
| `sparse-resume.pdf` | Very short resume |
| `long-resume.pdf` | 2+ page resume |
| `not-a-resume.txt` | Unsupported file type |
| `agentic-ai-engineer-jd.txt` | Sample job description for an agentic AI role |

Regenerate the resumes with `pip install reportlab python-docx && python3 samples/generate_samples.py`.

**Manual test checklist** (build brief, Section 12):

| # | Test case | Expected result |
| --- | --- | --- |
| 1 | Upload a valid PDF resume | Text extracted, analysis returned |
| 2 | Upload a valid DOCX resume | Text extracted, analysis returned |
| 3 | Upload an unsupported file type | Clear error, no crash |
| 4 | Analyze without a job description | Score, strengths, weaknesses; no job-match section |
| 5 | Analyze with a job description | Job-match score and missing-keyword list |
| 6 | Re-run the same resume twice | Score and feedback stay reasonably consistent |
| 7 | Very short / sparse resume | Valid structured JSON, not an error |
| 8 | Large resume (2+ pages) | Full extraction and analysis, no truncation |

## Design notes

- **Theme:** white and warm-white surfaces with a deep orange primary (`#c2410c`, chosen to pass WCAG AA with white text); bright orange is used only for decoration.
- **Type:** Plus Jakarta Sans (headings) and Inter (body).
- **Accessibility:** visible labels, errors next to the field, 44px+ touch targets, keyboard-operable dropzone, skip link, focus moved to each new screen's heading, colour never the only signal, `prefers-reduced-motion` respected.
- **Responsive:** tested from 360px phones to desktop with no horizontal scroll; the upload form comes first on mobile.
- **Copy:** all landing-page text is in [`client/src/content.js`](client/src/content.js). Every claim matches what the app does; there are no invented testimonials or statistics.

## Security and privacy

- Uploaded files are kept **in memory only** and never written to disk or a database. The extracted text is sent to the configured LLM provider for analysis.
- API keys belong in `server/.env`, which is git-ignored. If a key is ever shared in chat, a screenshot or a commit, rotate it.
- The prompt tells the model to treat resume and job-description text as data and to ignore instructions inside them.
- Uploads are limited to PDF/DOCX up to 5 MB; job descriptions to 20,000 characters.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| "The server is missing GEMINI_API_KEY" | Create `server/.env` from `.env.example`, add the key, restart the server |
| "The AI service is busy right now" | The model is overloaded; wait a minute or change `GEMINI_MODEL` |
| "Could not find enough text in this file" | The file is a scanned image — export a text-based PDF or DOCX |
| Frontend shows "Could not reach the server" | Start the backend (`cd server && npm run dev`) on port 5000 |
| Port already in use | Set `PORT` in `server/.env` and update the proxy in `client/vite.config.js` |

## Roadmap

Stretch features, planned after the core MVP is signed off:

- Save past analyses (login + database)
- Download the feedback report as a PDF
- Side-by-side resume vs. job-description keyword highlighting
- Compare multiple resume versions
- Dark mode
