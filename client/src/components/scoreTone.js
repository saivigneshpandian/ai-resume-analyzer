// Verdict text always accompanies the colour, so meaning isn't carried by colour alone.
export function scoreTone(score) {
  if (score >= 80) return { color: 'text-success', bg: 'bg-success-soft', label: 'Interview-ready' }
  if (score >= 60) return { color: 'text-warn', bg: 'bg-warn-soft', label: 'Solid — needs sharpening' }
  return { color: 'text-danger', bg: 'bg-danger-soft', label: 'Needs work before you apply' }
}
