// Hand-drawn red-pen marks — the page's signature gesture, like a recruiter marking up a resume.

export function PenUnderline({ children, delay = '0.5s' }) {
  // Background-image squiggle + box-decoration-clone, so the mark follows the text when it wraps
  return (
    <span className="pen-underline" style={{ '--pen-delay': delay }}>
      {children}
    </span>
  )
}

export function PenStrike({ children }) {
  // CSS line-through (not an SVG) so the strike follows text that wraps onto several lines
  return <span className="line-through decoration-pen decoration-2">{children}</span>
}

export function PenTick({ className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`h-5 w-5 shrink-0 ${className}`}>
      <path d="M4 13.5 L9.5 18.5 L20 5.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
