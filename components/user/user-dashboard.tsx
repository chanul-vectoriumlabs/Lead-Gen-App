"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Check,
  Eye,
  FileText,
  Lock,
  Search,
  SearchX,
  Upload,
  Zap,
} from "lucide-react"

import { clearCv, useCv } from "@/components/user/cv-store"
import { AutoApplyDialog } from "@/components/user/auto-apply-dialog"
import { CvUpload } from "@/components/user/cv-upload"
import { CvViewer } from "@/components/user/cv-viewer"
import { RequestsInbox } from "@/components/user/requests-inbox"
import { MatchCard } from "@/components/user/match-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { isLocked, SHOW_JOB_MATCHES } from "@/components/user/feature-locks"
import { DEMO_CANDIDATE_ID, defaultTopJobs, useTopJobs } from "@/lib/top-jobs-store"
import { matches } from "@/lib/user-matches"
import { cn } from "@/lib/utils"

// The demo user's current number of top jobs in the admin data (Priya S.).
const DEMO_TOP_JOBS = 6

const Ring = ({ value }: { value: number }) => {
  const r = 22
  const c = 2 * Math.PI * r
  return (
    <div className="relative size-14 shrink-0">
      <svg viewBox="0 0 56 56" className="size-14 -rotate-90" aria-hidden>
        <circle cx="28" cy="28" r={r} strokeWidth="5" className="fill-none stroke-muted" />
        <circle
          cx="28"
          cy="28"
          r={r}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (value / 100) * c}
          className="fill-none stroke-primary transition-all"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold">
        {value}%
      </span>
    </div>
  )
}

const tasks = [
  { title: "Job preferences", cta: "Start: 3 quick questions", value: 0, href: "/resume-settings?tab=preferences" },
  { title: "Autofill questions", cta: "Start: answer once, reuse everywhere", value: 0, href: "/resume-settings?tab=autofill" },
]

export const UserDashboard = () => {
  const cv = useCv()
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [quickOnly, setQuickOnly] = useState(false)
  const [passed, setPassed] = useState<string[]>([])
  const [saved, setSaved] = useState<string[]>([])
  const [drafting, setDrafting] = useState<string[]>([])
  const [pending, setPending] = useState<string[] | null>(null)
  // Upload time of the CV being replaced, or null.
  const [replacing, setReplacing] = useState<string | null>(null)

  // The admin sets how many top jobs this candidate sees.
  const topN = useTopJobs(DEMO_CANDIDATE_ID, defaultTopJobs(DEMO_TOP_JOBS))

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return matches.slice(0, topN).filter(
      (m) =>
        !passed.includes(m.id) &&
        (!quickOnly || m.quickApply) &&
        (!q || `${m.title} ${m.company}`.toLowerCase().includes(q))
    )
  }, [query, quickOnly, passed, topN])

  const quickLeft = visible.filter((m) => m.quickApply && !drafting.includes(m.id))

  if (cv === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (cv === null) return <CvUpload />
  // Replacing: show the upload screen until a newer CV is saved.
  if (replacing === cv.uploadedAt) return <CvUpload onCancel={() => setReplacing(null)} />

  const firstName = "Priya"

  return (
    <div className="min-w-0 space-y-6">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Welcome, {firstName}!</h1>

      <RequestsInbox candidateId={DEMO_CANDIDATE_ID} />

      {/* Profile card */}
      <Card className="overflow-hidden border border-border p-0">
        <div className="grid lg:grid-cols-[1fr_16rem]">
          <CardContent className="space-y-6 p-6 md:p-8">
            <div className="space-y-1">
              <h2 className="font-heading text-xl font-semibold">
                CV uploaded. Finish your profile to sharpen your matches.
              </h2>
              <p className="text-sm text-muted-foreground">
                Get matched with new jobs as soon as they&apos;re published: pay, schedule and role type.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <div className="flex items-center gap-2 border-b-2 border-primary pb-2 text-sm">
                <span className="font-heading text-lg font-semibold">{drafting.length}</span>
                <span className="text-muted-foreground">Awaiting your approval</span>
              </div>
              <div className="flex items-center gap-2 border-b-2 border-border pb-2 text-sm">
                <span className="font-heading text-lg font-semibold">0</span>
                <span className="text-muted-foreground">Applications submitted</span>
              </div>
              <Button className="ml-auto cursor-pointer" disabled={drafting.length === 0}>
                Review applications <ArrowRight />
              </Button>
            </div>

            <div className="grid gap-4 rounded-xl bg-muted/60 p-4 md:grid-cols-2">
              {tasks.map((t) => (
                <div key={t.title} className="flex items-center gap-4">
                  <Ring value={t.value} />
                  <div>
                    <p className="font-medium">{t.title}</p>
                    {isLocked(t.href) ? (
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Lock className="size-3.5" /> Locked for now
                      </span>
                    ) : (
                      <Link
                        href={t.href}
                        className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        {t.cta} <ArrowRight className="size-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          <div className="relative hidden items-center justify-center overflow-hidden bg-primary/10 lg:flex">
            <div className="absolute -right-10 -top-10 size-40 rounded-full bg-primary/15" />
            <div className="relative w-36 -rotate-6 space-y-2.5 rounded-xl border bg-background p-4 shadow-lg">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-primary" />
                <span className="h-2 flex-1 rounded-full bg-muted" />
              </div>
              {["w-full", "w-4/5", "w-11/12", "w-2/3", "w-5/6"].map((w) => (
                <span key={w} className={cn("block h-1.5 rounded-full bg-muted", w)} />
              ))}
            </div>
            <span className="absolute bottom-8 right-10 flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <Check className="size-5" />
            </span>
          </div>
        </div>
      </Card>

      {/* Shown instead of Job matches while they're hidden (see feature-locks.ts) */}
      {!SHOW_JOB_MATCHES && (
        <Card className="min-w-0 border border-border">
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <span className="relative flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Eye className="size-6" />
              <span className="absolute top-1 right-1 flex size-3">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex size-3 rounded-full bg-primary ring-2 ring-background" />
              </span>
            </span>
            <div className="space-y-1.5">
              <Badge variant="secondary" className="gap-1.5">
                <span className="size-1.5 rounded-full bg-primary" /> In review
              </Badge>
              <h2 className="font-heading text-xl font-semibold">An admin is actively viewing your CV</h2>
              <p className="mx-auto max-w-lg text-sm text-muted-foreground">
                Our team is going through <span className="font-medium text-foreground">{cv.name}</span> to find the
                jobs that fit you best. We&apos;ll email you as soon as your top matches are ready.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <CvViewer cv={cv} />
              <Button variant="outline" className="cursor-pointer bg-background" onClick={() => setReplacing(cv.uploadedAt)}>
                <Upload /> Upload another CV
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job matches (hidden for now, see feature-locks.ts) */}
      {SHOW_JOB_MATCHES && (
      <Card className="min-w-0 border border-border">
        <CardContent className="min-w-0 space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-heading text-xl font-semibold">Job matches</h2>
            <Badge variant="secondary">Your top {topN}</Badge>
            <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm">
              <span className="text-muted-foreground">Based on</span>
              <span className="max-w-48 truncate font-medium">{cv.name}</span>
              <Button size="xs" className="cursor-pointer" onClick={clearCv}>
                Switch
              </Button>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <span className="text-xs text-muted-foreground">{quickLeft.length} ready for quick apply</span>
              <Button
                className="cursor-pointer"
                disabled={quickLeft.length === 0}
                onClick={() => setPending(quickLeft.map((m) => m.id))}
              >
                <Zap /> Apply to all
                <span className="flex size-5 items-center justify-center rounded-md bg-primary-foreground/20 text-xs">
                  {quickLeft.length}
                </span>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative min-w-64 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by job title or company"
                className="h-9 bg-background pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="quick-only"
                checked={quickOnly}
                onCheckedChange={setQuickOnly}
                className="cursor-pointer"
              />
              <Label htmlFor="quick-only" className="flex cursor-pointer items-center gap-1.5 font-medium">
                <Zap className="size-4 text-primary" /> Quick apply only
              </Label>
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-14 text-center">
              <SearchX className="size-8 text-muted-foreground" />
              <p className="font-medium">No matches to show</p>
              <p className="text-sm text-muted-foreground">Try a different search or turn off Quick apply only.</p>
              {passed.length > 0 && (
                <Button variant="outline" className="cursor-pointer" onClick={() => setPassed([])}>
                  Show passed jobs ({passed.length})
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {visible.map((m) => (
                <MatchCard
                  key={m.id}
                  match={m}
                  saved={saved.includes(m.id)}
                  applied={drafting.includes(m.id)}
                  onSave={() =>
                    setSaved((s) => (s.includes(m.id) ? s.filter((x) => x !== m.id) : [...s, m.id]))
                  }
                  onPass={() => setPassed((p) => [...p, m.id])}
                  onApply={() => setPending([m.id])}
                />
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Apply prepares a tailored resume and cover letter for your approval. Nothing is sent until you approve it.
          </p>
        </CardContent>
      </Card>
      )}
      <AutoApplyDialog
        open={pending !== null}
        count={pending?.length ?? 0}
        onOpenChange={(o) => !o && setPending(null)}
        onConfirm={() => {
          if (!pending?.length) return
          setDrafting((d) => [...new Set([...d, ...pending])])
          const [first, ...rest] = pending
          router.push(`/apply/${first}${rest.length ? `?next=${rest.join(",")}` : ""}`)
        }}
      />
    </div>
  )
}
