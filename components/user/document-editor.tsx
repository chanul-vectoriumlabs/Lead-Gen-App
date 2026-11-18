"use client"

import { useState, type ReactNode } from "react"
import {
  Check,
  Download,
  Eye,
  FileText,
  Link2,
  Minus,
  PenLine,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import type { Match } from "@/lib/user-matches"
import { cn } from "@/lib/utils"

// ---------- Document data ----------

export type ResumeDoc = {
  name: string
  contact: string
  links: { label: string; url: string }[]
  headline: string
  summary: string
  experience: { role: string; company: string; dates: string; bullets: string[] }[]
  skills: string
  education: string
}

export type LetterDoc = {
  sender: string
  date: string
  recipient: string
  greeting: string
  paragraphs: string[]
  closing: string
  signature: string
}

// Placeholder drafts. Replace with the Application Agent's tailored documents.
export const draftResumeDoc = (m: Match): ResumeDoc => ({
  name: "Priya Sharma",
  contact: "priya@example.com  ·  +1 512 555 0142  ·  Austin, TX",
  links: [
    { label: "LinkedIn", url: "linkedin.com/in/priya-sharma" },
    { label: "GitHub", url: "github.com/priya-sharma" },
  ],
  headline: m.title,
  summary: `Data engineer with 7 years of experience building reliable pipelines and platforms. Skilled in ${m.skills.join(", ")}, with a focus on data quality, cost and clear ownership.`,
  experience: [
    {
      role: "Senior Data Engineer",
      company: "Northbridge Analytics",
      dates: "2021 - Present",
      bullets: [
        `Built batch and streaming pipelines with ${m.skills.slice(0, 2).join(" and ")} used by analytics and ML teams.`,
        "Cut pipeline costs by moving workloads to managed services and right-sizing clusters.",
        "Introduced data quality checks that reduced incident tickets across core datasets.",
      ],
    },
    {
      role: "Data Engineer",
      company: "Lumen Retail",
      dates: "2018 - 2021",
      bullets: [
        "Designed the warehouse data model and dbt transformations for sales reporting.",
        "Automated daily loads from 12 source systems with monitoring and alerts.",
      ],
    },
  ],
  skills: [...m.skills, "SQL", "Data modeling", "CI/CD"].join("  ·  "),
  education: "B.Sc. Computer Science, University of Texas at Austin, 2017",
})

export const draftLetterDoc = (m: Match): LetterDoc => ({
  sender: "Priya Sharma\npriya@example.com  ·  +1 512 555 0142\nAustin, TX",
  date: new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }),
  recipient: `Hiring Team\n${m.company}`,
  greeting: `Dear ${m.company} hiring team,`,
  paragraphs: [
    `I'm applying for the ${m.title} role. My experience with ${m.skills.join(", ")} matches what you're looking for, and I'd welcome the chance to bring it to your team.`,
    "In my current role I build and maintain pipelines that teams rely on every day. I care about clear ownership, good documentation and data people can trust.",
    "I'd be glad to talk about how I could help. Thank you for your time and consideration.",
  ],
  closing: "Kind regards,",
  signature: "Priya Sharma",
})

// ---------- Editable primitives ----------

const editField =
  "h-auto rounded-sm border-dashed border-transparent bg-transparent px-1 py-0.5 shadow-none hover:border-border focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/30 dark:bg-transparent"

// Inputs take the page text style from their wrapper, so edit mode looks like the page.
const inherit = "w-full [font:inherit] md:[font:inherit] [color:inherit] [letter-spacing:inherit]"

const Line = ({
  value,
  editing,
  onChange,
  className,
  label,
}: {
  value: string
  editing: boolean
  onChange: (v: string) => void
  className?: string
  label: string
}) =>
  editing ? (
    <div className={className}>
      <Input aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className={cn(editField, inherit)} />
    </div>
  ) : (
    <p className={cn("px-1 py-0.5", className)}>{value}</p>
  )

const Block = ({
  value,
  editing,
  onChange,
  className,
  label,
  rows = 3,
}: {
  value: string
  editing: boolean
  onChange: (v: string) => void
  className?: string
  label: string
  rows?: number
}) =>
  editing ? (
    <div className={className}>
      <Textarea
        aria-label={label}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(editField, inherit, "min-h-0 resize-none")}
      />
    </div>
  ) : (
    <p className={cn("px-1 py-0.5 whitespace-pre-line", className)}>{value}</p>
  )

const SectionTitle = ({ children }: { children: ReactNode }) => (
  <h3 className="mt-6 mb-2 border-b border-foreground/20 pb-1 text-[11px] font-bold tracking-[0.15em] text-primary uppercase">
    {children}
  </h3>
)

const toHref = (url: string) => (/^https?:\/\//i.test(url) ? url : `https://${url}`)

// Profile and portfolio URLs shown under the contact line.
const ResumeLinks = ({
  links,
  editing,
  onChange,
}: {
  links: ResumeDoc["links"]
  editing: boolean
  onChange: (v: ResumeDoc["links"]) => void
}) => {
  const update = (i: number, patch: Partial<ResumeDoc["links"][number]>) =>
    onChange(links.map((l, j) => (j === i ? { ...l, ...patch } : l)))

  if (!editing) {
    const shown = links.filter((l) => l.url.trim())
    if (!shown.length) return null
    return (
      <p className="flex flex-wrap gap-x-3 px-1 py-0.5 text-[11px]">
        {shown.map((l, i) => (
          <a
            key={i}
            href={toHref(l.url)}
            target="_blank"
            rel="noreferrer"
            className="text-primary underline-offset-2 hover:underline"
          >
            {l.label ? `${l.label}: ` : ""}
            {l.url}
          </a>
        ))}
      </p>
    )
  }

  return (
    <div className="mt-1 space-y-1 text-[11px]">
      {links.map((l, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className="w-28 shrink-0 font-medium">
            <Input
              aria-label={`Link ${i + 1} label`}
              placeholder="Label"
              value={l.label}
              onChange={(e) => update(i, { label: e.target.value })}
              className={cn(editField, inherit)}
            />
          </div>
          <div className="flex-1 text-primary">
            <Input
              aria-label={`Link ${i + 1} URL`}
              placeholder="https://"
              inputMode="url"
              value={l.url}
              onChange={(e) => update(i, { url: e.target.value })}
              className={cn(editField, inherit)}
            />
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={`Remove link ${i + 1}`}
            className="text-muted-foreground print:hidden"
            onClick={() => onChange(links.filter((_, j) => j !== i))}
          >
            <Trash2 />
          </Button>
        </div>
      ))}
      <Button
        variant="ghost"
        size="xs"
        className="text-primary print:hidden"
        onClick={() => onChange([...links, { label: "Portfolio", url: "" }])}
      >
        <Link2 /> Add link
      </Button>
    </div>
  )
}

// ---------- Pages ----------

const Paper = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto min-h-[297mm] w-[210mm] bg-card px-[18mm] py-[16mm] text-[13px] leading-relaxed text-foreground shadow-xl ring-1 ring-foreground/5 print:min-h-0 print:w-auto print:shadow-none print:ring-0">
    {children}
  </div>
)

const ResumePage = ({ doc, editing, set }: { doc: ResumeDoc; editing: boolean; set: (d: ResumeDoc) => void }) => {
  const upd = <K extends keyof ResumeDoc>(k: K, v: ResumeDoc[K]) => set({ ...doc, [k]: v })
  const updJob = (i: number, patch: Partial<ResumeDoc["experience"][number]>) =>
    upd(
      "experience",
      doc.experience.map((x, j) => (j === i ? { ...x, ...patch } : x))
    )

  return (
    <Paper>
      <Line label="Name" value={doc.name} editing={editing} onChange={(v) => upd("name", v)} className="font-heading text-[26px] leading-tight font-semibold" />
      <Line label="Headline" value={doc.headline} editing={editing} onChange={(v) => upd("headline", v)} className="text-[15px] font-medium text-primary" />
      <Line label="Contact details" value={doc.contact} editing={editing} onChange={(v) => upd("contact", v)} className="text-[11px] text-muted-foreground" />
      <ResumeLinks links={doc.links} editing={editing} onChange={(v) => upd("links", v)} />

      <SectionTitle>Summary</SectionTitle>
      <Block label="Summary" value={doc.summary} editing={editing} onChange={(v) => upd("summary", v)} />

      <SectionTitle>Experience</SectionTitle>
      <div className="space-y-4">
        {doc.experience.map((job, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-baseline justify-between gap-3">
              <div className="flex min-w-0 flex-1 flex-wrap items-baseline">
                <Line label="Role" value={job.role} editing={editing} onChange={(v) => updJob(i, { role: v })} className="font-semibold" />
                {!editing && <span className="px-0.5 text-muted-foreground">,</span>}
                <Line label="Company" value={job.company} editing={editing} onChange={(v) => updJob(i, { company: v })} className="text-muted-foreground" />
              </div>
              <Line label="Dates" value={job.dates} editing={editing} onChange={(v) => updJob(i, { dates: v })} className="w-32 shrink-0 text-right text-[11px] text-muted-foreground" />
            </div>
            <ul className="space-y-0.5 pl-4">
              {job.bullets.map((b, k) => (
                <li key={k} className="flex items-start gap-1.5">
                  <span className="mt-[9px] size-1 shrink-0 rounded-full bg-primary" />
                  <div className="flex-1">
                    <Block
                      label={`Achievement ${k + 1}`}
                      rows={2}
                      value={b}
                      editing={editing}
                      onChange={(v) => updJob(i, { bullets: job.bullets.map((x, n) => (n === k ? v : x)) })}
                    />
                  </div>
                  {editing && (
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      aria-label="Remove bullet"
                      className="mt-1 text-muted-foreground print:hidden"
                      onClick={() => updJob(i, { bullets: job.bullets.filter((_, n) => n !== k) })}
                    >
                      <Trash2 />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
            {editing && (
              <Button
                variant="ghost"
                size="xs"
                className="ml-4 text-primary print:hidden"
                onClick={() => updJob(i, { bullets: [...job.bullets, "New achievement"] })}
              >
                <Plus /> Add bullet
              </Button>
            )}
          </div>
        ))}
      </div>

      <SectionTitle>Skills</SectionTitle>
      <Block label="Skills" rows={2} value={doc.skills} editing={editing} onChange={(v) => upd("skills", v)} />

      <SectionTitle>Education</SectionTitle>
      <Block label="Education" rows={2} value={doc.education} editing={editing} onChange={(v) => upd("education", v)} />
    </Paper>
  )
}

const LetterPage = ({ doc, editing, set }: { doc: LetterDoc; editing: boolean; set: (d: LetterDoc) => void }) => {
  const upd = <K extends keyof LetterDoc>(k: K, v: LetterDoc[K]) => set({ ...doc, [k]: v })
  return (
    <Paper>
      <div className="space-y-6">
        <Block label="Sender" rows={3} value={doc.sender} editing={editing} onChange={(v) => upd("sender", v)} className="text-[12px] text-muted-foreground" />
        <Line label="Date" value={doc.date} editing={editing} onChange={(v) => upd("date", v)} />
        <Block label="Recipient" rows={2} value={doc.recipient} editing={editing} onChange={(v) => upd("recipient", v)} />
        <Line label="Greeting" value={doc.greeting} editing={editing} onChange={(v) => upd("greeting", v)} className="font-medium" />
        <div className="space-y-4">
          {doc.paragraphs.map((p, i) => (
            <Block
              key={i}
              label={`Paragraph ${i + 1}`}
              rows={4}
              value={p}
              editing={editing}
              onChange={(v) => upd("paragraphs", doc.paragraphs.map((x, j) => (j === i ? v : x)))}
            />
          ))}
        </div>
        <div>
          <Line label="Closing" value={doc.closing} editing={editing} onChange={(v) => upd("closing", v)} />
          <Line label="Signature" value={doc.signature} editing={editing} onChange={(v) => upd("signature", v)} className="mt-6 font-heading text-[15px] font-semibold" />
        </div>
      </div>
    </Paper>
  )
}

// ---------- Viewer dialog ----------

const ZOOMS = [
  { value: 75, cls: "[zoom:0.75]" },
  { value: 90, cls: "[zoom:0.9]" },
  { value: 100, cls: "[zoom:1]" },
  { value: 110, cls: "[zoom:1.1]" },
  { value: 125, cls: "[zoom:1.25]" },
]

type Props =
  | { kind: "resume"; value: ResumeDoc; onSave: (d: ResumeDoc) => void }
  | { kind: "letter"; value: LetterDoc; onSave: (d: LetterDoc) => void }

export const DocumentEditor = ({
  icon: Icon,
  title,
  description,
  fileName,
  compact,
  readOnly,
  ...props
}: Props & {
  icon: LucideIcon
  title: string
  description: string
  fileName: string
  /** Show only the button that opens the document, without the summary card. */
  compact?: boolean
  /** View only: no editing (for example, once the document has been sent). */
  readOnly?: boolean
}) => {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [zoom, setZoom] = useState(1) // index into ZOOMS (90%)
  const [draft, setDraft] = useState<ResumeDoc | LetterDoc>(props.value)
  const [edited, setEdited] = useState(false)

  const dirty = JSON.stringify(draft) !== JSON.stringify(props.value)

  const save = () => {
    if (props.kind === "resume") props.onSave(draft as ResumeDoc)
    else props.onSave(draft as LetterDoc)
    setEdited(true)
    setEditing(false)
    setOpen(false)
  }

  const dialog = (
      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o)
          if (o) {
            setDraft(props.value)
            setEditing(false)
          }
        }}
      >
        <DialogTrigger render={<Button variant="outline" size="sm" className="cursor-pointer bg-background" />}>
          {readOnly ? <Eye /> : <Sparkles />}{" "}
          {readOnly ? "View" : compact ? "View or edit" : "View and edit"}
        </DialogTrigger>
        <DialogContent
          showCloseButton={false}
          className="flex h-[92vh] max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl print:static print:h-auto print:max-w-none print:translate-x-0 print:translate-y-0 print:overflow-visible print:rounded-none print:ring-0"
        >
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 border-b bg-background px-4 py-2.5 print:hidden">
            <FileText className="size-4 text-primary" />
            <DialogTitle className="mr-auto truncate text-sm font-semibold">{fileName}</DialogTitle>

            <span className="hidden text-xs text-muted-foreground sm:inline">Page 1 of 1</span>
            <Separator orientation="vertical" className="mx-1 h-5" />
            <Button variant="ghost" size="icon-sm" aria-label="Zoom out" disabled={zoom === 0} onClick={() => setZoom((z) => z - 1)}>
              <Minus />
            </Button>
            <span className="w-11 text-center text-xs tabular-nums">{ZOOMS[zoom].value}%</span>
            <Button variant="ghost" size="icon-sm" aria-label="Zoom in" disabled={zoom === ZOOMS.length - 1} onClick={() => setZoom((z) => z + 1)}>
              <Plus />
            </Button>
            <Separator orientation="vertical" className="mx-1 h-5" />

            {!readOnly && (
              <>
                <div className="flex rounded-lg border p-0.5">
                  <Button size="xs" variant={editing ? "ghost" : "secondary"} onClick={() => setEditing(false)}>
                    <Eye /> View
                  </Button>
                  <Button size="xs" variant={editing ? "secondary" : "ghost"} onClick={() => setEditing(true)}>
                    <PenLine /> Edit
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Reset changes"
                  disabled={!dirty}
                  onClick={() => setDraft(props.value)}
                >
                  <RotateCcw />
                </Button>
              </>
            )}
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Download /> Download PDF
            </Button>
            <DialogClose render={<Button variant="ghost" size="icon-sm" aria-label="Close" />}>
              <X />
            </DialogClose>
          </div>

          {editing && (
            <p className="border-b bg-primary/5 px-4 py-2 text-xs text-primary print:hidden">
              Click any text on the page to edit it. Only facts from your CV are used. Don&apos;t add experience you
              don&apos;t have.
            </p>
          )}

          {/* Canvas */}
          <div className="flex-1 overflow-auto bg-muted px-4 py-8 print:overflow-visible print:bg-transparent print:p-0">
            <div className={cn("origin-top", ZOOMS[zoom].cls, "print:[zoom:1]")}>
              {props.kind === "resume" ? (
                <ResumePage doc={draft as ResumeDoc} editing={editing} set={setDraft} />
              ) : (
                <LetterPage doc={draft as LetterDoc} editing={editing} set={setDraft} />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 border-t bg-background px-4 py-3 print:hidden">
            <p className="text-xs text-muted-foreground">
              {readOnly
                ? "This document was sent, so it can't be edited."
                : dirty
                  ? "You have unsaved changes."
                  : "Saved changes need your approval again before submitting."}
            </p>
            <div className="flex gap-2">
              {readOnly ? (
                <DialogClose render={<Button variant="outline" />}>Close</DialogClose>
              ) : (
                <>
                  <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                  <Button onClick={save} disabled={!dirty}>
                    <Check /> Save changes
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
  )

  if (compact) return dialog

  return (
    <div className="space-y-3 rounded-xl border bg-muted/40 p-4">
      <div className="flex gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-medium">
            {title} {edited && <Badge variant="secondary">Edited</Badge>}
          </p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {dialog}
    </div>
  )
}
