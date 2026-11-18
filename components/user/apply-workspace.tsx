"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronLeft,
  CircleDot,
  FileText,
  Mail,
  PieChart,
  Plus,
  ShieldCheck,
  X,
  Zap,
} from "lucide-react"

import {
  AutofillForm,
  useAutofillState,
  validateAnswers,
  type AutofillErrors,
} from "@/components/user/autofill-form"
import { loadAnswers } from "@/components/user/answers-store"
import { useCv } from "@/components/user/cv-store"
import { DocumentEditor, draftLetterDoc, draftResumeDoc } from "@/components/user/document-editor"
import { UploadResumeDialog } from "@/components/user/upload-resume-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Skeleton } from "@/components/ui/skeleton"
import { analyse } from "@/lib/job-analysis"
import { MatchRing as Ring } from "@/components/user/match-ring"
import { matches } from "@/lib/user-matches"
import { cn } from "@/lib/utils"

const Stepper = ({ step }: { step: 1 | 2 }) => (
  <ol className="flex items-center justify-center gap-3 text-sm font-medium">
    <li className="flex items-center gap-2">
      <span
        className={cn(
          "flex size-7 items-center justify-center rounded-full text-xs",
          "bg-primary text-primary-foreground"
        )}
      >
        {step === 2 ? <Check className="size-4" /> : "1"}
      </span>
      Resume
    </li>
    <li aria-hidden className={cn("h-px w-16", step === 2 ? "bg-primary" : "bg-border")} />
    <li className={cn("flex items-center gap-2", step === 1 && "text-muted-foreground")}>
      <span
        className={cn(
          "flex size-7 items-center justify-center rounded-full text-xs",
          step === 2 ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        2
      </span>
      Autofill form
    </li>
  </ol>
)

export const ApplyWorkspace = () => {
  const { jobId } = useParams<{ jobId: string }>()
  const queue = (useSearchParams().get("next") ?? "").split(",").filter(Boolean)
  const router = useRouter()
  const cv = useCv()
  const job = matches.find((m) => m.id === jobId)

  const [step, setStep] = useState<1 | 2>(1)
  const [resumeChoice, setResumeChoice] = useState("primary")
  const [resume, setResume] = useState(() => (job ? draftResumeDoc(job) : null))
  const [letter, setLetter] = useState(() => (job ? draftLetterDoc(job) : null))
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<AutofillErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const { answers, onAnswer, screening, setScreening, fill } = useAutofillState()

  const analysis = useMemo(() => (job ? analyse(job) : null), [job])

  if (!job || !analysis) {
    return (
      <Card className="mx-auto w-full max-w-3xl border border-border">
        <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
          <p className="font-heading text-lg font-semibold">Job not found</p>
          <p className="text-sm text-muted-foreground">This job may have been closed or removed.</p>
          <Button nativeButton={false} render={<Link href="/dashboard" />}>
            Back to dashboard
          </Button>
        </CardContent>
      </Card>
    )
  }

  const nextHref = queue.length ? `/apply/${queue[0]}${queue.length > 1 ? `?next=${queue.slice(1).join(",")}` : ""}` : null

  const submit = () => {
    const e = validateAnswers(answers, screening)
    if (!consent) e.consent = "Please confirm before approving."
    setErrors(e)
    if (Object.keys(e).length) {
      requestAnimationFrame(() =>
        document.querySelector("[aria-invalid=true], .text-destructive")?.scrollIntoView({ behavior: "smooth", block: "center" })
      )
      return
    }
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
        <Link href="/dashboard" className="flex items-center gap-1 font-medium text-primary hover:underline">
          <ChevronLeft className="size-4" /> Back to matches
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-medium">Autofill workspace</span>
      </nav>

      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 font-heading text-xl font-semibold text-primary">
          {job.company[0]}
        </div>
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">{job.title}</h1>
          <p className="text-sm text-muted-foreground">
            {job.company} &middot; {job.workplace}
          </p>
        </div>
      </div>

      {submitted ? (
        <Card className="border border-border">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="size-7" />
            </span>
            <div className="space-y-1">
              <h2 className="font-heading text-xl font-semibold">Application approved</h2>
              <p className="max-w-md text-sm text-muted-foreground">
                We&apos;ll submit it through the employer&apos;s permitted channel. If there isn&apos;t one, you&apos;ll
                get a ready package with your documents and the official application link.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" nativeButton={false} render={<Link href="/tracker" />}>
                View in job tracker
              </Button>
              {nextHref ? (
                <Button nativeButton={false} render={<Link href={nextHref} />}>
                  Next job ({queue.length} left) <ArrowRight />
                </Button>
              ) : (
                <Button nativeButton={false} render={<Link href="/dashboard" />}>
                  Back to dashboard
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Stepper step={step} />

          {step === 1 ? (
            <Card className="border border-border">
              <CardContent className="space-y-5">
                <div className="space-y-1">
                  <h2 className="font-heading text-xl font-semibold">Prepare your resume</h2>
                  <p className="text-sm text-muted-foreground">
                    Pick the resume to use. It&apos;s the data source for the autofilled form in the next step.
                  </p>
                </div>

                {cv === undefined ? (
                  <Skeleton className="h-14 w-full" />
                ) : cv ? (
                  <RadioGroup value={resumeChoice} onValueChange={(v) => setResumeChoice(v as string)}>
                    <label
                      htmlFor="resume-primary"
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3.5 text-sm font-medium",
                        resumeChoice === "primary" && "border-primary bg-primary/5"
                      )}
                    >
                      <RadioGroupItem id="resume-primary" value="primary" />
                      <FileText className="size-4 text-primary" />
                      {cv.name}
                      <Badge variant="secondary" className="ml-auto">
                        Primary
                      </Badge>
                    </label>
                  </RadioGroup>
                ) : (
                  <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    You don&apos;t have a resume yet. Upload one to continue.
                  </p>
                )}

                <div className="flex justify-center rounded-lg border border-dashed p-3">
                  <UploadResumeDialog
                    trigger={
                      <Button variant="ghost" className="text-primary">
                        <Plus /> Upload new resume
                      </Button>
                    }
                  />
                </div>

                <div className="space-y-4 rounded-xl border bg-muted/40 p-5">
                  <div className="flex flex-wrap items-center gap-5">
                    <Ring value={analysis.pct} />
                    <div className="space-y-1">
                      <p className="font-heading text-lg font-semibold">
                        Your resume matches <span className="text-primary">{analysis.pct}%</span> of job keywords
                      </p>
                      <Dialog>
                        <DialogTrigger
                          render={<Button variant="link" className="h-auto px-0 text-primary" />}
                        >
                          <PieChart /> See skills match analysis
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Skills match analysis</DialogTitle>
                            <DialogDescription>
                              Keywords from the job description compared with your resume.
                            </DialogDescription>
                          </DialogHeader>
                          {(
                            [
                              ["Full matches", analysis.full, Check, "bg-primary/10 text-primary"],
                              ["Partial matches", analysis.partial, CircleDot, "bg-muted text-foreground"],
                              ["Missing", analysis.missing, X, "bg-destructive/10 text-destructive"],
                            ] as const
                          ).map(([label, list, Icon, tone]) => (
                            <div key={label} className="space-y-2">
                              <p className="text-sm font-medium">
                                {label} ({list.length})
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {list.map((k) => (
                                  <span key={k} className={cn("flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium", tone)}>
                                    <Icon className="size-3" /> {k}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                          <p className="text-xs text-muted-foreground">
                            Missing keywords are never added to your resume unless your CV shows them.
                          </p>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5">
                      <Check className="size-4 text-primary" /> <b>{analysis.full.length}</b> Full matches
                    </span>
                    <span className="flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5">
                      <CircleDot className="size-4 text-muted-foreground" /> <b>{analysis.partial.length}</b> Partial
                    </span>
                    <span className="flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5">
                      <X className="size-4 text-destructive" /> <b>{analysis.missing.length}</b> Missing
                    </span>
                  </div>
                </div>

                <div className="flex justify-end border-t pt-5">
                  <Button
                    size="lg"
                    disabled={!cv}
                    onClick={() => {
                      const saved = loadAnswers()
                      fill(saved.answers, saved.screening)
                      setErrors({})
                      setStep(2)
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }}
                  >
                    Continue <ArrowRight />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="overflow-visible border border-border">
              <CardContent className="space-y-5">
                <div className="space-y-1">
                  <h2 className="font-heading text-xl font-semibold">Confirm your details</h2>
                  <p className="text-sm text-muted-foreground">
                    Review the resume and cover letter tailored to this job. Your answers are filled in from your profile; change anything that is different for this job.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {resume && (
                    <DocumentEditor
                      kind="resume"
                      icon={FileText}
                      title="Resume"
                      description="Tailored with the job's keywords, using only facts from your CV"
                      fileName={`Priya_Sharma_Resume_${job.company.replace(/\s+/g, "_")}.pdf`}
                      value={resume}
                      onSave={setResume}
                    />
                  )}
                  {letter && (
                    <DocumentEditor
                      kind="letter"
                      icon={Mail}
                      title="Cover letter"
                      description="Written for this job to show your strengths"
                      fileName={`Priya_Sharma_Cover_Letter_${job.company.replace(/\s+/g, "_")}.pdf`}
                      value={letter}
                      onSave={setLetter}
                    />
                  )}
                </div>

                <AutofillForm
                  answers={answers}
                  onAnswer={(k, v) => {
                    onAnswer(k, v)
                    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
                  }}
                  screening={screening}
                  onScreening={(v) => {
                    setScreening(v)
                    if (errors.screening) setErrors((e) => ({ ...e, screening: undefined }))
                  }}
                  errors={errors}
                />

                <div className="space-y-4 border-t pt-5">
                  <div className="space-y-1">
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="consent"
                        checked={consent}
                        onCheckedChange={(v) => {
                          setConsent(!!v)
                          setErrors((e) => ({ ...e, consent: undefined }))
                        }}
                        aria-invalid={!!errors.consent || undefined}
                        className="mt-0.5"
                      />
                      <Label htmlFor="consent" className="leading-snug font-normal text-muted-foreground">
                        I&apos;ve reviewed the resume, cover letter and answers. I approve submitting this application to{" "}
                        {job.company} with my details.
                      </Label>
                    </div>
                    {errors.consent && <p className="text-xs font-medium text-destructive">{errors.consent}</p>}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setStep(1)
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }}
                    >
                      <ArrowLeft /> Back
                    </Button>
                    <div className="flex items-center gap-3">
                      <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                        <ShieldCheck className="size-4 text-primary" /> Nothing is sent before you approve
                      </span>
                      <Button size="lg" onClick={submit}>
                        <Zap /> Approve and submit
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
      {queue.length > 0 && !submitted && (
        <p className="text-center text-xs text-muted-foreground">
          {queue.length} more {queue.length === 1 ? "job" : "jobs"} in this auto apply batch.{" "}
          <button type="button" className="cursor-pointer text-primary hover:underline" onClick={() => router.push("/dashboard")}>
            Leave the rest for later
          </button>
        </p>
      )}
    </div>
  )
}
