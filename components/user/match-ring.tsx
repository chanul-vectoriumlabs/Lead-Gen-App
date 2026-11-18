export const MatchRing = ({ value }: { value: number }) => {
  const r = 30
  const c = 2 * Math.PI * r
  return (
    <div className="relative size-20 shrink-0">
      <svg viewBox="0 0 72 72" className="size-20 -rotate-90" aria-hidden>
        <circle cx="36" cy="36" r={r} strokeWidth="7" className="fill-none stroke-muted" />
        <circle
          cx="36"
          cy="36"
          r={r}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (value / 100) * c}
          className="fill-none stroke-primary"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-heading text-xl font-semibold">
        {value}
        <span className="text-xs text-muted-foreground">%</span>
      </span>
    </div>
  )
}

