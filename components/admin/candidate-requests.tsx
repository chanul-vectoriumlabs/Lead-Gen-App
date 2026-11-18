"use client"

import { useState } from "react"
import { CheckCircle2, Clock, FileText, Inbox, MessageSquare, Paperclip, Send, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  addRequest,
  cancelRequest,
  DOCUMENT_OPTIONS,
  QUESTION_OPTIONS,
  useRequests,
  type InfoRequest,
} from "@/lib/requests-store"
import { cn } from "@/lib/utils"

const DUE_OPTIONS = ["In 2 days", "In 3 days", "In 1 week", "No deadline"]

const when = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })

const CheckList = ({
  idPrefix,
  options,
  value,
  onChange,
}: {
  idPrefix: string
  options: string[]
  value: string[]
  onChange: (v: string[]) => void
}) => (
  <div className="grid gap-2 sm:grid-cols-2">
    {options.map((o) => {
      const id = `${idPrefix}-${o}`
      const on = value.includes(o)
      return (
        <label
          key={o}
          htmlFor={id}
          className={cn(
            "flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted/50",
            on && "border-primary bg-primary/5"
          )}
        >
          <Checkbox id={id} checked={on} onCheckedChange={(c) => onChange(c ? [...value, o] : value.filter((x) => x !== o))} />
          {o}
        </label>
      )
    })}
  </div>
)

/** Header button: ask the candidate for documents or information. */
export const RequestInfoButton = ({ candidateId, candidateName }: { candidateId: string; candidateName: string }) => {
  const [open, setOpen] = useState(false)
  const [documents, setDocuments] = useState<string[]>([])
  const [questions, setQuestions] = useState<string[]>([])
  const [custom, setCustom] = useState("")
  const [message, setMessage] = useState("")
  const [due, setDue] = useState(DUE_OPTIONS[1])

  const allQuestions = [...questions, ...(custom.trim() ? [custom.trim()] : [])]
  const empty = documents.length === 0 && allQuestions.length === 0

  const reset = () => {
    setDocuments([])
    setQuestions([])
    setCustom("")
    setMessage("")
    setDue(DUE_OPTIONS[1])
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (o) reset()
      }}
    >
      <DialogTrigger render={<Button variant="outline" className="cursor-pointer" />}>
        <Inbox /> Request info
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Request from {candidateName}</DialogTitle>
          <DialogDescription>
            Ask for documents or answers. The candidate sees the request on their dashboard and gets an email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Paperclip className="size-4 text-primary" /> Documents
            </p>
            <CheckList idPrefix="doc" options={DOCUMENT_OPTIONS} value={documents} onChange={setDocuments} />
          </div>

          <div className="space-y-2">
            <p className="flex items-center gap-2 text-sm font-medium">
              <MessageSquare className="size-4 text-primary" /> Information
            </p>
            <CheckList idPrefix="q" options={QUESTION_OPTIONS} value={questions} onChange={setQuestions} />
            <Input
              aria-label="Another question"
              placeholder="Ask something else (optional)"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              className="h-9"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
            <div className="space-y-2">
              <Label htmlFor="req-message">Message</Label>
              <Textarea
                id="req-message"
                rows={3}
                placeholder="Add a note for the candidate (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="req-due">Due</Label>
              <Select value={due} onValueChange={(v) => setDue(v as string)}>
                <SelectTrigger id="req-due" className="w-full cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false} className="p-1.5">
                  {DUE_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o} className="cursor-pointer rounded-md px-2.5 py-2">
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" className="cursor-pointer" />}>Cancel</DialogClose>
          <Button
            className="cursor-pointer"
            disabled={empty}
            onClick={() => {
              addRequest({ candidateId, documents, questions: allQuestions, message: message.trim(), due })
              setOpen(false)
            }}
          >
            <Send /> Send request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const RequestRow = ({ r }: { r: InfoRequest }) => (
  <li className="space-y-3 rounded-xl border p-4">
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant={r.status === "submitted" ? "default" : "secondary"} className="gap-1">
        {r.status === "submitted" ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
        {r.status === "submitted" ? "Answered" : "Waiting for candidate"}
      </Badge>
      <span className="text-xs text-muted-foreground">
        Sent {when(r.createdAt)} &middot; Due {r.due.toLowerCase()}
      </span>
      {r.status === "pending" && (
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto cursor-pointer text-muted-foreground"
          onClick={() => cancelRequest(r.id)}
        >
          <Trash2 /> Cancel request
        </Button>
      )}
    </div>
    {r.message && <p className="text-sm text-muted-foreground">&ldquo;{r.message}&rdquo;</p>}

    <div className="grid gap-4 md:grid-cols-2">
      {r.documents.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Documents</p>
          <ul className="space-y-1.5">
            {r.documents.map((doc, i) => {
              const file = r.response?.files[i]
              return (
                <li key={doc} className="flex items-center gap-2 text-sm">
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <span className="font-medium">{doc}</span>
                  {file ? (
                    <Badge variant="outline" className="ml-auto max-w-48 truncate">
                      {file}
                    </Badge>
                  ) : (
                    r.status === "submitted" && <span className="ml-auto text-xs text-muted-foreground">Not provided</span>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
      {r.questions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Information</p>
          <ul className="space-y-2">
            {r.questions.map((q) => (
              <li key={q} className="text-sm">
                <p className="font-medium">{q}</p>
                {r.response && <p className="text-muted-foreground">{r.response.answers[q] || "No answer"}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    {r.response?.note && (
      <p className="rounded-lg bg-muted/50 px-3 py-2 text-sm">
        <span className="font-medium">Candidate note: </span>
        {r.response.note}
      </p>
    )}
  </li>
)

/** Requests sent to this candidate and their answers. Hidden until there is one. */
export const RequestsCard = ({ candidateId }: { candidateId: string }) => {
  const requests = useRequests(candidateId)
  if (requests.length === 0) return null
  const pending = requests.filter((r) => r.status === "pending").length

  return (
    <Card className="border border-border">
      <CardHeader>
        <CardTitle className="text-base">Requests</CardTitle>
        <CardDescription>Documents and information asked from the candidate.</CardDescription>
        <CardAction>
          <Badge variant={pending ? "default" : "secondary"}>{pending ? `${pending} waiting` : "All answered"}</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {requests.map((r) => (
            <RequestRow key={r.id} r={r} />
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
