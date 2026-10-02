// Local / traditional-server entry point. On Vercel, api/index.js serves the same app as a Function.
import app, { MOCK_LLM } from './app.js'
import { PROVIDER } from './analyze.js'

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Resume Analyzer API listening on http://localhost:${PORT} (${MOCK_LLM ? 'MOCK_LLM mode' : `LLM: ${PROVIDER}`})`)
})
