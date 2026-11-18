"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Building2,
  CalendarDays,
  ChevronRight,
  DollarSign,
  Eye,
  Globe,
  MapPin,
  Users,
  type LucideIcon,
} from "lucide-react"

import { CandidateCell } from "@/components/admin/candidate-cell"
import { DataTable, type Column } from "@/components/admin/data-table"
import { RowActions } from "@/components/admin/row-actions"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { candidateList, jobs, STAGES } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type Job = (typeof jobs)[number]
type PanelTab = "details" | "candidates"

// ---------- Placeholder job data. Replace with the job record from the API. ----------

const hash = (s: string) => [...s].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) % 9973, 7)

const skillsFor = (title: string) => {
  const t = title.toLowerCase()
  if (t.includes("data") || t.includes("analyst") || t.includes("bi ")) return ["SQL", "Python", "dbt", "Airflow", "Data modeling"]
  if (t.includes("ml")) return ["Python", "PyTorch", "MLOps", "AWS"]
  if (t.includes("designer")) return ["Figma", "User research", "Prototyping", "Design systems"]
  if (t.includes("product")) return ["Roadmapping", "Discovery", "Analytics", "Stakeholder management"]
  if (t.includes("devops") || t.includes("cloud")) return ["Kubernetes", "Terraform", "AWS", "CI/CD"]
  if (t.includes("qa")) return ["Test automation", "Playwright", "CI/CD", "API testing"]
  return ["TypeScript", "Node.js", "PostgreSQL", "AWS"]
}

/** Candidates this job was ranked for, best score first. */
const words = (s: string) =>
  s.toLowerCase().split(/\W+/).filter((w) => w.length > 2 && !["senior", "lead"].includes(w))

const linkedCandidates = (j: Job) => {
  const jobWords = words(j.title)
  return candidateList
    .filter((c) => c.stages[STAGES.indexOf("Rank")] === "done")
    .map((c) => ({ c, overlap: words(c.title).filter((w) => jobWords.includes(w)).length }))
    .filter(({ overlap }) => overlap > 0)
    .map(({ c, overlap }) => {
      const h = hash(c.id + j.id)
      const selected = c.stages[STAGES.indexOf("Select")] === "done" && h % 2 === 0
      return { candidate: c, score: Math.min(97, 64 + overlap * 12 + (h % 12)), status: selected ? "Selected" : "Ranked" }
    })
    .sort((a, b) => b.score - a.score)
}

// ---------- Table ----------

const columns: Column<Job>[] = [
  {
    key: "title",
    label: "Title",
    sortValue: (j) => j.title.toLowerCase(),
    cell: (j) => <span className="font-medium">{j.title}</span>,
  },
  { key: "company", label: "Company", sortValue: (j) => j.company.toLowerCase(), cell: (j) => j.company },
  { key: "location", label: "Location", sortValue: (j) => j.location.toLowerCase(), cell: (j) => j.location },
  { key: "source", label: "Source", sortValue: (j) => j.source.toLowerCase(), cell: (j) => j.source },
  {
    key: "candidates",
    label: "Candidates",
    sortValue: (j) => linkedCandidates(j).length,
    cell: (j) => {
      const n = linkedCandidates(j).length
      return (
        <span className={cn("flex items-center gap-1.5", n === 0 && "text-muted-foreground")}>
          <Users className="size-4 text-muted-foreground" /> {n}
        </span>
      )
    },
  },
  {
    key: "seen",
    label: "First seen",
    sortValue: (j) => j.seenDays,
    cell: (j) => <span className="text-muted-foreground">{j.seen}</span>,
  },
]

const filter = { label: "Source", allLabel: "All Sources", value: (j: Job) => j.source }

// ---------- Side panel ----------

const Fact = ({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: React.ReactNode }) => (
  <div className="flex items-start gap-3">
    <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="text-sm font-medium break-words">{value}</div>
    </div>
  </div>
)

const JobPanel = ({
  job,
  open,
  tab,
  onTab,
  onClose,
}: {
  job: Job | null
  open: boolean
  tab: PanelTab
  onTab: (t: PanelTab) => void
  onClose: () => void
}) => {
  const linked = job ? linkedCandidates(job) : []
  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full gap-0 data-[side=right]:sm:max-w-xl">
        {job && (
          <>
            <SheetHeader className="gap-2 border-b p-6">
              <div className="flex items-center gap-2">
                <Badge variant={job.status === "Open" ? "secondary" : "outline"}>{job.status}</Badge>
                <span className="text-xs text-muted-foreground">via {job.source}</span>
              </div>
              <SheetTitle className="font-heading text-xl">{job.title}</SheetTitle>
              <SheetDescription>
                {job.company} &middot; {job.location}
              </SheetDescription>
            </SheetHeader>

            <Tabs value={tab} onValueChange={(v) => onTab(v as PanelTab)} className="min-h-0 flex-1 gap-0">
              <TabsList variant="line" className="h-auto! w-full justify-start gap-1 rounded-none border-b px-4">
                <TabsTrigger value="details" className="h-11 flex-none cursor-pointer px-3 data-active:text-primary after:bg-primary">
                  Details
                </TabsTrigger>
                <TabsTrigger value="candidates" className="h-11 flex-none cursor-pointer gap-2 px-3 data-active:text-primary after:bg-primary">
                  Linked candidates
                  <Badge variant="secondary" className="h-5 px-1.5">
                    {linked.length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6 overflow-y-auto p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Fact icon={Building2} label="Company" value={job.company} />
                  <Fact icon={MapPin} label="Location" value={job.location} />
                  <Fact icon={DollarSign} label="Salary" value={job.salary === "Not listed" ? "Not listed" : job.salary} />
                  <Fact icon={CalendarDays} label="First seen" value={job.seen} />
                  <Fact icon={Globe} label="Source" value={job.source} />
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="text-sm font-medium">About the role</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {job.company} is hiring a {job.title} to join a growing team. You&apos;ll own core projects end to end,
                    work closely with product and engineering partners, and help raise the bar for quality and delivery.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Skills extracted from the posting</p>
                  <div className="flex flex-wrap gap-2">
                    {skillsFor(job.title).map((s) => (
                      <Badge key={s} variant="secondary">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="candidates" className="overflow-y-auto p-6">
                {linked.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-12 text-center">
                    <Users className="size-8 text-muted-foreground" />
                    <p className="font-medium">No linked candidates</p>
                    <p className="text-sm text-muted-foreground">This job hasn&apos;t been ranked for any candidate yet.</p>
                  </div>
                ) : (
                  <ul className="divide-y rounded-xl border">
                    {linked.map(({ candidate: c, score, status }) => (
                      <li key={c.id}>
                        <Link
                          href={`/admin/candidates/${c.id}`}
                          className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                        >
                          <div className="min-w-0 flex-1">
                            <CandidateCell name={c.name} subtitle={c.title} />
                          </div>
                          <Badge variant={status === "Selected" ? "default" : "outline"}>{status}</Badge>
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-semibold text-primary">
                            {score}
                          </span>
                          <ChevronRight className="size-4 text-muted-foreground" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

export const JobsTable = () => {
  // The job stays set while the panel animates closed.
  const [job, setJob] = useState<Job | null>(null)
  const [tab, setTab] = useState<PanelTab>("details")
  const [open, setOpen] = useState(false)
  const show = (j: Job, t: PanelTab) => {
    setJob(j)
    setTab(t)
    setOpen(true)
  }

  return (
    <>
      <DataTable
        data={jobs}
        columns={columns}
        getRowId={(j) => j.id}
        searchText={(j) => `${j.title} ${j.company} ${j.location} ${j.source}`}
        searchPlaceholder="Search by title, company, location or source"
        filter={filter}
        initialSort={{ key: "seen", dir: "asc" }}
        noun={["job", "jobs"]}
        rowActions={(j) => (
          <RowActions
            title={`${j.title}, ${j.company}`}
            actions={[
              { label: "View details", icon: Eye, onSelect: () => show(j, "details") },
              { label: "Linked candidates", icon: Users, onSelect: () => show(j, "candidates") },
            ]}
          />
        )}
      />
      <JobPanel job={job} open={open} tab={tab} onTab={setTab} onClose={() => setOpen(false)} />
    </>
  )
}
