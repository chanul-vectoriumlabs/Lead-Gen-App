import Link from "next/link"
import {
  ArrowRight,
  BellRing,
  FileText,
  Filter,
  Search,
  ShieldCheck,
  Sparkles,
  UserSearch,
} from "lucide-react"

import { HeroPreview } from "@/components/home/hero-preview"
import { HowItWorks } from "@/components/home/how-it-works"
import { SiteFooter } from "@/components/home/site-footer"
import { SiteHeader } from "@/components/home/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const features = [
  { icon: Search, title: "Approved job sources", text: "Employer job boards, government APIs and licensed providers. No scraping of sites that forbid it." },
  { icon: Filter, title: "Smart pre-filtering", text: "Jobs that miss your title, location or salary are removed before ranking. No-salary jobs are kept and flagged." },
  { icon: Sparkles, title: "Ranking you can read", text: "Every score comes with a reason, like “strong Python and AWS match; missing 5 years of management”." },
  { icon: UserSearch, title: "Recruiter contacts", text: "Verified hiring contacts for your top jobs, with where and when each one was found." },
  { icon: FileText, title: "Tailored documents", text: "A resume and cover letter for each job, written only from facts in your CV. Nothing invented." },
  { icon: BellRing, title: "Email updates", text: "Know when results are ready, when something needs your approval, and when status changes." },
]

const control = [
  ["You confirm the search", "Edit keywords, titles, location and salary before any search runs."],
  ["You choose the jobs", "Pick which ranked jobs to pursue. The rest stay saved for later."],
  ["You approve every application", "Review the exact resume and cover letter, request changes, or skip."],
]

const Home = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b bg-muted/40">
          <div className="absolute -right-40 -top-40 size-128 rounded-full bg-primary/10" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:px-8 lg:grid-cols-2 lg:py-28">
            <div className="space-y-7">
              <Badge variant="secondary" className="gap-1.5">
                <Sparkles className="size-3" /> AI job search, with you in control
              </Badge>
              <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                Your next role, <span className="text-primary">matched to your CV.</span>
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                Upload your CV once. We search approved job sources, rank every job
                against your experience, find the recruiters, and prepare applications
                for you to approve.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="h-12 cursor-pointer px-6 text-base"
                  nativeButton={false}
                  render={<Link href="/register" />}
                >
                  Get started free <ArrowRight />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 cursor-pointer bg-background px-6 text-base"
                  nativeButton={false}
                  render={<a href="#how-it-works" />}
                >
                  See how it works
                </Button>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" /> Nothing sent without approval
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" /> Compliant job sources only
                </span>
              </div>
            </div>
            <HeroPreview />
          </div>
        </section>

        <section className="border-b">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-8 text-sm text-muted-foreground md:px-8">
            <span className="font-medium text-foreground">Jobs from employer boards on</span>
            {["Greenhouse", "Lever", "Ashby", "Workable", "SmartRecruiters", "USAJOBS"].map((s) => (
              <span key={s} className="font-heading text-base font-semibold">
                {s}
              </span>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-20">
          <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
            <HowItWorks />
          </div>
        </section>

        <section id="features" className="scroll-mt-20 border-y bg-muted/40">
          <div className="mx-auto max-w-7xl space-y-12 px-4 py-20 md:px-8">
            <div className="mx-auto max-w-2xl space-y-3 text-center">
              <p className="text-sm font-semibold tracking-wider text-primary uppercase">Features</p>
              <h2 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
                Everything a job search needs, in one place
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div key={f.title} className="space-y-3 rounded-2xl border bg-background p-6">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <f.icon className="size-5" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="control" className="scroll-mt-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 md:px-8 lg:grid-cols-2">
            <div className="space-y-5">
              <p className="text-sm font-semibold tracking-wider text-primary uppercase">You stay in control</p>
              <h2 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
                AI does the work. You make the decisions.
              </h2>
              <p className="text-muted-foreground">
                The platform only pauses for you when a decision matters, and never
                acts without you.
              </p>
            </div>
            <div className="space-y-3">
              {control.map(([t, d], i) => (
                <div key={t} className="flex gap-4 rounded-2xl border p-5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium">{t}</p>
                    <p className="text-sm text-muted-foreground">{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="px-4 py-20 md:px-8">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-primary px-8 py-14 text-center text-primary-foreground">
            <div className="absolute -right-20 -top-20 size-72 rounded-full bg-primary-foreground/10" />
            <div className="relative space-y-5">
              <h2 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
                Ready to find your next role?
              </h2>
              <p className="mx-auto max-w-xl text-primary-foreground/80">
                Create an account and upload your CV. Your ranked matches are a few minutes away.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="h-12 cursor-pointer px-6 text-base"
                nativeButton={false}
                render={<Link href="/register" />}
              >
                Get started free <ArrowRight />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default Home
