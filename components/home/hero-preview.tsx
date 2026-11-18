import { CheckCircle2, Sparkles, UserSearch } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// Illustrative preview of ranked results; not real data.
const jobs = [
  { score: 91, title: "Senior Data Engineer", company: "Acme Corp", place: "Austin, hybrid", reason: "Strong Python and AWS match" },
  { score: 84, title: "Data Platform Engineer", company: "Northwind", place: "Remote", reason: "Pipeline experience fits well" },
  { score: 76, title: "Analytics Engineer", company: "Brightly", place: "Austin", reason: "SQL strong, less streaming" },
]

export const HeroPreview = () => {
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-3xl bg-primary/10 blur-2xl" />
      <Card className="border border-border shadow-xl">
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Top jobs for your CV</p>
              <p className="text-xs text-muted-foreground">6 ranked from 24 found</p>
            </div>
            <Badge className="gap-1">
              <Sparkles className="size-3" /> AI ranked
            </Badge>
          </div>

          <div className="space-y-2.5">
            {jobs.map((j, i) => (
              <div
                key={j.title}
                className="flex items-center gap-3 rounded-xl border bg-background p-3"
              >
                <div
                  className={
                    i === 0
                      ? "flex size-11 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-sm font-semibold text-primary-foreground"
                      : "flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-semibold text-primary"
                  }
                >
                  {j.score}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{j.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {j.company} &middot; {j.place}
                  </p>
                  <p className="truncate text-xs text-primary">{j.reason}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <UserSearch className="size-3.5 text-primary" /> 9 recruiter contacts found
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-primary" /> Waiting for your approval
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
