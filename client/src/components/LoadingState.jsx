export default function LoadingState({ fileName }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center" aria-live="polite">
      <div className="h-14 w-14 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      <p className="mt-6 text-lg font-medium text-slate-900">Analyzing your resume…</p>
      <p className="mt-1 text-sm text-slate-500">
        {fileName ? `Reading ${fileName} and scoring it` : 'Scoring it'} against a recruiter rubric. This
        usually takes 10–15 seconds.
      </p>
    </div>
  )
}
