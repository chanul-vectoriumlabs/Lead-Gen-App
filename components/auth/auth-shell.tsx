import type { ReactNode } from "react"
import { CheckCircle2, Target } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export const AuthShell = ({
  eyebrow,
  title,
  description,
  panelTitle,
  panelText,
  points,
  badge,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  panelTitle: string
  panelText: string
  points: string[]
  badge?: string
  children: ReactNode
}) => {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 size-96 rounded-full bg-primary-foreground/10" />
        <div className="absolute -bottom-32 -left-20 size-80 rounded-full bg-primary-foreground/5" />

        <div className="relative flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground text-primary">
            <Target className="size-5" />
          </div>
          <span className="font-heading text-xl font-semibold">JobPilot</span>
        </div>

        <div className="relative max-w-md space-y-6">
          <h2 className="font-heading text-4xl font-semibold leading-tight">{panelTitle}</h2>
          <p className="text-primary-foreground/80">{panelText}</p>
          <ul className="space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-primary-foreground/70">
          AI Job Intelligence &amp; Recruitment Automation Platform
        </p>
      </aside>

      <main className="flex items-center justify-center bg-muted/40 p-6 sm:p-10">
        <div className="w-full max-w-md space-y-8 rounded-2xl border bg-card p-8 shadow-sm sm:p-10">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Target className="size-5" />
            </div>
            <span className="font-heading text-lg font-semibold">JobPilot</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                {eyebrow}
              </p>
              {badge && <Badge variant="secondary">{badge}</Badge>}
            </div>
            <h1 className="font-heading text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          {children}
        </div>
      </main>
    </div>
  )
}
