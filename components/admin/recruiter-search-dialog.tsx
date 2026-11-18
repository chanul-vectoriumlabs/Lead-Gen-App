"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Clock, Loader2, Users } from "lucide-react"

import { CandidateCell } from "@/components/admin/candidate-cell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { getMatchDetail } from "@/lib/candidate-detail"
import type { Candidate } from "@/lib/mock-data"
import { markRecruitersFound } from "@/lib/recruiters-store"

type Job = { id: string; title: string; company: string }

const STEP_MS = 1100

/** After jobs are confirmed: finds recruiters for each selected job, one after another. */
export const RecruiterSearchDialog = ({
  candidate,
  jobs,
  onClose,
}: {
  candidate: Candidate
  /** Jobs to search; null closes the window. */
  jobs: Job[] | null
  onClose: () => void
}) => {
  // How many jobs have finished.
  const [done, setDone] = useState(0)
  const total = jobs?.length ?? 0
  // Avoid "Priya S.." at the end of a sentence.
  const name = candidate.name.replace(/\.$/, "")
  const finished = total > 0 && done >= total

  // Demo only: simulates the Recruiter Research Agent working through the jobs.
  useEffect(() => {
    if (!jobs?.length) return
    const timers = jobs.map((job, i) =>
      setTimeout(() => {
        markRecruitersFound(job.id)
        setDone(i + 1)
      }, STEP_MS * (i + 1))
    )
    return () => timers.forEach(clearTimeout)
  }, [jobs])

  const found = (jobs ?? [])
    .slice(0, done)
    .reduce((n, j) => n + (getMatchDetail(candidate, j.id)?.recruiters.length ?? 0), 0)

  return (
    <Dialog open={!!jobs} onOpenChange={(o) => !o && finished && onClose()}>
      <DialogContent showCloseButton={finished} className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {finished ? (
              <CheckCircle2 className="size-5 text-primary" />
            ) : (
              <Loader2 className="size-5 animate-spin text-primary" />
            )}
            {finished ? "Recruiters found" : "Finding recruiters"}
          </DialogTitle>
          <DialogDescription>
            {finished
              ? `${found} hiring contacts found across ${total} ${total === 1 ? "job" : "jobs"} for ${name}.`
              : `Selection confirmed. Looking for hiring contacts at each company for ${name}.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {Math.min(done, total)} of {total} jobs
            </span>
            <span>{found} recruiters</span>
          </div>
          <Progress value={total ? (Math.min(done, total) / total) * 100 : 0} />
        </div>

        <ul className="max-h-72 space-y-2 overflow-y-auto">
          {(jobs ?? []).map((job, i) => {
            const state = i < done ? "done" : i === done ? "running" : "queued"
            const count = getMatchDetail(candidate, job.id)?.recruiters.length ?? 0
            return (
              <li key={job.id} className="flex items-center gap-3 rounded-lg border px-3 py-2">
                <div className="min-w-0 flex-1">
                  <CandidateCell name={job.title} subtitle={job.company} />
                </div>
                {state === "done" ? (
                  <Badge variant="secondary" className="gap-1">
                    <Users className="size-3" /> {count} found
                  </Badge>
                ) : state === "running" ? (
                  <span className="flex items-center gap-1.5 text-xs text-primary">
                    <Loader2 className="size-3.5 animate-spin" /> Searching
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3.5" /> Waiting
                  </span>
                )}
                {state === "done" && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="cursor-pointer"
                    aria-label={`View recruiters for ${job.title} at ${job.company}`}
                    nativeButton={false}
                    render={<Link href={`/admin/candidates/${candidate.id}/jobs/${encodeURIComponent(job.id)}`} />}
                  >
                    <ArrowRight />
                  </Button>
                )}
              </li>
            )
          })}
        </ul>

        <DialogFooter>
          <Button className="cursor-pointer" disabled={!finished} onClick={onClose}>
            {finished ? "Done" : "Finding recruiters..."}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
