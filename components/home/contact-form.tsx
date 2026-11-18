"use client"

import { useState, type FormEvent } from "react"
import { CheckCircle2, Loader2, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const topics = [
  { value: "general", label: "General question" },
  { value: "account", label: "Account and sign in" },
  { value: "matching", label: "Jobs and matching" },
  { value: "applications", label: "Applications and approval" },
  { value: "privacy", label: "Privacy and data deletion" },
  { value: "business", label: "Business and partnerships" },
]

type Errors = Partial<Record<"name" | "email" | "message", string>>

const FieldError = ({ id, message }: { id: string; message?: string }) =>
  message ? (
    <p id={id} className="text-xs text-destructive">
      {message}
    </p>
  ) : null

export const ContactForm = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [topic, setTopic] = useState("general")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: Errors = {}
    if (name.trim().length < 2) next.name = "Enter your name."
    if (!EMAIL.test(email)) next.email = "Enter a valid email address."
    if (message.trim().length < 10) next.message = "Tell us a little more (at least 10 characters)."
    setErrors(next)
    if (Object.keys(next).length) return

    // Demo only: the message is not sent anywhere yet.
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 900)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-7" />
        </div>
        <div className="space-y-1">
          <h2 className="font-heading text-xl font-semibold">Message sent</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Thanks, {name.split(" ")[0]}. We&apos;ll reply to{" "}
            <span className="font-medium text-foreground">{email}</span> within one business day.
          </p>
        </div>
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => {
            setSent(false)
            setMessage("")
          }}
        >
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="h-11 bg-background"
          />
          <FieldError id="name-error" message={errors.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="h-11 bg-background"
          />
          <FieldError id="email-error" message={errors.email} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Topic</Label>
        <Select value={topic} items={topics} onValueChange={(v) => setTopic(v ?? "general")}>
          <SelectTrigger className="h-11! w-full cursor-pointer bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} className="p-1.5">
            {topics.map((t) => (
              <SelectItem
                key={t.value}
                value={t.value}
                className="cursor-pointer rounded-md px-2.5 py-2"
              >
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={6}
          placeholder="How can we help?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="min-h-36 bg-background"
        />
        <FieldError id="message-error" message={errors.message} />
      </div>

      <Button type="submit" size="lg" className="h-11 w-full cursor-pointer sm:w-auto" disabled={loading}>
        {loading ? <Loader2 className="animate-spin" /> : <Send />}
        {loading ? "Sending..." : "Send message"}
      </Button>
    </form>
  )
}
