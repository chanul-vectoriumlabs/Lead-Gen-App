"use client"

import { useState } from "react"
import { CheckCircle2, Inbox, Paperclip, Send } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { respondToRequest, useRequests, type InfoRequest } from "@/lib/requests-store"

const RequestForm = ({ r }: { r: InfoRequest }) => {
  const [files, setFiles] = useState<string[]>(() => r.documents.map(() => ""))
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [note, setNote] = useState("")
  const missing =
    files.some((f) => !f) || r.questions.some((q) => !(answers[q] ?? "").trim())

  return (
    <li className="space-y-4 rounded-xl border bg-background p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="gap-1">
          <Inbox className="size-3" /> New request
        </Badge>
        <span className="text-xs text-muted-foreground">Due {r.due.toLowerCase()}</span>
      </div>
      {r.message && <p className="text-sm">{r.message}</p>}

      {r.documents.length > 0 && (
        <div className="space-y-3">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Paperclip className="size-4 text-primary" /> Documents to upload
          </p>
          {r.documents.map((doc, i) => (
            <div key={doc} className="grid gap-1.5 sm:grid-cols-[12rem_1fr] sm:items-center">
              <Label htmlFor={`${r.id}-file-${i}`}>{doc}</Label>
              <Input
                id={`${r.id}-file-${i}`}
                type="file"
                className="cursor-pointer"
                onChange={(e) => {
                  const name = e.target.files?.[0]?.name ?? ""
                  setFiles((f) => f.map((x, j) => (j === i ? name : x)))
                }}
              />
            </div>
          ))}
        </div>
      )}

      {r.questions.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Questions</p>
          {r.questions.map((q, i) => (
            <div key={q} className="space-y-1.5">
              <Label htmlFor={`${r.id}-q-${i}`}>{q}</Label>
              <Input
                id={`${r.id}-q-${i}`}
                value={answers[q] ?? ""}
                onChange={(e) => setAnswers((a) => ({ ...a, [q]: e.target.value }))}
                placeholder="Your answer"
              />
            </div>
          ))}
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor={`${r.id}-note`}>Note (optional)</Label>
        <Textarea id={`${r.id}-note`} rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        {missing && <p className="mr-auto text-xs text-muted-foreground">Add every document and answer to send.</p>}
        <Button
          className="cursor-pointer"
          disabled={missing}
          onClick={() => respondToRequest(r.id, { files, answers, note: note.trim() })}
        >
          <Send /> Send to our team
        </Button>
      </div>
    </li>
  )
}

/** Requests from the admin team. Hidden when there are none. */
export const RequestsInbox = ({ candidateId }: { candidateId: string }) => {
  const requests = useRequests(candidateId)
  const pending = requests.filter((r) => r.status === "pending")
  const answered = requests.length - pending.length
  if (requests.length === 0) return null

  return (
    <Card className="border border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Inbox className="size-5 text-primary" /> Requests from our team
        </CardTitle>
        <CardDescription>
          {pending.length
            ? "We need a few things from you to keep your job search moving."
            : "You've answered every request. Thank you!"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {pending.length > 0 && (
          <ul className="space-y-3">
            {pending.map((r) => (
              <RequestForm key={r.id} r={r} />
            ))}
          </ul>
        )}
        {answered > 0 && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4 text-primary" /> {answered} {answered === 1 ? "request" : "requests"} answered
          </p>
        )}
      </CardContent>
    </Card>
  )
}
