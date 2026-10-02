// In dev, Vite proxies /api to the Express server. For a separate backend
// deployment, set VITE_API_URL (e.g. https://my-api.onrender.com).
const API_URL = import.meta.env.VITE_API_URL || ''

export async function analyzeResume(file, jobDescription) {
  const form = new FormData()
  form.append('resume', file)
  if (jobDescription) form.append('jobDescription', jobDescription)

  let res
  try {
    res = await fetch(`${API_URL}/api/analyze`, { method: 'POST', body: form })
  } catch {
    throw new Error('Could not reach the server. Is the backend running?')
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error(data?.error || `Analysis failed (HTTP ${res.status}). Please try again.`)
  }
  console.log('Analysis JSON:', data)
  return data
}
