import Link from "next/link"
import {
  Briefcase,
  CheckCircle2,
  CircleAlert,
  FileCheck2,
  Hourglass,
  Send,
  UserSearch,
  Users,
} from "lucide-react"

import { CandidateProgress } from "@/components/admin/candidate-progress"
import { InfoTip } from "@/components/admin/info-tip"
import { PageHeader } from "@/components/admin/page-header"
import { StatCard } from "@/components/admin/stat-card"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  actionQueue,
  recentActivity,
  workflowHealth,
} from "@/lib/mock-data"

const stats = [
  {
    label: "Candidates in progress",
    value: "12",
    hint: "+2 this week",
    icon: Users,
    info: "Candidates who have started the 5-stage workflow but haven't finished it yet.",
  },
  {
    label: "Jobs found",
    value: "248",
    hint: "+36 today",
    icon: Briefcase,
    info: "Job postings the Job Search Agent found across all sources for every candidate.",
  },
  {
    label: "Recruiter leads",
    value: "96",
    hint: "+9 today",
    icon: UserSearch,
    info: "Hiring contacts the Recruiter Research Agent found for the selected jobs.",
  },
  {
    label: "Awaiting job selection",
    value: "3",
    hint: "Needs you",
    icon: Hourglass,
    attention: true,
    info: "Candidates whose jobs are ranked and waiting for you to pick which jobs to pursue.",
  },
  {
    label: "Awaiting approval",
    value: "4",
    hint: "Needs you",
    icon: FileCheck2,
    attention: true,
    info: "Applications that are ready and need your approval before they're sent.",
  },
  {
    label: "Applications submitted",
    value: "18",
    hint: "+5 this week",
    icon: Send,
    info: "Applications sent to recruiters, with a CV and cover letter attached.",
  },
]

// What each workflow health tile counts.
const HEALTH_INFO = {
  running: "Agent tasks that are working now, such as searching for jobs or ranking them.",
  waiting: "Tasks paused until you or the candidate act, such as confirming criteria or picking jobs.",
  failed: "Tasks that stopped with an error. They retry automatically, or you can re-run them.",
}

// What each kind of action asks you to do.
const ACTION_INFO: Record<string, string> = {
  "Select jobs": "Pick which of the candidate's ranked jobs they should pursue.",
  "Review criteria": "Check the search keywords and criteria made from the candidate's CV.",
  "Run search": "Criteria are confirmed. Run the job search for this candidate.",
}

const OverviewPage = () => {
  return (
    <>
      <PageHeader
        title="Good morning, Admin"
        description="Here is where every candidate stands and what needs your decision today."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <CandidateProgress />

        <div className="flex flex-col gap-6">
          <Card className="border border-primary/40 ring-2 ring-primary/20">
            <CardHeader>
              <CardTitle className="text-base">Needs your action</CardTitle>
              <CardDescription>
                {actionQueue.length} decisions waiting. The workflow can&apos;t continue for these candidates until
                you act.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {actionQueue.map((a) => (
                <div
                  key={a.label + a.who}
                  className="flex items-center justify-between gap-3 rounded-lg border bg-muted/40 p-3"
                >
                  <InfoTip text={ACTION_INFO[a.label] ?? a.label}>
                    <div tabIndex={0} className="cursor-help text-sm">
                      <div className="font-medium">{a.label}</div>
                      <div className="text-muted-foreground">{a.who}</div>
                    </div>
                  </InfoTip>
                  <Button
                    size="sm"
                    nativeButton={false}
                    render={<Link href={a.href} />}
                  >
                    {a.cta}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-base">Workflow health</CardTitle>
              <CardDescription>Agent tasks across all candidates right now.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <InfoTip text={HEALTH_INFO.running}>
                <div tabIndex={0} className="cursor-help rounded-lg bg-primary/10 p-2 text-primary">
                  <CheckCircle2 className="mx-auto size-4" />
                  <div className="font-heading text-xl font-semibold">{workflowHealth.running}</div>
                  <div className="text-xs">Running</div>
                </div>
                </InfoTip>
                <InfoTip text={HEALTH_INFO.waiting}>
                <div tabIndex={0} className="cursor-help rounded-lg bg-muted p-2">
                  <Hourglass className="mx-auto size-4 text-muted-foreground" />
                  <div className="font-heading text-xl font-semibold">{workflowHealth.waiting}</div>
                  <div className="text-xs text-muted-foreground">Waiting</div>
                </div>
                </InfoTip>
                <InfoTip text={HEALTH_INFO.failed}>
                <div tabIndex={0} className="cursor-help rounded-lg bg-destructive/10 p-2 text-destructive">
                  <CircleAlert className="mx-auto size-4" />
                  <div className="font-heading text-xl font-semibold">{workflowHealth.failed}</div>
                  <div className="text-xs">Failed</div>
                </div>
                </InfoTip>
              </div>
              <div className="flex items-center justify-between gap-2 rounded-lg border border-destructive/30 p-3 text-sm">
                <InfoTip text="The job search for Sam K. failed and is on its 2nd of 3 automatic retries. Re-run starts it again now.">
                  <span tabIndex={0} className="cursor-help">
                    Sam K.: Fetch jobs, retry 2/3
                  </span>
                </InfoTip>
                <Button size="sm" variant="outline">
                  Re-run
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-base">Recent activity</CardTitle>
              <CardDescription>The latest steps finished by agents and admins.</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="relative space-y-4 border-l pl-5">
                {recentActivity.map((r) => (
                  <li key={r.time + r.text} className="relative text-sm">
                    <span className="absolute -left-6.25 top-1.5 size-2 rounded-full bg-primary ring-4 ring-background" />
                    <div>{r.text}</div>
                    <div className="text-xs text-muted-foreground tabular-nums">{r.time}</div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default OverviewPage
