"use client"

import { useState } from "react"
import { CheckCircle2, ExternalLink, Loader2, Mail, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
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

type Template = { name: string; subject: string; body: (first: string) => string }

const SIGNATURE = "\n\nBest regards,\nThe JobPilot team"

const TEMPLATES: Template[] = [
  { name: "Blank", subject: "", body: (first) => `Hi ${first},\n\n${SIGNATURE.trim()}` },
  {
    name: "Your top jobs are ready",
    subject: "Your top job matches are ready",
    body: (first) =>
      `Hi ${first},\n\nWe've ranked the best jobs for you based on your CV. Sign in to your dashboard to review them and pick the ones you'd like to pursue.${SIGNATURE}`,
  },
  {
    name: "Please confirm your criteria",
    subject: "Please confirm your search criteria",
    body: (first) =>
      `Hi ${first},\n\nBefore we start your job search, please check the job titles, locations and work type we've set up for you and let us know if anything should change.${SIGNATURE}`,
  },
  {
    name: "Request a CV",
    subject: "Could you send us your CV?",
    body: (first) =>
      `Hi ${first},\n\nTo start finding jobs for you, we need your latest CV. You can upload it from your dashboard, or reply to this email with it attached.${SIGNATURE}`,
  },
  {
    name: "Follow-up",
    subject: "Checking in on your job search",
    body: (first) =>
      `Hi ${first},\n\nJust checking in. Is there anything we can help with in your job search right now?${SIGNATURE}`,
  },
]

/** Header button: write an email to the candidate. */
export const EmailCandidateButton = ({ name, email }: { name: string; email: string }) => {
  const first = name.split(" ")[0]
  const [open, setOpen] = useState(false)
  const [template, setTemplate] = useState(TEMPLATES[0].name)
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const apply = (t: Template) => {
    setTemplate(t.name)
    setSubject(t.subject)
    setBody(t.body(first))
  }

  const send = () => {
    setSending(true)
    // Demo only: simulates sending through the email service.
    setTimeout(() => {
      setSending(false)
      setSent(true)
    }, 1000)
  }

  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (o) {
          apply(TEMPLATES[0])
          setSent(false)
        }
      }}
    >
      <DialogTrigger render={<Button variant="outline" className="cursor-pointer" />}>
        <Mail /> Email
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        {sent ? (
          <>
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CheckCircle2 className="size-6" />
              </span>
              <DialogTitle>Email sent</DialogTitle>
              <DialogDescription>
                &ldquo;{subject}&rdquo; was sent to {email}.
              </DialogDescription>
            </div>
            <DialogFooter>
              <DialogClose render={<Button className="cursor-pointer" />}>Done</DialogClose>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Email {name}</DialogTitle>
              <DialogDescription>Start from a template or write your own message.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email-to">To</Label>
                  <Input id="email-to" value={email} readOnly className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-template">Template</Label>
                  <Select
                    items={TEMPLATES.map((t) => ({ value: t.name, label: t.name }))}
                    value={template}
                    onValueChange={(v) => {
                      const t = TEMPLATES.find((x) => x.name === v)
                      if (t) apply(t)
                    }}
                  >
                    <SelectTrigger id="email-template" className="w-full cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent alignItemWithTrigger={false} className="p-1.5">
                      {TEMPLATES.map((t) => (
                        <SelectItem key={t.name} value={t.name} className="cursor-pointer rounded-md px-2.5 py-2">
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-subject">Subject</Label>
                <Input
                  id="email-subject"
                  value={subject}
                  placeholder="Subject"
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-body">Message</Label>
                <Textarea id="email-body" rows={9} value={body} onChange={(e) => setBody(e.target.value)} />
              </div>
            </div>

            <DialogFooter className="sm:justify-between">
              <Button
                variant="ghost"
                className="cursor-pointer"
                nativeButton={false}
                render={<a href={mailto} />}
              >
                <ExternalLink /> Open in email app
              </Button>
              <div className="flex gap-2">
                <DialogClose render={<Button variant="outline" className="cursor-pointer" />}>Cancel</DialogClose>
                <Button
                  className="cursor-pointer"
                  disabled={sending || !subject.trim() || !body.trim()}
                  onClick={send}
                >
                  {sending ? <Loader2 className="animate-spin" /> : <Send />}
                  {sending ? "Sending..." : "Send email"}
                </Button>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
