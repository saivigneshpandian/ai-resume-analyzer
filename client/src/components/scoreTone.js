export function scoreTone(score) {
  if (score >= 80) return { color: 'text-good', label: 'Interview-ready' }
  if (score >= 60) return { color: 'text-warn', label: 'Solid — needs sharpening' }
  return { color: 'text-pen', label: 'Needs work before you apply' }
}
