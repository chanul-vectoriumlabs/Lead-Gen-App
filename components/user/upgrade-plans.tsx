"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ChevronLeft,
  FileText,
  Hourglass,
  Loader2,
  Mail,
  ShieldCheck,
  Target,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react"

import { setPlan, usePlan } from "@/components/user/plan-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

// Placeholder plans and prices. Confirm with the client before showing to users.
const PLANS = [
  {
    id: "short",
    ribbon: "Most popular",
    title: "14-day full access",
    note: "Tailor every application for two weeks of focused job hunting.",
    price: "2",
    cents: ".95",
    per: "",
    terms: "$2.95 for 14 days. Then renews at $23.95 every 4 weeks. Cancel anytime.",
  },
  {
    id: "long",
    ribbon: "Best value",
    title: "6-month full access",
    note: "For a longer search, at a lower monthly price.",
    price: "9",
    cents: ".95",
    per: "per month",
    terms: "$59.70 billed every 6 months. Cancel anytime.",
  },
]

const PERKS = [
  "Unlimited tailored resumes",
  "Unlimited tailored cover letters",
  "Smart job matching",
  "Recruiter contacts",
  "Priority email alerts",
]

const BENEFITS: { icon: LucideIcon; title: string; text: string; badge?: string }[] = [
  {
    icon: FileText,
    title: "A tailored resume for every job",
    text: "Each application uses a resume and cover letter rewritten for that exact role, using only facts from your CV.",
  },
  {
    icon: ShieldCheck,
    title: "Approved sources only",
    text: "Jobs come from employer job boards and licensed providers, so your applications reach real employers.",
  },
  {
    icon: Target,
    title: "Recruiter contacts",
    text: "See verified hiring contacts for your top jobs, with where each one came from.",
  },
]

export const UpgradePlans = () => {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get("next")
  const reason = params.get("reason")
  const plan = usePlan()
  const [choice, setChoice] = useState(PLANS[0].id)
  const [banner, setBanner] = useState(true)
  const [busy, setBusy] = useState(false)

  const selected = PLANS.find((p) => p.id === choice) ?? PLANS[0]
  const backHref = next?.startsWith("/apply/") ? `/job/${next.split("/")[2]}` : "/dashboard"

  const upgrade = () => {
    // Demo only: no payment is taken.
    setBusy(true)
    setTimeout(() => {
      setPlan("pro")
      setBusy(false)
      router.push(next && next.startsWith("/") ? next : "/dashboard")
    }, 900)
  }

  return (
    <div className="-m-4 flex flex-1 flex-col md:-m-8">
      {banner && (
        <div className="flex items-start gap-3 border-b bg-primary/5 px-4 py-3 md:px-8">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Hourglass className="size-4" />
          </span>
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-sm">
              <span className="font-semibold">
                {reason === "optimize" ? "Resume optimization is a Pro feature." : "Unlock everything with Pro."}
              </span>{" "}
              <span className="text-muted-foreground">Upgrade to tailor every application.</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {PERKS.map((p) => (
                <Badge key={p} variant="outline" className="bg-background">
                  {p}
                </Badge>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="icon-sm" aria-label="Dismiss" onClick={() => setBanner(false)}>
            <X />
          </Button>
        </div>
      )}

      <div className="mx-auto w-full max-w-6xl flex-1 space-y-10 px-4 py-8 md:px-8 md:py-10">
        <div className="space-y-4">
          <Link href={backHref} className="flex w-fit items-center gap-1 text-sm font-medium text-primary hover:underline">
            <ChevronLeft className="size-4" /> Back
          </Link>
          <div className="space-y-3 text-center">
            <h1 className="font-heading text-3xl font-semibold tracking-tight md:text-5xl">
              Your next role, <span className="text-primary">almost there!</span>
            </h1>
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">Upgrade to Pro</span> and send a tailored resume and cover
              letter with every application.
            </p>
            {plan === "pro" && <Badge className="mt-1">You&apos;re on Pro</Badge>}
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-2">
          <Card className="border border-border">
            <CardContent className="space-y-7 p-6 md:p-8">
              <div className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Zap className="size-5" />
                </span>
                <div className="space-y-1">
                  <p className="flex flex-wrap items-center gap-2 font-heading font-semibold text-primary">
                    Optimize: one CV, many tailored applications
                    <Badge className="h-5 px-1.5 text-[10px]">Pro</Badge>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Pick your jobs and approve. AI rewrites your resume and cover letter for{" "}
                    <span className="font-medium text-foreground">every job</span>, then waits for your approval.
                  </p>
                </div>
              </div>

              {/* Illustration: one CV in, tailored applications out */}
              <div className="flex items-center justify-center gap-4 py-2">
                <div className="w-20 -rotate-6 space-y-1.5 rounded-lg border bg-background p-2.5 shadow-md">
                  <span className="block h-1.5 w-1/2 rounded-full bg-primary/40" />
                  {["w-full", "w-4/5", "w-full", "w-2/3", "w-5/6"].map((w, i) => (
                    <span key={i} className={cn("block h-1 rounded-full bg-muted", w)} />
                  ))}
                </div>
                <span className="h-px w-8 border-t-2 border-dashed border-primary/40" />
                <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground ring-4 ring-primary/20">
                  <Target className="size-6" />
                </span>
                <span className="h-px w-8 border-t-2 border-dashed border-primary/40" />
                <div className="space-y-2">
                  {["Acme Corp", "Northwind", "Brightly"].map((c, i) => (
                    <div key={c} className="flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5 text-sm font-semibold shadow-xs">
                      {i === 2 ? <Mail className="size-3.5 text-primary" /> : <FileText className="size-3.5 text-primary" />}
                      {c}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-center text-xs text-muted-foreground">One CV in, tailored applications out</p>

              <div className="space-y-5">
                {BENEFITS.map((b) => (
                  <div key={b.title} className="flex gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <b.icon className="size-5" />
                    </span>
                    <div className="space-y-1">
                      <p className="font-heading font-semibold text-primary">{b.title}</p>
                      <p className="text-sm text-muted-foreground">{b.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <RadioGroup value={choice} onValueChange={(v) => setChoice(v as string)} className="gap-4">
              {PLANS.map((p) => {
                const on = choice === p.id
                return (
                  <label
                    key={p.id}
                    htmlFor={`plan-${p.id}`}
                    className={cn(
                      "block cursor-pointer overflow-hidden rounded-xl border-2 bg-card transition-colors",
                      on ? "border-primary shadow-md" : "border-border hover:border-primary/40"
                    )}
                  >
                    <div
                      className={cn(
                        "py-1.5 text-center text-xs font-semibold tracking-wider uppercase",
                        on ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {p.ribbon}
                    </div>
                    <div className="flex items-start gap-4 p-5">
                      <RadioGroupItem id={`plan-${p.id}`} value={p.id} className="mt-1" />
                      <div className="flex-1 space-y-1">
                        <p className="font-heading text-lg font-semibold">{p.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Includes <span className="font-medium text-primary">unlimited resume optimization</span>
                        </p>
                        <p className="pt-1 text-xs text-muted-foreground">{p.note}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-heading leading-none">
                          <span className="align-top text-lg font-semibold">$</span>
                          <span className="text-4xl font-semibold">{p.price}</span>
                          <span className="align-top text-lg font-semibold">{p.cents}</span>
                        </p>
                        {p.per && <p className="mt-1 text-xs text-muted-foreground">{p.per}</p>}
                      </div>
                    </div>
                  </label>
                )
              })}
            </RadioGroup>

            <Button size="lg" className="h-12 w-full text-base" onClick={upgrade} disabled={busy || plan === "pro"}>
              {busy && <Loader2 className="animate-spin" />}
              {plan === "pro" ? "You're already on Pro" : busy ? "Upgrading..." : "Continue"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">{selected.terms}</p>
            {plan === "pro" && (
              <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => setPlan("free")}>
                Switch back to Free (demo)
              </Button>
            )}
            <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" /> Nothing is ever submitted without your approval, on any plan.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
