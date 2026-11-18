"use client"

import { useMemo, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  AlertCircle,
  Briefcase,
  CalendarDays,
  Check,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  UserSearch,
  Users,
  Clock,
  Download,
  FileText,
  GraduationCap,
  Hourglass,
  Link2,
  Loader2,
  Lock,
  ListChecks,
  Mail,
  MapPin,
  Monitor,
  MoreHorizontal,
  PenLine,
  Plus,
  PauseCircle,
  Phone,
  Play,
  RotateCw,
  Shield,
  Sparkles,
  Trash2,
  Upload,
  UploadCloud,
  User,
  X,
  type LucideIcon,
} from "lucide-react"

import { CandidateCell } from "@/components/admin/candidate-cell"
import { RequestInfoButton, RequestsCard } from "@/components/admin/candidate-requests"
import {
  clearRecruiterStatuses,
  startRecruiterSearch,
  useRecruiterStatuses,
  type RecruiterStatus,
} from "@/lib/recruiters-store"
import { EmailCandidateButton } from "@/components/admin/email-candidate"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { candidateCvFileKey, saveCandidateCv, useCandidateCv, useCv, type StoredCv } from "@/components/user/cv-store"
import { CvViewer } from "@/components/user/cv-viewer"
import {
  getCandidateDetail,
  type CandidateDetail as CandidateDetailData,
  COUNTRIES,
  SENIORITY_LEVELS,
  WORK_TYPES,
  type Keywords,
  getMatchDetail,
} from "@/lib/candidate-detail"
import { clearJobStatuses, statusTone, useJobStatuses } from "@/lib/job-status-store"
import { clearApplied } from "@/lib/applied-store"
import { setSelectedJobs, useSelectedJobs } from "@/lib/selection-store"
import { DEMO_CANDIDATE_ID, defaultTopJobs, setTopJobs, TOP_JOB_OPTIONS, useTopJobs } from "@/lib/top-jobs-store"
import { candidateList, STAGES, type Candidate, type StageState } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
const initials = (n: string) =>
  n
    .split(" ")
    .map((p) => p[0])
    .join("")
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 2)
    .toUpperCase()

const Info = ({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: ReactNode }) => (
  <div className="flex items-start gap-3">
    <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="truncate text-sm font-medium">{value}</div>
    </div>
  </div>
)

const tableHead = "h-10 text-xs font-semibold tracking-wide text-muted-foreground uppercase"

const STATE_LABEL: Record<StageState, string> = {
  done: "Done",
  waiting: "Waiting",
  failed: "Failed",
  pending: "Not started",
}

/** The stage the candidate is on now (the first one not done), or the last one when all are done. */
const currentStage = (c: Candidate) => {
  const next = c.stages.findIndex((s) => s !== "done")
  return next === -1 ? c.stages.length - 1 : next
}

const Empty = ({
  icon: Icon,
  title,
  text,
  action,
}: {
  icon: LucideIcon
  title: string
  text: string
  action?: ReactNode
}) => (
  <div className="flex flex-col items-center gap-2 py-10 text-center">
    <Icon className="size-8 text-muted-foreground" />
    <p className="font-medium">{title}</p>
    <p className="max-w-md text-sm text-muted-foreground">{text}</p>
    {action && <div className="mt-2">{action}</div>}
  </div>
)

const PanelTitle = ({ title, text, action }: { title: string; text: string; action?: ReactNode }) => (
  <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
    <div>
      <p className="font-heading font-semibold">{title}</p>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
    {action}
  </div>
)

const SimpleTable = ({ head, children }: { head: string[]; children: ReactNode }) => (
  <div className="overflow-hidden rounded-xl border">
    <Table>
      <TableHeader className="bg-muted/50">
        <TableRow>
          {head.map((h) => (
            <TableHead key={h} className={tableHead}>
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>{children}</TableBody>
    </Table>
  </div>
)

const NOT_STARTED: Record<string, string> = {
  CV: "The candidate hasn't uploaded a CV yet.",
  Criteria: "The candidate confirms their search criteria after the CV is read.",
  Search: "The job search runs after the candidate confirms their criteria.",
  Rank: "Jobs are ranked against the CV when you select Start ranking in the Search step.",
  Select: "The candidate picks jobs to pursue from their top matches.",
}

const KEYWORD_GROUPS: {
  key: keyof Keywords
  label: string
  variant: "default" | "secondary" | "outline"
  placeholder: string
  /** Picked from a list instead of typed. */
  options?: string[]
}[] = [
  { key: "titles", label: "Job titles", variant: "default", placeholder: "Add a job title" },
  { key: "skills", label: "Skills", variant: "secondary", placeholder: "Add a skill" },
  { key: "countries", label: "Location", variant: "secondary", placeholder: "Add a country", options: COUNTRIES },
  { key: "workTypes", label: "Work type", variant: "secondary", placeholder: "Add a work type", options: WORK_TYPES },
  { key: "seniority", label: "Seniority", variant: "secondary", placeholder: "Add a level", options: SENIORITY_LEVELS },
  { key: "exclude", label: "Excluded", variant: "outline", placeholder: "Add a word to exclude" },
]

/** The keywords used for the job search. The admin can add and remove them. */
const KeywordsEditor = ({
  value,
  onSave,
  editable,
  onComplete,
}: {
  value: Keywords
  onSave: (k: Keywords) => void
  /** Only while Criteria is the current stage. */
  editable: boolean
  onComplete: () => void
}) => {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Keywords>(value)
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const shown = editing ? draft : value
  const dirty = JSON.stringify(draft) !== JSON.stringify(value)

  const add = (key: keyof Keywords, value?: string) => {
    const word = (value ?? inputs[key] ?? "").trim()
    if (!word) return
    setDraft((k) => (k[key].some((w) => w.toLowerCase() === word.toLowerCase()) ? k : { ...k, [key]: [...k[key], word] }))
    setInputs((i) => ({ ...i, [key]: "" }))
  }
  const remove = (key: keyof Keywords, word: string) => setDraft((k) => ({ ...k, [key]: k[key].filter((w) => w !== word) }))

  const start = () => {
    setDraft(value)
    setInputs({})
    setSaved(false)
    setEditing(true)
  }

  return (
    <>
      <PanelTitle
        title="Processed keywords"
        text="What the CV and the candidate's preferences were turned into for the job search."
        action={
          editing || !editable ? null : (
            <div className="flex items-center gap-3">
              {saved && (
                <span className="flex items-center gap-1.5 text-sm text-primary">
                  <CheckCircle2 className="size-4" /> Keywords saved
                </span>
              )}
              <Button variant="outline" className="cursor-pointer" onClick={start}>
                <PenLine /> Edit keywords
              </Button>
              <Button className="cursor-pointer" onClick={onComplete}>
                <Check /> Confirm keywords
              </Button>
            </div>
          )
        }
      />
      <div className={cn("mb-6 space-y-4", editing && "rounded-xl border border-primary/30 bg-primary/5 p-4")}>
        {KEYWORD_GROUPS.map(({ key, label, variant, placeholder, options }) => (
          <div key={key} className="grid gap-2 sm:grid-cols-[8rem_1fr] sm:items-start">
            <p className={cn("text-xs text-muted-foreground", editing ? "pt-2" : "pt-0.5")}>{label}</p>
            <div className="flex flex-wrap items-center gap-2">
              {shown[key].map((w) => (
                <Badge
                  key={w}
                  variant={variant}
                  className={cn(variant === "outline" && !editing && "text-muted-foreground line-through", editing && "gap-1 pr-1")}
                >
                  {w}
                  {editing && (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      aria-label={`Remove ${w}`}
                      className="size-4 cursor-pointer rounded-full"
                      onClick={() => remove(key, w)}
                    >
                      <X className="size-3" />
                    </Button>
                  )}
                </Badge>
              ))}
              {!editing && shown[key].length === 0 && <span className="text-xs text-muted-foreground">None</span>}
              {editing && options && (
                <Select
                  key={shown[key].join("|")}
                  value={null}
                  onValueChange={(v) => v && add(key, v as string)}
                  disabled={options.every((o) => shown[key].includes(o))}
                >
                  <SelectTrigger aria-label={placeholder} size="sm" className="h-7! w-44 cursor-pointer bg-background text-xs">
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false} className="max-h-72 p-1.5">
                    {options
                      .filter((o) => !shown[key].includes(o))
                      .map((o) => (
                        <SelectItem key={o} value={o} className="cursor-pointer rounded-md px-2.5 py-2">
                          {o}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
              {editing && !options && (
                <div className="flex items-center gap-1">
                  <Input
                    aria-label={placeholder}
                    placeholder={placeholder}
                    value={inputs[key] ?? ""}
                    onChange={(e) => setInputs((i) => ({ ...i, [key]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        add(key)
                      }
                    }}
                    className="h-7 w-44 bg-background text-xs"
                  />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={placeholder}
                    className="cursor-pointer"
                    disabled={!(inputs[key] ?? "").trim()}
                    onClick={() => add(key)}
                  >
                    <Plus />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        {editing && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-primary/20 pt-4">
            <p className="mr-auto text-xs text-muted-foreground">Press Enter to add a keyword. The next search uses these keywords.</p>
            <Button variant="outline" className="cursor-pointer bg-background" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button
              className="cursor-pointer"
              disabled={!dirty}
              onClick={() => {
                onSave(draft)
                setSaved(true)
                setEditing(false)
              }}
            >
              <Check /> Save keywords
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

// The current step when it's waiting on an agent or on the admin's Run search.
const CURRENT: Record<string, { icon: LucideIcon; title: string; text: string }> = {
  Search: {
    icon: Play,
    title: "Ready to search",
    text: "Criteria are confirmed. Run the search to find jobs for this candidate.",
  },
  Rank: {
    icon: Loader2,
    title: "Ranking in progress",
    text: "The jobs aren't ranked yet. Select Start ranking in the Search step to rank them against the CV.",
  },
}

/** Show the candidate's confirmed search criteria under the keywords in the Criteria step. */
const SHOW_SEARCH_CRITERIA = false

const CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]
const CV_MAX_MB = 10

/** Admin uploads (or replaces) a CV on the candidate's behalf. */
const AdminCvUpload = ({
  candidate,
  variant,
  onUploaded,
}: {
  candidate: Candidate
  variant: "dropzone" | "button"
  onUploaded?: () => void
}) => {
  const input = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const pick = async (file?: File) => {
    if (!file) return
    const okType = CV_TYPES.includes(file.type) || /\.(pdf|docx?)$/i.test(file.name)
    if (!okType) return setError("Please upload a PDF or Word file (.pdf, .doc, .docx).")
    if (file.size > CV_MAX_MB * 1024 * 1024) return setError(`The file is larger than ${CV_MAX_MB} MB.`)
    setError("")
    setBusy(true)
    await saveCandidateCv(candidate.id, file)
    // Demo only: simulates the CV Extraction Agent reading the CV.
    setTimeout(() => {
      setBusy(false)
      onUploaded?.()
    }, 1200)
  }

  const fileInput = (
    <input
      ref={input}
      type="file"
      accept=".pdf,.doc,.docx"
      className="hidden"
      aria-label={`Upload a CV for ${candidate.name}`}
      onChange={(e) => {
        void pick(e.target.files?.[0])
        e.target.value = ""
      }}
    />
  )

  if (variant === "button") {
    return (
      <>
        {fileInput}
        <Button variant="outline" className="cursor-pointer bg-background" disabled={busy} onClick={() => input.current?.click()}>
          {busy ? <Loader2 className="animate-spin" /> : <Upload />} Replace CV
        </Button>
        {error && <p className="basis-full text-xs font-medium text-destructive">{error}</p>}
      </>
    )
  }

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        aria-label={`Upload a CV for ${candidate.name}`}
        onClick={() => !busy && input.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !busy && input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDrag(true)
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDrag(false)
          if (!busy) void pick(e.dataTransfer.files[0])
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors",
          drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/50"
        )}
      >
        {fileInput}
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {busy ? <Loader2 className="size-6 animate-spin" /> : <UploadCloud className="size-6" />}
        </span>
        <div className="space-y-1">
          <p className="font-medium">{busy ? "Reading CV..." : `Upload a CV for ${candidate.name}`}</p>
          <p className="text-sm text-muted-foreground">
            Drag and drop or <span className="font-medium text-primary">browse files</span> &middot; PDF or Word, up to{" "}
            {CV_MAX_MB} MB
          </p>
        </div>
      </div>
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        {candidate.name} hasn&apos;t uploaded a CV yet. Upload one for them, or use Request info to ask for it. Uploading
        completes this step.
      </p>
    </div>
  )
}

const PAGE = 10
/** Rows-per-page options step by this much, up to the number of jobs found. */
const PAGE_STEP = 5

/** Jobs the search found, with paging. */
const FoundJobs = ({ jobs }: { jobs: CandidateDetailData["matches"] }) => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE)
  const totalPages = Math.max(1, Math.ceil(jobs.length / pageSize))
  const current = Math.min(page, totalPages)
  const start = (current - 1) * pageSize
  const newCount = jobs.filter((m) => m.origin === "New").length
  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge>{newCount} new</Badge>
        <Badge variant="secondary">{jobs.length - newCount} from database</Badge>
        <span>New jobs were added by this search; the rest were already in the database from earlier searches.</span>
      </div>
      <SimpleTable head={["Job", "Location", "Source", "Origin", "Posted"]}>
        {jobs.slice(start, start + pageSize).map((m) => (
          <TableRow key={m.id}>
            <TableCell className="py-3">
              <CandidateCell name={m.title} subtitle={m.company} />
            </TableCell>
            <TableCell className="text-muted-foreground">{m.location}</TableCell>
            <TableCell>
              <Badge variant="outline">{m.source}</Badge>
            </TableCell>
            <TableCell>
              {m.origin === "New" ? <Badge>New</Badge> : <Badge variant="secondary">In database</Badge>}
            </TableCell>
            <TableCell className="text-muted-foreground">{m.posted}</TableCell>
          </TableRow>
        ))}
      </SimpleTable>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span>
            Showing {jobs.length === 0 ? 0 : start + 1}-{Math.min(start + pageSize, jobs.length)} of {jobs.length} jobs
          </span>
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPageSize(Number(v))
                setPage(1)
              }}
            >
              <SelectTrigger size="sm" className="w-16" aria-label="Rows per page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="p-1.5">
                {Array.from(
                  { length: Math.max(1, Math.ceil(jobs.length / PAGE_STEP)) },
                  (_, i) => (i + 1) * PAGE_STEP
                ).map((n) => (
                  <SelectItem key={n} value={String(n)} className="rounded-md px-2.5 py-2">
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {totalPages > 1 && (
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  aria-disabled={current === 1}
                  className={cn(current === 1 && "pointer-events-none opacity-50")}
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(Math.max(1, current - 1))
                  }}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === current}
                    className={cn(
                      p === current &&
                        "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                    )}
                    onClick={(e) => {
                      e.preventDefault()
                      setPage(p)
                    }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  aria-disabled={current === totalPages}
                  className={cn(current === totalPages && "pointer-events-none opacity-50")}
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(Math.min(totalPages, current + 1))
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </>
  )
}

/** Shown while Run search is fetching jobs. */
const SearchingJobs = ({ sources }: { sources: string[] }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-primary">
      <Loader2 className="size-4 animate-spin" /> Searching {sources.join(", ")} for matching jobs...
    </div>
    <div className="space-y-2">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-48" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
      ))}
    </div>
  </div>
)

/** Match score shown the same way in the Rank and Select tables. */
const ScoreBadge = ({ score }: { score: number }) => (
  <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-semibold text-primary">
    {score}
  </span>
)

/** Opens the job's details page for this candidate. */
const ViewJob = ({ candidateId, jobId, disabled }: { candidateId: string; jobId: string; disabled?: boolean }) =>
  disabled ? (
    <Tooltip>
      <TooltipTrigger render={<span tabIndex={0} />}>
        <Button variant="outline" size="sm" disabled>
          View job <ArrowRight />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Available once the recruiter search has run for this job</TooltipContent>
    </Tooltip>
  ) : (
  <Button
    variant="outline"
    size="sm"
    className="cursor-pointer bg-background"
    nativeButton={false}
    render={<Link href={`/admin/candidates/${candidateId}/jobs/${encodeURIComponent(jobId)}`} />}
  >
    View job <ArrowRight />
  </Button>
)

/** Where the Recruiter Research Agent is for one job. */
const RecruiterBadge = ({ status }: { status?: RecruiterStatus }) =>
  status === "searching" ? (
    <Badge variant="outline" className="text-primary">
      <Loader2 className="animate-spin" /> Finding recruiters
    </Badge>
  ) : status === "found" ? (
    <Badge>
      <Users /> Recruiters found
    </Badge>
  ) : status === "none" ? (
    <Badge variant="destructive">Can&apos;t find recruiters</Badge>
  ) : (
    <span className="text-xs text-muted-foreground">Not searched</span>
  )

/** What happened at one workflow stage. */
const StagePanel = ({
  stage,
  state,
  candidate,
  d,
  cv,
  isDemoUser,
  cvFileKey,
  onCvUploaded,
  topN,
  setTopN,
  selectedIds,
  setSelection,
  editable,
  topNEditable,
  onComplete,
  keywords,
  onSaveKeywords,
  searching,
  searchAction,
  rankAction,
  canSelect,
  onGoToRank,
  onConfirmSelection,
}: {
  stage: (typeof STAGES)[number]
  state: StageState
  candidate: Candidate
  d: CandidateDetailData
  cv: { name: string } & Partial<StoredCv>
  isDemoUser: boolean
  /** Stored file for an admin-uploaded CV. */
  cvFileKey?: string
  /** The admin uploaded a CV while the CV step was current. */
  onCvUploaded: () => void
  topN: number
  setTopN: (n: number) => void
  selectedIds: string[]
  setSelection: (ids: string[], on: boolean) => void
  /** This is the current stage, so the admin can act on it. */
  editable: boolean
  /** Top N can change until the candidate's jobs are selected. */
  topNEditable: boolean
  /** Completes this stage and unlocks the next one. */
  onComplete: () => void
  keywords: Keywords
  onSaveKeywords: (k: Keywords) => void
  /** Run search is in progress. */
  searching: boolean
  /** The Run search / Re-run search button, shown in the Search step. */
  searchAction: ReactNode
  /** The Start ranking button, shown in the Search step once jobs are found. */
  rankAction: ReactNode
  /** The Select step is current, so jobs can be picked from the ranked list too. */
  canSelect: boolean
  /** Opens the Rank step to change the picked jobs. */
  onGoToRank: () => void
  /** Confirms the picked jobs, completing the Select step. */
  onConfirmSelection: () => void
}) => {
  // Application status of each selected job (set on the job page).
  const jobStatuses = useJobStatuses(selectedIds)
  // Recruiter Research Agent status of each job; it runs in the background.
  const recruiterStatuses = useRecruiterStatuses()
  // Stages the admin can act on while they're current; the rest wait for agents or the candidate.
  const actionable = editable && (stage === "Criteria" || stage === "Select")
  if (stage === "Search" && searching) return <SearchingJobs sources={d.search.sources} />
  if (state === "pending" && !actionable)
    return editable && CURRENT[stage] ? (
      <Empty
        icon={CURRENT[stage].icon}
        title={CURRENT[stage].title}
        text={CURRENT[stage].text}
        action={stage === "Search" ? searchAction : undefined}
      />
    ) : (
      <Empty icon={Hourglass} title={`${stage}: not started`} text={NOT_STARTED[stage]} />
    )

  const banner =
    state === "done" ? (
      <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="size-3.5" /> This step is complete and locked, so it can&apos;t be edited.
      </div>
    ) : state === "waiting" ? (
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-primary">
        <Hourglass className="size-4" /> Waiting for the candidate. An email reminder was sent.
      </div>
    ) : state === "failed" ? (
      <div className="mb-4 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
        <AlertCircle className="size-4" /> This step failed: source sync timed out. Retrying automatically (attempt 2 of 3).
        <Button size="sm" variant="outline" className="ml-auto cursor-pointer">
          <RotateCw /> Retry now
        </Button>
      </div>
    ) : null

  const selected = d.matches.filter((m) => selectedIds.includes(m.id))
  const shown = d.matches.slice(0, topN)
  const shownSelected = shown.filter((m) => selectedIds.includes(m.id)).length
  const allShownSelected = shown.length > 0 && shownSelected === shown.length
  const someShownSelected = shownSelected > 0

  // Confirms the picked jobs, completing the workflow and opening them in the Select step.
  const confirmButton = (
    <Button className="cursor-pointer" disabled={selectedIds.length === 0} onClick={onConfirmSelection}>
      <Check /> Confirm selected jobs
      <Badge className="size-5 rounded-full bg-primary-foreground p-0 text-primary">{selectedIds.length}</Badge>
    </Button>
  )

  // Find recruiters always runs for every selected job, so jobs with none found get another try.
  const toSearch = selected
  const recruitersSearching = selected.some((m) => recruiterStatuses[m.id] === "searching")
  // Every job has a result (found or not), so the all-jobs run is done and locked.
  const searchedAll =
    selected.length > 0 &&
    selected.every((m) => recruiterStatuses[m.id] === "found" || recruiterStatuses[m.id] === "none")
  // Demo only: about one job in four has no recruiters to find.
  const findRecruiters = () =>
    startRecruiterSearch(
      toSearch.map((m) => ({
        id: m.id,
        found:
          recruiterStatuses[m.id] === "found" ||
          (!!getMatchDetail(candidate, m.id)?.recruiters.length &&
            [...m.id].reduce((n, c) => n + c.charCodeAt(0), 0) % 4 !== 0),
      }))
    )

  // Shown in the Rank and Select steps while jobs can be picked.
  const selectableTable = (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-12 pl-4">
              <Checkbox
                aria-label="Select all shown jobs"
                className="cursor-pointer"
                checked={allShownSelected}
                indeterminate={someShownSelected && !allShownSelected}
                onCheckedChange={(on) => setSelection(shown.map((m) => m.id), !!on)}
              />
            </TableHead>
            {["Job", "Score", "Why", "Status"].map((h) => (
              <TableHead key={h} className={tableHead}>
                {h}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {shown.map((m) => {
            const on = selectedIds.includes(m.id)
            return (
              <TableRow
                key={m.id}
                data-state={on ? "selected" : undefined}
                className="cursor-pointer"
                onClick={() => setSelection([m.id], !on)}
              >
                <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    aria-label={`Select ${m.title} at ${m.company}`}
                    className="cursor-pointer"
                    checked={on}
                    onCheckedChange={(v) => setSelection([m.id], !!v)}
                  />
                </TableCell>
                <TableCell className="py-3">
                  <CandidateCell name={m.title} subtitle={m.company} />
                </TableCell>
                <TableCell>
                  <ScoreBadge score={m.score} />
                </TableCell>
                <TableCell className="text-muted-foreground">{m.reason}</TableCell>
                <TableCell>
                  <Badge variant={on ? "default" : "outline"}>{on ? "Selected" : "Not selected"}</Badge>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )

  switch (stage) {
    case "CV":
      if (state !== "done") {
        return (
          <>
            {banner}
            <AdminCvUpload candidate={candidate} variant="dropzone" onUploaded={onCvUploaded} />
          </>
        )
      }
      return (
        <>
          {banner}
          {/* Uploaded file */}
          <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border bg-muted/40 p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{cv.name}</p>
              <p className="text-xs text-muted-foreground">
                {[
                  cv.size ? `${Math.max(1, Math.round(cv.size / 1024))} KB` : null,
                  `Uploaded ${cv.uploadedAt ? new Date(cv.uploadedAt).toLocaleDateString() : d.joined}`,
                  "Read by the CV Extraction Agent",
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
            <CvViewer cv={cv} loadFile={isDemoUser} fileKey={cvFileKey} fallback={<ProfileCv candidate={candidate} detail={d} />} />
            <AdminCvUpload candidate={candidate} variant="button" />
          </div>

          <PanelTitle title="Candidate details" text="Contact details from the CV and the candidate's account." />
          <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Info icon={User} label="Full name" value={candidate.name} />
            <Info icon={Briefcase} label="Current title" value={candidate.title} />
            <Info icon={Mail} label="Email" value={d.email} />
            <Info icon={Phone} label="Phone" value={d.phone} />
            <Info icon={MapPin} label="Location" value={keywords.countries.join(", ") || candidate.location} />
            <Info icon={Link2} label="LinkedIn" value={d.linkedin} />
            <Info icon={CalendarDays} label="Joined" value={d.joined} />
            <Info icon={Clock} label="Last active" value={d.lastSeen} />
          </div>

          <PanelTitle title="Extracted from CV" text="Facts the CV Extraction Agent read from the CV." />
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Info icon={Briefcase} label="Position level" value={d.profile.level} />
              <Info icon={Clock} label="Experience" value={`${d.profile.years} years`} />
              <Info icon={GraduationCap} label="Education" value={d.profile.education} />
              <Info
                icon={Shield}
                label="Certifications"
                value={d.profile.certifications.length ? d.profile.certifications.join(", ") : "Unknown, not stated in CV"}
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Skills</p>
              <div className="flex flex-wrap gap-2">
                {d.profile.skills.map((s) => (
                  <Badge key={s} variant="secondary">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid gap-2 lg:grid-cols-2">
              {d.profile.experience.map((x) => (
                <div key={x.company} className="flex justify-between gap-3 rounded-lg border p-3 text-sm">
                  <span>
                    <span className="font-medium">{x.role}</span>, {x.company}
                  </span>
                  <span className="text-muted-foreground">{x.years}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )

    case "Criteria":
      return (
        <>
          {banner}
          <KeywordsEditor
            value={keywords}
            onSave={onSaveKeywords}
            editable={actionable}
            onComplete={onComplete}
          />

          {/* Search criteria: hidden for now. Set SHOW_SEARCH_CRITERIA to true to bring it back. */}
          {SHOW_SEARCH_CRITERIA && (
          <>
          <PanelTitle title="Search criteria" text="Confirmed by the candidate before the job search." />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Info icon={Briefcase} label="Target titles" value={d.preferences.titles.join(", ")} />
            <Info icon={MapPin} label="Locations" value={d.preferences.locations} />
            <Info icon={Monitor} label="Work mode" value={d.preferences.workMode} />
            <Info icon={FileText} label="Minimum salary" value={d.preferences.salary} />
            <Info icon={Shield} label="Work eligibility" value={d.preferences.authorization} />
          </div>
          </>
          )}
        </>
      )

    case "Search":
      return (
        <>
          {/* The search can still be re-run until ranking starts, so it isn't locked yet. */}
          {!(state === "done" && rankAction) && banner}
          <PanelTitle
            title={`Jobs found (${d.matches.length})`}
            text={`Sources searched: ${d.search.sources.join(", ")}. Start ranking to rank these jobs against the CV.`}
            action={
              <div className="flex flex-wrap items-center gap-2">
                {searchAction}
                {rankAction}
              </div>
            }
          />
          {state === "failed" ? (
            <Empty icon={AlertCircle} title="No results yet" text="Results appear here once the search finishes." />
          ) : (
            <FoundJobs jobs={d.matches} />
          )}
        </>
      )

    case "Rank":
      return (
        <>
          {/* Jobs can still be picked until the selection is confirmed, so it isn't locked yet. */}
          {!canSelect && banner}
          <PanelTitle
            title="Top jobs for this candidate"
            text="Choose how many of the best-ranked jobs this candidate sees on their dashboard and in emails."
            action={
              <div className="flex items-center gap-2">
                <Label htmlFor="top-jobs" className="text-muted-foreground">
                  Show
                </Label>
                <Select
                  items={TOP_JOB_OPTIONS.map((n) => ({ value: String(n), label: `Top ${n}` }))}
                  value={String(topN)}
                  onValueChange={(v) => setTopN(Number(v))}
                  disabled={!topNEditable}
                >
                  <SelectTrigger id="top-jobs" className="w-28 cursor-pointer bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false} className="p-1.5">
                    {TOP_JOB_OPTIONS.map((n) => (
                      <SelectItem key={n} value={String(n)} className="cursor-pointer rounded-md px-2.5 py-2">
                        Top {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            }
          />
          {canSelect ? (
            <>
              {selectableTable}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  {selectedIds.length} {selectedIds.length === 1 ? "job" : "jobs"} selected. Confirming completes the
                  workflow.
                </p>
                {confirmButton}
              </div>
            </>
          ) : (
            <SimpleTable head={["Job", "Score", "Why", "Status"]}>
              {shown.map((m) => {
                const on = selectedIds.includes(m.id)
                return (
                  <TableRow key={m.id}>
                    <TableCell className="py-3">
                      <CandidateCell name={m.title} subtitle={m.company} />
                    </TableCell>
                    <TableCell>
                      <ScoreBadge score={m.score} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{m.reason}</TableCell>
                    <TableCell>
                      <Badge variant={on ? "default" : "outline"}>{on ? "Selected" : "Not selected"}</Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </SimpleTable>
          )}
        </>
      )

    case "Select":
      if (!actionable) {
        return (
          <>
            {/* Recruiters can still be found here, so the "locked" note isn't shown. */}
            {state !== "done" && banner}
            <PanelTitle
              title="Jobs selected to pursue"
              text="Picked from the top matches."
              action={
                selected.length > 0 &&
                (searchedAll ? (
                  // Runs once for all jobs. After that, a job is searched again from its own page.
                  <Tooltip>
                    <TooltipTrigger render={<span tabIndex={0} />}>
                      <Button disabled>
                        <Lock /> Find all recruiters
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Recruiters were already searched for all jobs. Use View job to search again for one job.
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Button
                    className="cursor-pointer"
                    disabled={recruitersSearching || toSearch.length === 0}
                    onClick={findRecruiters}
                  >
                    {recruitersSearching ? <Loader2 className="animate-spin" /> : <UserSearch />}
                    {recruitersSearching ? "Finding recruiters..." : "Find all recruiters"}
                    {!recruitersSearching && toSearch.length > 0 && (
                      <Badge className="size-5 rounded-full bg-primary-foreground p-0 text-primary">
                        {toSearch.length}
                      </Badge>
                    )}
                  </Button>
                ))
              }
            />
            {recruitersSearching && (
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-primary">
                <Loader2 className="size-4 animate-spin" /> The Recruiter Research Agent is running in the background. Each
                job updates when it finishes.
              </div>
            )}
            {selected.length === 0 ? (
              <Empty icon={Sparkles} title="No jobs selected yet" text="Jobs are selected after ranking." />
            ) : (
              <SimpleTable head={["Job", "Score", "Why", "Status", "Recruiters", ""]}>
                {selected.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="py-3">
                      <CandidateCell name={m.title} subtitle={m.company} />
                    </TableCell>
                    <TableCell>
                      <ScoreBadge score={m.score} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{m.reason}</TableCell>
                    <TableCell>
                      {jobStatuses[m.id] ? (
                        <Badge variant={statusTone(jobStatuses[m.id])}>{jobStatuses[m.id]}</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not started</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <RecruiterBadge status={recruiterStatuses[m.id]} />
                    </TableCell>
                    <TableCell className="text-right">
                      <ViewJob
                        candidateId={candidate.id}
                        jobId={m.id}
                        // Also open when none were found, so the search can be retried from the job page.
                        disabled={!recruiterStatuses[m.id] || recruiterStatuses[m.id] === "searching"}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </SimpleTable>
            )}
          </>
        )
      }
      return (
        <>
          {banner}
          <PanelTitle
            title="Selected jobs"
            text={`The jobs picked from ${candidate.name}'s top ${topN} matches. Confirming completes the workflow.`}
            action={
              <Button variant="outline" className="cursor-pointer bg-background" onClick={onGoToRank}>
                <ArrowLeft /> Change selection
              </Button>
            }
          />
          {selected.length === 0 ? (
            <Empty
              icon={Sparkles}
              title="No jobs selected yet"
              text="Pick the jobs this candidate should pursue from the ranked list."
              action={
                <Button className="cursor-pointer" onClick={onGoToRank}>
                  Go to Rank <ArrowRight />
                </Button>
              }
            />
          ) : (
            <>
              <SimpleTable head={["Job", "Score", "Why", ""]}>
                {selected.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="py-3">
                      <CandidateCell name={m.title} subtitle={m.company} />
                    </TableCell>
                    <TableCell>
                      <ScoreBadge score={m.score} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{m.reason}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="cursor-pointer"
                        aria-label={`Remove ${m.title} at ${m.company}`}
                        onClick={() => setSelection([m.id], false)}
                      >
                        <X />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </SimpleTable>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  {selectedIds.length} {selectedIds.length === 1 ? "job" : "jobs"} selected. These are the jobs the
                  candidate will pursue.
                </p>
                {confirmButton}
              </div>
            </>
          )}
        </>
      )

  }
}

const CvHeading = ({ children }: { children: ReactNode }) => (
  <h3 className="mt-6 mb-2 border-b pb-1 text-[11px] font-bold tracking-[0.15em] text-primary uppercase">{children}</h3>
)

/** A CV page built from the candidate's extracted profile (placeholder until the file is stored server-side). */
export const ProfileCv = ({ candidate: c, detail: d }: { candidate: Candidate; detail: CandidateDetailData }) => (
  <div className="mx-auto w-full max-w-[210mm] bg-card px-[18mm] py-[16mm] text-[13px] leading-relaxed text-card-foreground shadow-xl ring-1 ring-foreground/5">
    <p className="font-heading text-[26px] leading-tight font-semibold">{c.name}</p>
    <p className="text-[15px] font-medium text-primary">{c.title}</p>
    <p className="text-[11px] text-muted-foreground">
      {d.email} &middot; {d.phone} &middot; {c.location} &middot; {d.linkedin}
    </p>

    <CvHeading>Summary</CvHeading>
    <p>
      {d.profile.level} {c.title.toLowerCase()} with {d.profile.years} years of experience. Skilled in{" "}
      {d.profile.skills.slice(0, 4).join(", ")}.
    </p>

    <CvHeading>Experience</CvHeading>
    <div className="space-y-3">
      {d.profile.experience.map((x) => (
        <div key={x.company} className="flex items-baseline justify-between gap-3">
          <p>
            <span className="font-semibold">{x.role}</span>, <span className="text-muted-foreground">{x.company}</span>
          </p>
          <span className="shrink-0 text-[11px] text-muted-foreground">{x.years}</span>
        </div>
      ))}
    </div>

    <CvHeading>Skills</CvHeading>
    <p>{d.profile.skills.join("  ·  ")}</p>

    <CvHeading>Education</CvHeading>
    <p>{d.profile.education}</p>

    {d.profile.certifications.length > 0 && (
      <>
        <CvHeading>Certifications</CvHeading>
        <p>{d.profile.certifications.join(", ")}</p>
      </>
    )}
  </div>
)

export const CandidateDetail = () => {
  const { id } = useParams<{ id: string }>()
  const candidate = candidateList.find((c) => c.id === id)
  const d = useMemo(() => (candidate ? getCandidateDetail(candidate) : null), [candidate])
  // Saved per candidate; the candidate's dashboard shows only this many jobs.
  const topN = useTopJobs(id, defaultTopJobs(candidate?.topJobs ?? 0))
  const setTopN = (n: number) => setTopJobs(id, n)
  const uploadedCv = useCv()
  // A CV the admin uploaded for this candidate takes priority.
  const adminCv = useCandidateCv(id)
  // Confirmed jobs to pursue, shared with the job pages (only selected jobs can be viewed).
  const confirmedIds = useSelectedJobs(id, d ? d.matches.filter((m) => m.status === "Selected").map((m) => m.id) : [])
  // Jobs ticked in the Rank step. Nothing is picked automatically; they're saved when confirmed.
  const [draftIds, setDraftIds] = useState<string[]>([])
  // Keywords edited by the admin (null = as processed). Placeholder: saved through the API.
  const [keywords, setKeywords] = useState<Keywords | null>(null)
  // Opens on the stage the candidate is at now (Search while ranking hasn't been started).
  const [stageTab, setStageTab] = useState<string>(() => {
    if (!candidate) return STAGES[0]
    const at = currentStage(candidate)
    if (candidate.stages[at] !== "pending") return STAGES[at]
    // Rank and Select stay locked until ranking is started and the selection is confirmed.
    return STAGES[at] === "Rank" ? "Search" : STAGES[at] === "Select" ? "Rank" : STAGES[at]
  })
  // Stage progress. Placeholder: comes from the workflow API.
  const [stages, setStages] = useState<StageState[]>(() => candidate?.stages ?? [])
  // The current stage is the first one not done (-1 when all are done). Later stages are locked.
  const current = stages.findIndex((s) => s !== "done")
  const selectDone = stages[STAGES.indexOf("Select")] === "done"
  const selectedIds = selectDone ? confirmedIds : draftIds
  const setSelection = (ids: string[], on: boolean) =>
    setDraftIds((s) => (on ? [...new Set([...s, ...ids])] : s.filter((x) => !ids.includes(x))))
  const completeStage = (i: number) => {
    setStages((s) => s.map((x, j) => (j === i ? "done" : x)))
    // Move on to the stage that just unlocked.
    if (i + 1 < STAGES.length) setStageTab(STAGES[i + 1])
  }

  // Search is locked until CV and Criteria are done; it reads "Run search" until it has run once.
  const searchAt = STAGES.indexOf("Search")
  const searchLocked = current >= 0 && current < searchAt
  // Also locked once the workflow is complete (jobs selected and confirmed).
  const finalStage = current === -1
  const searchDone = stages[searchAt] === "done"
  const [searching, setSearching] = useState(false)
  const rankAt = STAGES.indexOf("Rank")
  const rankDone = stages[rankAt] === "done"
  const [ranking, setRanking] = useState(false)
  // Demo only: simulates the Job Search agent, which finishes Search. New results need ranking again.
  const runSearch = () => {
    setSearching(true)
    setStageTab("Search")
    setTimeout(() => {
      setStages((s) => s.map((x, j) => (j === searchAt ? "done" : j === rankAt ? "pending" : x)))
      // Show the jobs that were just found.
      setStageTab("Search")
      setSearching(false)
    }, 1500)
  }
  // Demo only: simulates the Job Matching agent, which finishes Rank and unlocks the ranked view.
  const startRanking = () => {
    setRanking(true)
    setTimeout(() => {
      setStages((s) => s.map((x, j) => (j === rankAt ? "done" : x)))
      // A new ranking starts with nothing picked.
      setDraftIds([])
      setStageTab("Rank")
      setRanking(false)
    }, 1500)
  }

  if (!candidate || !d) {
    return (
      <Card className="border border-border">
        <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
          <p className="font-heading text-lg font-semibold">Candidate not found</p>
          <Button nativeButton={false} render={<Link href="/admin/candidates" />}>
            Back to candidates
          </Button>
        </CardContent>
      </Card>
    )
  }

  const done = stages.filter((s) => s === "done").length

  const searchButton =
    searchLocked || finalStage ? (
      <Tooltip>
        <TooltipTrigger render={<span tabIndex={0} />}>
          <Button disabled>
            <Lock /> {searchDone ? "Re-run search" : "Run search"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {searchLocked
            ? "Complete the CV and Criteria steps first"
            : "Jobs are already selected for this candidate, so the search can't be re-run"}
        </TooltipContent>
      </Tooltip>
    ) : (
      <Button
        variant={searchDone && !rankDone ? "outline" : "default"}
        className="cursor-pointer"
        disabled={searching || ranking}
        onClick={runSearch}
      >
        {searching ? <Loader2 className="animate-spin" /> : searchDone ? <RotateCw /> : <Play />}
        {searching ? "Searching..." : searchDone ? "Re-run search" : "Run search"}
      </Button>
    )

  // Ranking starts once the search has found jobs, and unlocks the Rank step when it finishes.
  const rankButton =
    searchDone && !rankDone && !finalStage ? (
      <Button className="cursor-pointer" disabled={ranking || searching} onClick={startRanking}>
        {ranking ? <Loader2 className="animate-spin" /> : <ListChecks />}
        {ranking ? "Ranking..." : "Start ranking"}
      </Button>
    ) : null

  const stats = [
    { label: "Progress", value: `${done} of ${STAGES.length}`, icon: ListChecks },
    { label: "Top jobs shown", value: stages[STAGES.indexOf("Rank")] === "done" ? `Top ${topN}` : "Not ranked yet", icon: Briefcase },
    { label: "Last active", value: d.lastSeen, icon: Clock },
  ]
  // The demo user's uploaded CV is in this browser; other candidates get one built from their profile.
  // Admin-uploaded CV first, then the demo user's own upload (same browser), else one built from the profile.
  const isDemoUser = !!adminCv || candidate.id === DEMO_CANDIDATE_ID
  const cvFileKey = adminCv ? candidateCvFileKey(candidate.id) : undefined
  const cv = adminCv ?? (candidate.id === DEMO_CANDIDATE_ID && uploadedCv ? uploadedCv : { name: `${candidate.name.split(" ")[0]}_CV.pdf` })

  return (
    <>

      {/* Header */}
      <Card className="border border-border">
        <CardContent className="flex flex-wrap items-start gap-5">
          <Avatar className="size-16">
            <AvatarFallback className="bg-primary text-xl font-semibold text-primary-foreground">
              {initials(candidate.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-60 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-2xl font-semibold tracking-tight">{candidate.name}</h1>
              <Badge variant={candidate.statusTone}>{candidate.status}</Badge>
            </div>
            <p className="text-muted-foreground">{candidate.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <EmailCandidateButton name={candidate.name} email={d.email} />
            <RequestInfoButton candidateId={candidate.id} candidateName={candidate.name} />
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="More actions" />}>
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 p-1.5">
                <DropdownMenuItem className="py-2">
                  <PauseCircle /> Pause automation
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2">
                  <Download /> Export candidate data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" className="py-2">
                  <Trash2 /> Delete candidate
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="grid basis-full gap-x-8 gap-y-3 border-t pt-4 sm:grid-cols-2 xl:grid-cols-4">
            <Info icon={Mail} label="Email" value={d.email} />
            <Info icon={Phone} label="Phone" value={d.phone} />
            <Info icon={MapPin} label="Location" value={(keywords ?? d.keywords).countries.join(", ") || candidate.location} />
            <Info icon={Link2} label="LinkedIn" value={d.linkedin} />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} size="sm" className="border border-border">
            <CardContent className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <s.icon className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs text-muted-foreground">{s.label}</p>
                <p className="truncate font-heading font-semibold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Documents and information asked from the candidate */}
      <RequestsCard candidateId={candidate.id} />

      {/* Workflow: each stage is a tab */}
      <Tabs value={stageTab} onValueChange={(v) => setStageTab(v as string)} className="gap-0">
        <Card className="gap-0 border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Workflow progress</CardTitle>
            <CardDescription>Where this candidate is in the 5-stage workflow. Select a stage to see its details.</CardDescription>
          </CardHeader>
          <CardContent>
            <TabsList variant="line" className="grid h-auto! w-full grid-cols-2 gap-3 p-0 sm:grid-cols-5">
              {STAGES.map((stage, i) => {
                const state = stages[i]
                // Later stages stay locked until the ones before them are complete.
                // Rank stays locked until ranking is started, and Select until the selection is confirmed.
                const locked = (current >= 0 && i > current) || ((stage === "Rank" || stage === "Select") && state === "pending")
                return (
                  <TabsTrigger
                    key={stage}
                    value={stage}
                    disabled={locked}
                    className={cn(
                      "h-auto flex-col gap-2 rounded-lg border-transparent p-3 text-center whitespace-normal after:bg-primary hover:bg-primary/5 data-active:border-transparent data-active:bg-primary/5 group-data-horizontal/tabs:after:bottom-[-7px]",
                      state === "failed" && "border-destructive/50 bg-destructive/5"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full text-xs font-semibold",
                        state === "done" && "bg-primary text-primary-foreground",
                        state === "waiting" && "bg-primary/15 text-primary",
                        state === "failed" && "bg-destructive text-primary-foreground",
                        state === "pending" && !locked && "bg-primary/15 text-primary",
                        locked && "bg-muted text-muted-foreground"
                      )}
                    >
                      {state === "done" ? (
                        <Check className="size-4" />
                      ) : state === "failed" ? (
                        <AlertCircle className="size-4" />
                      ) : locked ? (
                        <Lock className="size-3.5" />
                      ) : (
                        i + 1
                      )}
                    </span>
                    <span className={cn("text-xs font-medium text-foreground", locked && "text-muted-foreground")}>{stage}</span>
                    <span className="text-[10px] font-normal text-muted-foreground">
                      {locked ? "Locked" : state === "pending" ? "Up next" : STATE_LABEL[state]}
                    </span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </CardContent>

          {STAGES.map((stage, i) => (
            <TabsContent key={stage} value={stage} className="border-t px-6 pt-6">
              <StagePanel
                stage={stage}
                state={stages[i]}
                candidate={candidate}
                d={d}
                cv={cv}
                isDemoUser={isDemoUser}
                cvFileKey={cvFileKey}
                onCvUploaded={() => completeStage(0)}
                topN={topN}
                setTopN={setTopN}
                selectedIds={selectedIds}
                setSelection={setSelection}
                editable={i === current}
                topNEditable={current >= 0 && current <= STAGES.indexOf("Select")}
                keywords={keywords ?? d.keywords}
                onSaveKeywords={setKeywords}
                searching={searching}
                searchAction={searchButton}
                rankAction={rankButton}
                canSelect={current === STAGES.indexOf("Select")}
                onGoToRank={() => setStageTab("Rank")}
                onConfirmSelection={() => {
                  // Save the picked jobs so the job pages can open them.
                  setSelectedJobs(id, draftIds)
                  // A new selection starts fresh: no recruiter search, application or status yet.
                  clearRecruiterStatuses(draftIds)
                  clearApplied(draftIds)
                  clearJobStatuses(draftIds)
                  completeStage(STAGES.indexOf("Select"))
                  // Show the confirmed jobs in the Select step.
                  setStageTab("Select")
                }}
                onComplete={() => completeStage(i)}
              />
            </TabsContent>
          ))}
        </Card>
      </Tabs>
    </>
  )
}
