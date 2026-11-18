"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  BookOpen,
  Check,
  ChevronDown,
  CircleDot,
  Clock,
  ExternalLink,
  EyeOff,
  Flag,
  Heart,
  MapPin,
  MoreHorizontal,
  PenLine,
  PieChart,
  Share2,
  Sparkles,
  Wallet,
  X,
  Zap,
} from "lucide-react"

import { useCv, clearCv } from "@/components/user/cv-store"
import { MatchCard } from "@/components/user/match-card"
import { MatchRing } from "@/components/user/match-ring"
import { usePlan } from "@/components/user/plan-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { analyse } from "@/lib/job-analysis"
import { matches, type Match } from "@/lib/user-matches"
import { cn } from "@/lib/utils"

// Placeholder job description. Replace with the description stored for this job.
const describe = (m: Match) => ({
  overview: [
    ["Job title", m.title],
    ["Company", m.company],
    ["Location", m.workplace],
    ["Position type", "Full-time"],
    ["Salary range", m.salary ?? "Not listed"],
    ["Posted", m.posted],
  ],
  summary: `${m.company} is looking for a ${m.title} to design, build and run reliable systems used across the business. You'll work closely with product, analytics and platform teams, and own your work from design through production.`,
  responsibilities: [
    `Design, build and maintain production systems using ${m.skills.join(", ")}.`,
    "Partner with stakeholders to turn requirements into clear technical plans.",
    "Improve reliability, cost and performance of existing services.",
    "Write tests and documentation, and review teammates' code.",
    "Help on-call rotations and incident reviews.",
  ],
  requirements: [
    `Strong hands-on experience with ${m.skills.slice(0, 2).join(" and ")}.`,
    `Working knowledge of ${m.skills[2] ?? "cloud platforms"}.`,
    "5+ years of professional experience in a similar role.",
    "Clear written and spoken communication.",
  ],
})

const Analysis = ({ job }: { job: Match }) => {
  const a = analyse(job)
  return (
    <>
      <div className="flex flex-wrap items-center gap-5">
        <MatchRing value={a.pct} />
        <div className="space-y-1">
          <p className="font-heading text-lg font-semibold">
            Your resume matches <span className="text-primary">{a.pct}%</span> of job keywords
          </p>
          <Dialog>
            <DialogTrigger render={<Button variant="link" className="h-auto px-0 text-primary" />}>
              <PieChart /> See skills match analysis
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Skills match analysis</DialogTitle>
                <DialogDescription>Keywords from the job description compared with your resume.</DialogDescription>
              </DialogHeader>
              {(
                [
                  ["Full matches", a.full, Check, "bg-primary/10 text-primary"],
                  ["Partial matches", a.partial, CircleDot, "bg-muted text-foreground"],
                  ["Missing", a.missing, X, "bg-destructive/10 text-destructive"],
                ] as const
              ).map(([label, list, Icon, tone]) => (
                <div key={label} className="space-y-2">
                  <p className="text-sm font-medium">
                    {label} ({list.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {list.map((k) => (
                      <span key={k} className={cn("flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium", tone)}>
                        <Icon className="size-3" /> {k}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5">
          <Check className="size-4 text-primary" /> <b>{a.full.length}</b> Full matches
        </span>
        <span className="flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5">
          <CircleDot className="size-4 text-muted-foreground" /> <b>{a.partial.length}</b> Partial
        </span>
        <span className="flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5">
          <X className="size-4 text-destructive" /> <b>{a.missing.length}</b> Missing
        </span>
      </div>
    </>
  )
}

const ApplyMenu = ({
  onAuto,
  onOptimize,
  side = "bottom",
  className,
}: {
  onAuto: () => void
  onOptimize: () => void
  side?: "top" | "bottom"
  className?: string
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger render={<Button size="lg" className={cn("group h-11 px-6", className)} />}>
      Apply now
      <ChevronDown className="transition-transform group-data-popup-open:rotate-180" />
    </DropdownMenuTrigger>
    <DropdownMenuContent side={side} align="end" sideOffset={8} className="w-[26rem] max-w-[calc(100vw-2rem)] p-2">
      <DropdownMenuGroup>
        <DropdownMenuLabel className="px-2 py-2 font-heading text-base font-semibold text-foreground">
          Boost your chances before you apply.
        </DropdownMenuLabel>
      </DropdownMenuGroup>
      <div className="flex flex-col gap-2">
        <DropdownMenuItem
          onClick={onAuto}
          className="items-start gap-3 rounded-lg bg-primary px-4 py-3.5 text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground not-data-[variant=destructive]:focus:**:text-primary-foreground [&_svg]:text-primary-foreground"
        >
          <Zap className="mt-0.5 size-5!" />
          <span className="space-y-0.5">
            <span className="block font-heading text-base font-semibold">Auto apply</span>
            <span className="block text-xs opacity-90">
              We fill in your details and prepare your application for your approval.
            </span>
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onOptimize} className="items-start gap-3 rounded-lg border px-4 py-3.5">
          <Sparkles className="mt-0.5 size-5! text-primary" />
          <span className="space-y-0.5">
            <span className="block font-heading text-base font-semibold">Optimize resume and cover letter</span>
            <span className="block text-xs text-muted-foreground">
              Tailor them to this job to boost your chances. It takes a few seconds.
            </span>
          </span>
        </DropdownMenuItem>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
)

export const JobDetails = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const router = useRouter()
  const cv = useCv()
  const plan = usePlan()
  const job = matches.find((m) => m.id === jobId)

  const [saved, setSaved] = useState<string[]>([])
  const [passed, setPassed] = useState<string[]>([])

  if (!job) {
    return (
      <Card className="mx-auto w-full max-w-3xl border border-border">
        <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
          <p className="font-heading text-lg font-semibold">Job not found</p>
          <p className="text-sm text-muted-foreground">This job may have been closed or removed.</p>
          <Button nativeButton={false} render={<Link href="/dashboard" />}>
            Back to dashboard
          </Button>
        </CardContent>
      </Card>
    )
  }

  const d = describe(job)
  const isSaved = saved.includes(job.id)
  const toggleSave = (id: string) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  const goApply = () => router.push(`/apply/${job.id}`)
  const goOptimize = () =>
    router.push(
      plan === "pro"
        ? `/apply/${job.id}`
        : `/upgrade?reason=optimize&next=${encodeURIComponent(`/apply/${job.id}`)}`
    )
  const recommended = matches.filter((m) => m.id !== job.id && !passed.includes(m.id))


  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
        {/* Main column */}
        <div className="min-w-0 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Badge variant="secondary" className="h-8 gap-1.5 px-3 text-sm">
                <Wallet className="size-4" /> {job.salary ?? "Salary not listed"}
              </Badge>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button variant="outline" size="icon" className="size-11 bg-background" aria-label="More actions" />}
                  >
                    <MoreHorizontal />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 p-1.5">
                    <DropdownMenuItem className="py-2">
                      <Share2 /> Share job
                    </DropdownMenuItem>
                    <DropdownMenuItem className="py-2" onClick={() => router.push("/dashboard")}>
                      <EyeOff /> Not interested
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" className="py-2">
                      <Flag /> Report job
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-11 bg-background"
                  aria-label={isSaved ? "Remove from saved" : "Save job"}
                  aria-pressed={isSaved}
                  onClick={() => toggleSave(job.id)}
                >
                  <Heart className={cn(isSaved && "fill-primary text-primary")} />
                </Button>
                <ApplyMenu onAuto={goApply} onOptimize={goOptimize} />
              </div>
            </div>

            <h1 className="font-heading text-3xl font-semibold tracking-tight">{job.title}</h1>
            <div className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-lg font-semibold text-primary-foreground">
                {job.company
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="space-y-1.5">
                <p className="text-sm font-medium">{job.company}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="size-3" /> {job.posted}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <MapPin className="size-3" /> {job.workplace}
                  </Badge>
                  {job.quickApply && (
                    <Badge variant="secondary" className="gap-1 text-primary">
                      <Zap className="size-3" /> Quick apply
                    </Badge>
                  )}
                  <a href="#" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                    <ExternalLink className="size-3.5" /> View original posting
                  </a>
                </div>
              </div>
            </div>
          </div>

          <Card className="border border-t-4 border-border border-t-primary">
            <CardContent className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="flex items-center gap-2.5 font-heading text-lg font-semibold">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Zap className="size-4" />
                  </span>
                  Apply faster with AI
                </h2>
                {cv && (
                  <div className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm">
                    <span className="text-muted-foreground">Based on</span>
                    <span className="max-w-48 truncate font-medium">{cv.name}</span>
                    <Button size="xs" onClick={() => router.push("/resume-settings")}>
                      Switch
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                We tailor your resume and cover letter to this job, fill in the application questions, and
                wait for your approval before anything is sent.
              </p>
              <div className="space-y-4 border-y py-5">
                <Analysis job={job} />
              </div>
              <div className="flex justify-center">
                <Button size="lg" className="h-11 px-8" onClick={goOptimize}>
                  <PenLine /> Optimize resume for this job
                </Button>
              </div>
              {cv === null && (
                <p className="text-center text-xs text-muted-foreground">
                  You need a CV first.{" "}
                  <button type="button" className="cursor-pointer text-primary hover:underline" onClick={() => { clearCv(); router.push("/dashboard") }}>
                    Upload one
                  </button>
                </p>
              )}
            </CardContent>
          </Card>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold">
              <BookOpen className="size-5 text-primary" /> Job description
            </h2>
            <Card className="border border-border">
              <CardContent className="space-y-6 text-sm leading-relaxed">
                <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {d.overview.map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs text-muted-foreground">{k}</dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="space-y-2">
                  <h3 className="font-heading font-semibold">Job summary</h3>
                  <p className="text-muted-foreground">{d.summary}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading font-semibold">Key responsibilities</h3>
                  <ul className="list-disc space-y-1.5 pl-5 text-muted-foreground marker:text-primary">
                    {d.responsibilities.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading font-semibold">Requirements</h3>
                  <ul className="list-disc space-y-1.5 pl-5 text-muted-foreground marker:text-primary">
                    {d.requirements.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>

          <div className="sticky bottom-4 z-10 flex justify-center">
            <div className="flex items-center gap-2 rounded-xl border bg-background/95 p-2 shadow-lg backdrop-blur">
              <Button
                variant="outline"
                size="icon"
                className="size-11"
                aria-label={isSaved ? "Remove from saved" : "Save job"}
                aria-pressed={isSaved}
                onClick={() => toggleSave(job.id)}
              >
                <Heart className={cn(isSaved && "fill-primary text-primary")} />
              </Button>
              <ApplyMenu
                onAuto={goApply}
                onOptimize={goOptimize}
                side="top"
                className="w-48"
              />
            </div>
          </div>
        </div>

        {/* Side column */}
        <aside className="space-y-6 lg:sticky lg:top-6">
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold">
              <Zap className="size-5 text-primary" /> Quick apply
            </h2>
            <Card className="border border-border">
              <CardContent className="flex flex-col items-center gap-3 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Zap className="size-5" />
                </span>
                <p className="font-heading text-lg font-semibold">Try quick apply</p>
                <p className="text-sm text-muted-foreground">
                  Answer the common application questions once and reuse them for every job.
                </p>
                <Button
                  className="w-full"
                  nativeButton={false}
                  render={<Link href="/resume-settings?tab=autofill" />}
                >
                  Set up quick apply
                </Button>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-3">
            <h2 className="text-center font-heading text-lg font-semibold">Recommended jobs</h2>
            {recommended.slice(0, 3).map((m) => (
              <MatchCard
                key={m.id}
                match={m}
                saved={saved.includes(m.id)}
                applied={false}
                onSave={() => toggleSave(m.id)}
                onPass={() => setPassed((p) => [...p, m.id])}
                onApply={() => router.push(`/apply/${m.id}`)}
              />
            ))}
          </section>
        </aside>
      </div>

    </div>
  )
}
