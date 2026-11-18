"use client"

import { useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts"
import {
  Briefcase,
  CalendarCheck,
  Send,
  TrendingDown,
  TrendingUp,
  Trophy,
  type LucideIcon,
} from "lucide-react"

import { InfoTip } from "@/components/admin/info-tip"
import {
  TitleWithTip,
  WorkflowObservability,
  type Range,
} from "@/components/admin/workflow-observability"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"


// Placeholder data. Replace with the Reporting Agent's output.
const trend: Record<Range, { label: string; jobs: number }[]> = {
  daily: [
    { label: "Mon", jobs: 28 },
    { label: "Tue", jobs: 41 },
    { label: "Wed", jobs: 36 },
    { label: "Thu", jobs: 52 },
    { label: "Fri", jobs: 47 },
    { label: "Sat", jobs: 18 },
    { label: "Sun", jobs: 26 },
  ],
  weekly: [
    { label: "W1", jobs: 182 },
    { label: "W2", jobs: 205 },
    { label: "W3", jobs: 198 },
    { label: "W4", jobs: 236 },
    { label: "W5", jobs: 221 },
    { label: "W6", jobs: 248 },
  ],
  monthly: [
    { label: "Jun", jobs: 640 },
    { label: "Jul", jobs: 712 },
    { label: "Aug", jobs: 805 },
    { label: "Sep", jobs: 778 },
    { label: "Oct", jobs: 896 },
    { label: "Nov", jobs: 948 },
  ],
}

const kpis: Record<
  Range,
  { label: string; value: string; delta: number; icon: LucideIcon }[]
> = {
  daily: [
    { label: "Jobs found", value: "248", delta: 12, icon: Briefcase },
    { label: "Applications submitted", value: "6", delta: 20, icon: Send },
    { label: "Interview rate", value: "33%", delta: 4, icon: CalendarCheck },
    { label: "Offers", value: "1", delta: 0, icon: Trophy },
  ],
  weekly: [
    { label: "Jobs found", value: "1,290", delta: 9, icon: Briefcase },
    { label: "Applications submitted", value: "18", delta: 13, icon: Send },
    { label: "Interview rate", value: "33%", delta: -2, icon: CalendarCheck },
    { label: "Offers", value: "2", delta: 100, icon: Trophy },
  ],
  monthly: [
    { label: "Jobs found", value: "4,779", delta: 6, icon: Briefcase },
    { label: "Applications submitted", value: "64", delta: 18, icon: Send },
    { label: "Interview rate", value: "31%", delta: 3, icon: CalendarCheck },
    { label: "Offers", value: "7", delta: 40, icon: Trophy },
  ],
}

const categories = [
  { name: "Data and analytics", jobs: 42 },
  { name: "Engineering", jobs: 31 },
  { name: "Product", jobs: 17 },
  { name: "Design", jobs: 10 },
  { name: "People and HR", jobs: 7 },
]

const funnel = [
  { stage: "Selected", count: 32 },
  { stage: "Approved", count: 22 },
  { stage: "Submitted", count: 18 },
  { stage: "Interview", count: 6 },
  { stage: "Offer", count: 2 },
]

const companies = [
  { name: "Acme Corp", jobs: 14 },
  { name: "Northwind", jobs: 11 },
  { name: "Brightly", jobs: 9 },
  { name: "Globex", jobs: 7 },
  { name: "Orbit", jobs: 5 },
]

const jobsConfig = {
  jobs: { label: "Jobs found", color: "var(--primary)" },
} satisfies ChartConfig

const countConfig = {
  count: { label: "Applications", color: "var(--primary)" },
} satisfies ChartConfig

const categoryConfig = {
  jobs: { label: "Jobs", color: "var(--primary)" },
} satisfies ChartConfig

// What each KPI counts.
const KPI_TIP: Record<string, string> = {
  "Jobs found": "New job postings saved from approved sources in this period, after removing duplicates.",
  "Applications submitted": "Applications sent to recruiters in this period.",
  "Interview rate": "Share of submitted applications that led to an interview.",
  Offers: "Job offers received by candidates in this period.",
}

const rangeLabel: Record<Range, string> = {
  daily: "Last 7 days",
  weekly: "Last 6 weeks",
  monthly: "Last 6 months",
}

export const AnalyticsDashboard = () => {
  const [range, setRange] = useState<Range>("weekly")
  const maxCompany = Math.max(...companies.map((c) => c.jobs))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={range} onValueChange={(v) => setRange(v as Range)}>
          <TabsList className="h-9">
            {(
              [
                ["daily", "Daily", "Each day over the last 7 days."],
                ["weekly", "Weekly", "Each week over the last 6 weeks."],
                ["monthly", "Monthly", "Each month over the last 6 months."],
              ] as const
            ).map(([value, label, tip]) => (
              <InfoTip key={value} text={`Show ${tip.charAt(0).toLowerCase()}${tip.slice(1)} Applies to the whole page.`}>
                <TabsTrigger value={value} className="cursor-pointer px-3">
                  {label}
                </TabsTrigger>
              </InfoTip>
            ))}
          </TabsList>
        </Tabs>
        <p className="text-sm text-muted-foreground">{rangeLabel[range]}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis[range].map((k) => {
          const up = k.delta >= 0
          return (
            <InfoTip key={k.label} text={`${KPI_TIP[k.label]} The change compares with the period before.`}>
            <Card size="sm" tabIndex={0} className="cursor-help border border-border">
              <CardContent className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">{k.label}</p>
                  <p className="font-heading text-3xl font-semibold tracking-tight">{k.value}</p>
                  <p
                    className={cn(
                      "flex items-center gap-1 text-xs font-medium",
                      up ? "text-primary" : "text-destructive"
                    )}
                  >
                    {up ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                    {up ? "+" : ""}
                    {k.delta}%
                    <span className="font-normal text-muted-foreground">vs previous</span>
                  </p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <k.icon className="size-5" />
                </div>
              </CardContent>
            </Card>
            </InfoTip>
          )
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="border border-border xl:col-span-2">
          <CardHeader>
            <TitleWithTip
              title="Jobs found over time"
              tip="How many new jobs the Job Search Agent saved in each day, week or month. Hover the chart for exact numbers."
            />
            <CardDescription>New jobs saved from approved sources, after de-duplication</CardDescription>
            <CardAction>
              <Button variant="outline" size="sm" className="cursor-pointer">
                Export report
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ChartContainer config={jobsConfig} className="aspect-auto h-72 w-full">
              <AreaChart data={trend[range]} margin={{ left: 4, right: 12, top: 8 }}>
                <defs>
                  <linearGradient id="fillJobs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-jobs)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--color-jobs)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} />
                <ChartTooltip
                  cursor={{ strokeDasharray: "4 4" }}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="jobs"
                  type="monotone"
                  stroke="var(--color-jobs)"
                  strokeWidth={2}
                  fill="url(#fillJobs)"
                  activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--background)" }}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <TitleWithTip
              title="Top hiring companies"
              tip="Companies with the most open jobs matched to your candidates. Bars compare each company with the top one."
            />
            <CardDescription>Open jobs matched to candidates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {companies.map((c, i) => (
              <div key={c.name} className="space-y-1.5">
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex size-6 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="flex-1 font-medium">{c.name}</span>
                  <span className="tabular-nums text-muted-foreground">{c.jobs} jobs</span>
                </div>
                <Progress value={(c.jobs / maxCompany) * 100} className="ml-9" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-border">
          <CardHeader>
            <TitleWithTip
              title="Jobs by category"
              tip="Jobs found this period, grouped by the kind of role."
            />
            <CardDescription>Jobs found this period</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={categoryConfig} className="aspect-auto h-64 w-full">
              <BarChart data={categories} layout="vertical" margin={{ left: 8, right: 36 }}>
                <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={150}
                />
                <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent hideLabel={false} />} />
                <Bar dataKey="jobs" fill="var(--color-jobs)" radius={4} barSize={18}>
                  <LabelList dataKey="jobs" position="right" className="fill-muted-foreground" fontSize={12} />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <TitleWithTip
              title="Application funnel"
              tip="How many jobs reached each step: selected, approved, submitted, interview and offer. The drop between bars shows where jobs fall out."
            />
            <CardDescription>From job selection to offer, all time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={countConfig} className="aspect-auto h-64 w-full">
              <BarChart data={funnel} margin={{ top: 20, left: 4, right: 4 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="stage" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis hide />
                <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} barSize={36}>
                  <LabelList dataKey="count" position="top" className="fill-foreground" fontSize={12} />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <WorkflowObservability range={range} />
    </div>
  )
}
