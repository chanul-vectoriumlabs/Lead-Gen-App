import Link from "next/link"
import { ArrowRight, Workflow } from "lucide-react"

import { CandidateCell } from "@/components/admin/candidate-cell"
import { InfoTip, STATUS_INFO } from "@/components/admin/info-tip"
import { StageLegend, StageTracker } from "@/components/admin/stage-tracker"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { candidates, STAGES } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const currentStage = (stages: string[]) => {
  const i = stages.findIndex((s) => s !== "done")
  return i === -1 ? "Complete" : STAGES[i]
}

export const CandidateProgress = () => {
  const total = candidates.length
  const needsYou = candidates.filter((c) => c.stages.includes("waiting")).length
  const failed = candidates.filter((c) => c.stages.includes("failed")).length
  const complete = candidates.filter((c) => c.stages.every((s) => s === "done")).length
  const active = total - complete - failed

  const summary = [
    {
      label: "Active",
      value: active,
      tone: "text-foreground",
      info: "Candidates moving through the workflow with nothing blocking them.",
    },
    {
      label: "Needs you",
      value: needsYou,
      tone: "text-primary",
      info: "Candidates waiting on a decision from you before the next stage can start.",
    },
    {
      label: "Failed",
      value: failed,
      tone: "text-destructive",
      info: "Candidates with a stage that stopped with an error and needs a retry.",
    },
    {
      label: "Complete",
      value: complete,
      tone: "text-foreground",
      info: "Candidates who finished all 5 stages: their jobs are selected and confirmed.",
    },
  ]

  // What each column shows.
  const columns: [string, string][] = [
    ["Candidate", "The candidate and the role they're looking for."],
    ["Current stage", "The first stage that isn't done yet: CV, Criteria, Search, Rank or Select."],
    ["Progress", "One bar per stage. Hover a bar to see that stage and its state."],
    ["Status", "What's happening for this candidate now. Hover a status for details."],
    ["Updated", "When this candidate's workflow last changed."],
  ]

  return (
    <Card className="self-start border border-border xl:col-span-2">
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Workflow className="size-4" />
          </div>
          <div>
            <CardTitle className="text-base">Candidate progress</CardTitle>
            <CardDescription>Live status across the 5-stage workflow</CardDescription>
          </div>
        </div>
        <CardAction>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/admin/candidates" />}
          >
            View all <ArrowRight />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {summary.map((s) => (
            <InfoTip key={s.label} text={s.info}>
              <div tabIndex={0} className="cursor-help rounded-xl border bg-muted/40 px-4 py-3">
                <div className={cn("font-heading text-2xl font-semibold", s.tone)}>
                  {s.value}
                </div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </InfoTip>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                {columns.map(([h, info]) => (
                  <TableHead
                    key={h}
                    className="h-10 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
                  >
                    <InfoTip text={info}>
                      <span tabIndex={0} className="cursor-help">
                        {h}
                      </span>
                    </InfoTip>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((c) => {
                const done = c.stages.filter((s) => s === "done").length
                return (
                  <TableRow key={c.id} className="cursor-pointer">
                    <TableCell className="py-3">
                      <Link href={`/admin/candidates/${c.id}`} className="block rounded-md hover:text-primary">
                        <CandidateCell name={c.name} subtitle={c.title} />
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">{currentStage(c.stages)}</TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        <StageTracker stages={c.stages} />
                        <p className="text-xs text-muted-foreground">
                          {done} of {STAGES.length} stages ({Math.round((done / STAGES.length) * 100)}%)
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {STATUS_INFO[c.status] ? (
                        <InfoTip text={STATUS_INFO[c.status]}>
                          <Badge tabIndex={0} variant={c.statusTone} className="cursor-help">
                            {c.status}
                          </Badge>
                        </InfoTip>
                      ) : (
                        <Badge variant={c.statusTone}>{c.status}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{c.updated}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter className="border-t">
        <StageLegend />
      </CardFooter>
    </Card>
  )
}
