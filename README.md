# AI-Powered Resume Analyzer

Upload a resume (PDF or DOCX), optionally paste a job description, and get structured, recruiter-style feedback in seconds: an overall score, strengths, weaknesses, before/after rewrite suggestions and, when a JD is supplied, a JD-match score with missing keywords.

The core of the project is the **engineered evaluation prompt** (`server/src/prompt.js`), not a trained model.

## Architecture

```
[Browser: React + Tailwind (client/)]
   |  1. User uploads resume (+ optional JD text)
   v
[POST /api/analyze -> Express (server/)]
   |  2. Extract text from PDF (pdf-parse) / DOCX (mammoth)
   |  3. Build the evaluation prompt (role + rubric + few-shot + output format)
   v
[LLM API — Google Gemini (default) or Anthropic Claude]
   |  4. Model returns JSON, constrained by a JSON schema (structured outputs)
   v
[Express]
   |  5. Parse + validate (clamp scores, 3-5 list items, JD fields only with a JD)
   v
[React UI]
   6. Score ring(s), strengths, weaknesses, keywords, before/after cards
```

| Path | Purpose |
| --- | --- |
| `client/src/App.jsx` | Upload -> loading -> results state machine |
| `client/src/components/` | `Landing` (marketing sections + upload), `UploadForm`, `LoadingState`, `Results`, `ScoreRing`, `PenMark` |
| `client/src/content.js` | All landing-page copy (hero, problem, how it works, benefits, FAQ, CTA) |
| `client/src/api.js` | Calls `POST /api/analyze` |
| `server/src/index.js` | Express app, upload handling, error handling |
| `server/src/extractText.js` | PDF/DOCX -> clean plain text |
| `server/src/prompt.js` | **The evaluation prompt** and output JSON schema |
| `server/src/analyze.js` | Picks the LLM provider, parses + validates the response |
| `server/src/providers/` | `gemini.js` and `anthropic.js` — one API call each, same prompt and schema |
| `samples/` | Fictional test resumes (+ generator script) |
| `docs/PROMPT_ITERATIONS.md` | Log of prompt versions and test results |

## API

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/analyze` | `multipart/form-data` with `resume` (file) and `jobDescription` (text, optional). Returns the analysis JSON. |
| `GET` | `/api/health` | Health check |

Errors come back as `{ "error": "message" }` with a 4xx/5xx status.

## Run locally

Requires Node.js 20+ and a Gemini API key (or an Anthropic API key).

```bash
# 1. Backend (http://localhost:5000)
cd server
npm install
cp .env.example .env        # then set GEMINI_API_KEY
npm run dev

# 2. Frontend (http://localhost:5173) — in a second terminal
cd client
npm install
npm run dev
```

Open http://localhost:5173. Vite proxies `/api` to the backend.

No API key yet? Start the backend with `MOCK_LLM=true` in `.env` to get canned results (marked `[MOCK]`) through the full flow.

### Configuration (`server/.env`)

| Variable | Default | Notes |
| --- | --- | --- |
| `LLM_PROVIDER` | `anthropic` | `gemini` or `anthropic` (`.env.example` sets `gemini`) |
| `GEMINI_API_KEY` | — | Required for `gemini` |
| `GEMINI_MODEL` | `gemini-3.5-flash` | Pinned for consistent scores |
| `GEMINI_FALLBACK_MODELS` | `gemini-flash-latest,gemini-flash-lite-latest` | Tried in order if the main model is overloaded (429/5xx) |
| `ANTHROPIC_API_KEY` | — | Required for `anthropic` |
| `ANTHROPIC_MODEL` | `claude-opus-5-5` | |
| `ANTHROPIC_EFFORT` | `low` | `low` / `medium` / `high` |
| `PORT` | `5000` | |
| `MOCK_LLM` | `false` | Skip the LLM call and return canned results |

## Tests

```bash
cd server && npm test     # prompt builder, response validation, PDF/DOCX extraction
```

Sample resumes for manual testing are in `samples/` (`sample-resume.pdf`/`.docx` — weak early-career resume; `sparse-resume.pdf`; `long-resume.pdf` — 2+ pages; `not-a-resume.txt` — unsupported type). Regenerate with `python3 samples/generate_samples.py`.
