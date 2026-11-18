"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Hourglass,
  Info,
  RotateCw,
  type LucideIcon,
} from "lucide-react"

import { InfoTip } from "@/components/admin/info-tip"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export type Range = "daily" | "weekly" | "monthly"

/** A card title with a hover explanation. */
export const TitleWithTip = ({ title, tip }: { title: string; tip: string }) => (
  <CardTitle className="flex items-center gap-1.5 text-base">
    {title}
    <InfoTip text={tip}>
      <Button variant="ghost" size="icon-xs" className="cursor-help text-muted-foreground" aria-label={`About ${title}`}>
        <Info />
      </Button>
    </InfoTip>
  </CardTitle>
)

// Placeholder data. Replace with run records from the workflow / agent logs API.
const SCALE: Record<Range, number> = { daily: 1, weekly: 6, monthly: 25 }

const runsOverTime: Record<Range, { label: string; succeeded: number; failed: number }[]> = {
  daily: [
    { label: "Mon", succeeded: 62, failed: 2 },
    { label: "Tue", succeeded: 74, failed: 4 },
    { label: "Wed", succeeded: 69, failed: 1 },
    { label: "Thu", succeeded: 88, failed: 6 },
    { label: "Fri", succeeded: 81, failed: 3 },
    { label: "Sat", succeeded: 31, failed: 0 },
    { label: "Sun", succeeded: 40, failed: 1 },
  ],
  weekly: [
    { label: "W1", succeeded: 402, failed: 21 },
    { label: "W2", succeeded: 437, failed: 15 },
    { label: "W3", succeeded: 418, failed: 19 },
    { label: "W4", succeeded: 466, failed: 12 },
    { label: "W5", succeeded: 451, failed: 14 },
    { label: "W6", succeeded: 445, failed: 17 },
  ],
  monthly: [
    { label: "Jun", succeeded: 1610, failed: 88 },
    { label: "Jul", succeeded: 1742, failed: 71 },
    { label: "Aug", succeeded: 1890, failed: 64 },
    { label: "Sep", succeeded: 1835, failed: 77 },
    { label: "Oct", succeeded: 1968, failed: 59 },
    { label: "Nov", succeeded: 2014, failed: 62 },
  ],
}

const runsConfig = {
  succeeded: { label: "Succeeded", color: "var(--primary)" },
  failed: { label: "Failed", color: "var(--destructive)" },
} satisfies ChartConfig

const AGENTS: {
  name: string
  stage: string
  about: string
  runs: number
  success: number
  avg: string
  p95: string
  state: "Healthy" | "Degraded" | "Failing"
}[] = [
  { name: "CV Extraction Agent", stage: "CV", about: "Reads the uploaded CV and pulls out skills, experience and education.", runs: 14, success: 100, avg: "18s", p95: "32s", state: "Healthy" },
  { name: "Criteria Agent", stage: "Criteria", about: "Turns the CV and preferences into search keywords and criteria.", runs: 13, success: 100, avg: "9s", p95: "15s", state: "Healthy" },
  { name: "Job Search Agent", stage: "Search", about: "Searches approved job sources and removes duplicate postings.", runs: 41, success: 88, avg: "2m 10s", p95: "4m 45s", state: "Degraded" },
  { name: "Job Matching Agent", stage: "Rank", about: "Scores and ranks each job found against the candidate's CV.", runs: 38, success: 97, avg: "46s", p95: "1m 20s", state: "Healthy" },
  { name: "Recruiter Research Agent", stage: "Select", about: "Finds hiring contacts at each company for the selected jobs.", runs: 26, success: 81, avg: "1m 05s", p95: "2m 30s", state: "Degraded" },
  { name: "Application Agent", stage: "Apply", about: "Tailors the CV, drafts cover letters and sends applications.", runs: 22, success: 95, avg: "35s", p95: "58s", state: "Healthy" },
]

const STAGES: { stage: string; waiting: number; avgHours: number; about: string }[] = [
  { stage: "CV", waiting: 2, avgHours: 26, about: "Waiting for the candidate to upload a CV." },
  { stage: "Criteria", waiting: 1, avgHours: 9, about: "Waiting for criteria to be reviewed and confirmed." },
  { stage: "Search", waiting: 1, avgHours: 0.6, about: "Job search running or waiting to be started." },
  { stage: "Rank", waiting: 0, avgHours: 0.3, about: "Ranking running or waiting to be started." },
  { stage: "Select", waiting: 3, avgHours: 31, about: "Waiting for jobs to be picked and confirmed." },
]

const FAILURES = [
  { agent: "Job Search Agent", candidate: "Sam K.", error: "Source sync timed out (Workable)", attempt: "Retry 2 of 3", when: "25 min ago" },
  { agent: "Recruiter Research Agent", candidate: "Priya S.", error: "No hiring contacts found at Orbit", attempt: "Needs re-run", when: "1 hour ago" },
  { agent: "Job Search Agent", candidate: "Leo B.", error: "Rate limited by Greenhouse", attempt: "Recovered on retry 1", when: "3 hours ago" },
]

const hours = (h: number) => (h < 1 ? `${Math.round(h * 60)} min` : `${Math.round(h)} h`)

const STATE_TIP: Record<(typeof AGENTS)[number]["state"], string> = {
  Healthy: "95% or more of runs succeed and run times are normal.",
  Degraded: "Some runs fail or are slow. Failed runs retry automatically.",
  Failing: "Most runs fail. The agent needs attention.",
}

const Kpi = ({
  label,
  value,
  note,
  icon: Icon,
  tip,
  tone = "default",
}: {
  label: string
  value: string
  note: string
  icon: LucideIcon
  tip: string
  tone?: "default" | "bad"
}) => (
  <InfoTip text={tip}>
    <Card size="sm" tabIndex={0} className="cursor-help border border-border">
      <CardContent className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="font-heading text-3xl font-semibold tracking-tight">{value}</p>
          <p className="text-xs text-muted-foreground">{note}</p>
        </div>
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-xl",
            tone === "bad" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
          )}
        >
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  </InfoTip>
)

const headCls = "h-10 text-xs font-semibold tracking-wide text-muted-foreground uppercase"

const HeadWithTip = ({ label, tip }: { label: string; tip: string }) => (
  <TableHead className={headCls}>
    <InfoTip text={tip}>
      <span tabIndex={0} className="cursor-help">
        {label}
      </span>
    </InfoTip>
  </TableHead>
)

/** How the agents and workflow stages are performing: runs, failures, speed and bottlenecks. */
export const WorkflowObservability = ({ range }: { range: Range }) => {
  const data = runsOverTime[range]
  const ok = data.reduce((n, d) => n + d.succeeded, 0)
  const bad = data.reduce((n, d) => n + d.failed, 0)
  const total = ok + bad
  const maxWait = Math.max(...STAGES.map((s) => s.avgHours))
  const slowest = STAGES.find((s) => s.avgHours === maxWait)

  return (
    <section className="flex flex-col gap-4" aria-labelledby="observability-title">
      <div>
        <h2 id="observability-title" className="font-heading text-lg font-semibold">
          Workflow observability
        </h2>
        <p className="text-sm text-muted-foreground">
          How the agents behind each workflow stage are running: volume, failures, speed and where candidates wait.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="Agent runs"
          value={total.toLocaleString()}
          note="All agents, this period"
          icon={Activity}
          tip="How many times any agent ran a task, such as reading a CV, searching jobs or finding recruiters."
        />
        <Kpi
          label="Success rate"
          value={`${((ok / total) * 100).toFixed(1)}%`}
          note={`${ok.toLocaleString()} of ${total.toLocaleString()} runs`}
          icon={CheckCircle2}
          tip="Share of agent runs that finished without an error, including runs that recovered on retry."
        />
        <Kpi
          label="Failed runs"
          value={bad.toLocaleString()}
          note={`${FAILURES.filter((f) => f.attempt !== "Recovered on retry 1").length} still need attention`}
          icon={AlertCircle}
          tone="bad"
          tip="Agent runs that ended with an error. Most retry automatically; the rest are listed under Recent failures."
        />
        <Kpi
          label="Avg time to complete"
          value={range === "daily" ? "2.4 days" : range === "weekly" ? "2.6 days" : "2.9 days"}
          note="CV upload to jobs selected"
          icon={Clock}
          tip="Average time for a candidate to go through all 5 stages, from uploading a CV to confirming selected jobs."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="border border-border xl:col-span-2">
          <CardHeader>
            <TitleWithTip
              title="Agent runs by outcome"
              tip="Every agent run in the period, split into runs that succeeded and runs that failed. Hover a bar for the numbers."
            />
            <CardDescription>Succeeded and failed runs across all agents</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={runsConfig} className="aspect-auto h-64 w-full">
              <BarChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} width={44} />
                <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="succeeded" stackId="runs" fill="var(--color-succeeded)" barSize={28} stroke="var(--background)" strokeWidth={2} />
                <Bar dataKey="failed" stackId="runs" fill="var(--color-failed)" radius={[4, 4, 0, 0]} barSize={28} stroke="var(--background)" strokeWidth={2} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <TitleWithTip
              title="Stage bottlenecks"
              tip="For each stage: how many candidates are waiting in it now, and how long candidates usually spend there. Longer bars mean a slower stage."
            />
            <CardDescription>
              Slowest now: {slowest?.stage} ({hours(maxWait)} on average)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {STAGES.map((s) => (
              <InfoTip key={s.stage} text={s.about}>
                <div tabIndex={0} className="cursor-help space-y-1.5">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="flex-1 font-medium">{s.stage}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Hourglass className="size-3" /> {s.waiting} waiting
                    </span>
                    <span className="w-14 text-right tabular-nums text-muted-foreground">{hours(s.avgHours)}</span>
                  </div>
                  <Progress value={(s.avgHours / maxWait) * 100} />
                </div>
              </InfoTip>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border">
        <CardHeader>
          <TitleWithTip
            title="Agent health"
            tip="One row per agent: how often it ran, how often it succeeded and how long its runs take. Hover an agent name to see what it does."
          />
          <CardDescription>Runs, success rate and run time for each agent this period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-xl border">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <HeadWithTip label="Agent" tip="The agent and the workflow stage it handles." />
                  <HeadWithTip label="Runs" tip="How many tasks this agent ran in the period." />
                  <HeadWithTip label="Success rate" tip="Share of this agent's runs that finished without an error." />
                  <HeadWithTip label="Avg run time" tip="The typical time one run takes." />
                  <HeadWithTip label="P95 run time" tip="95% of runs finish within this time. A high value means some runs are much slower." />
                  <HeadWithTip label="Health" tip="Overall state based on success rate and run time. Hover a badge for details." />
                </TableRow>
              </TableHeader>
              <TableBody>
                {AGENTS.map((a) => (
                  <TableRow key={a.name}>
                    <TableCell className="py-3">
                      <InfoTip text={a.about}>
                        <div tabIndex={0} className="cursor-help">
                          <p className="font-medium">{a.name}</p>
                          <p className="text-xs text-muted-foreground">{a.stage} stage</p>
                        </div>
                      </InfoTip>
                    </TableCell>
                    <TableCell className="tabular-nums">{(a.runs * SCALE[range]).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex w-36 items-center gap-2">
                        <Progress value={a.success} className="flex-1" />
                        <span className="w-10 text-right text-xs tabular-nums">{a.success}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{a.avg}</TableCell>
                    <TableCell className="text-muted-foreground">{a.p95}</TableCell>
                    <TableCell>
                      <InfoTip text={STATE_TIP[a.state]}>
                        <Badge
                          tabIndex={0}
                          variant={a.state === "Healthy" ? "secondary" : a.state === "Degraded" ? "outline" : "destructive"}
                          className="cursor-help gap-1"
                        >
                          {a.state === "Healthy" ? <CheckCircle2 /> : <AlertCircle />}
                          {a.state}
                        </Badge>
                      </InfoTip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader>
          <TitleWithTip
            title="Recent failures"
            tip="The latest agent runs that ended with an error, with where each retry stands. Re-run starts the task again now."
          />
          <CardDescription>Errors from agent runs and their retry status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {FAILURES.map((f) => {
            const recovered = f.attempt.startsWith("Recovered")
            return (
              <div
                key={f.agent + f.candidate + f.when}
                className={cn(
                  "flex flex-wrap items-center gap-3 rounded-lg border p-3",
                  !recovered && "border-destructive/30"
                )}
              >
                {recovered ? (
                  <CheckCircle2 className="size-4 text-primary" />
                ) : (
                  <AlertCircle className="size-4 text-destructive" />
                )}
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-medium">
                    {f.agent} &middot; {f.candidate}
                  </p>
                  <p className="text-muted-foreground">{f.error}</p>
                </div>
                <Badge variant={recovered ? "secondary" : "outline"}>{f.attempt}</Badge>
                <span className="w-24 text-right text-xs text-muted-foreground">{f.when}</span>
                {!recovered && (
                  <Button size="sm" variant="outline" className="cursor-pointer">
                    <RotateCw /> Re-run
                  </Button>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>
    </section>
  )
}
