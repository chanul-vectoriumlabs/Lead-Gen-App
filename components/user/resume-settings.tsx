"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  Clock,
  Download,
  Eye,
  FileText,
  ListChecks,
  MessageSquareText,
  MoreHorizontal,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react"

import { clearCv, useCv } from "@/components/user/cv-store"
import { AutofillQuestions } from "@/components/user/autofill-questions"
import { JobPreferences } from "@/components/user/job-preferences"
import { UploadResumeDialog } from "@/components/user/upload-resume-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type SettingsTab = "base" | "optimized" | "preferences" | "autofill"

const tabs: { value: SettingsTab; label: string; icon: typeof FileText }[] = [
  { value: "base", label: "Base resumes", icon: FileText },
  { value: "optimized", label: "Job-optimized resumes", icon: Sparkles },
  { value: "preferences", label: "Job preferences", icon: ListChecks },
  { value: "autofill", label: "Autofill questions", icon: MessageSquareText },
]

// Placeholder tailored resumes. Replace with the Application Agent's drafts.
const optimized = [
  { id: "o1", job: "Senior Data Engineer", company: "Acme Corp", version: 2, status: "Awaiting approval", updated: "1 hour ago" },
  { id: "o2", job: "Data Platform Engineer", company: "Northwind", version: 1, status: "Drafting", updated: "Today" },
  { id: "o3", job: "Data Engineer", company: "Orbit", version: 1, status: "Approved", updated: "3 days ago" },
]

const Section = ({
  title,
  description,
  action,
  children,
}: {
  title: string
  description: string
  action?: ReactNode
  children: ReactNode
}) => (
  <div className="space-y-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="space-y-1">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
    {children}
  </div>
)

const BaseResumes = () => {
  const cv = useCv()
  const [primary, setPrimary] = useState(true)

  return (
    <Section
      title="Base resumes"
      description="Your master resume versions. We use these to generate tailored versions for specific jobs."
      action={<UploadResumeDialog />}
    >
      {cv === undefined ? (
        <Skeleton className="h-28 w-full" />
      ) : cv === null ? (
        <Card className="border border-dashed border-border">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <FileText className="size-8 text-muted-foreground" />
            <p className="font-medium">No resume yet</p>
            <p className="text-sm text-muted-foreground">Upload your CV to start getting matched with jobs.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-border">
          <CardContent className="flex flex-wrap items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="size-6" />
            </div>
            <div className="min-w-48 flex-1 space-y-1">
              <p className="flex items-center gap-2 font-medium">
                {cv.name}
                {primary && <Badge>Primary</Badge>}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="size-3" /> Last updated{" "}
                {new Date(cv.uploadedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
              </p>
              {!primary && (
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-1 text-xs font-medium text-primary hover:underline"
                  onClick={() => setPrimary(true)}
                >
                  <Star className="size-3" /> Set as primary
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button className="cursor-pointer" nativeButton={false} render={<Link href="/dashboard" />}>
                Match to new job
              </Button>
              <Button variant="outline" className="cursor-pointer">
                <Eye /> View resume
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost" size="icon" className="cursor-pointer" aria-label="More actions" />
                  }
                >
                  <MoreHorizontal />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 p-1.5">
                  <DropdownMenuItem className="cursor-pointer py-2">
                    <Download /> Download
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer py-2" onClick={() => setPrimary(false)}>
                    <Star /> Unset primary
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" className="cursor-pointer py-2" onClick={clearCv}>
                    <Trash2 /> Delete resume
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      )}
    </Section>
  )
}

const OptimizedResumes = () => (
  <Section
    title="Job-optimized resumes"
    description="Tailored resume and cover letter drafts for jobs you chose. Written only from facts in your CV."
  >
    <ul className="divide-y rounded-xl border bg-card">
      {optimized.map((o) => (
        <li key={o.id} className="flex flex-wrap items-center gap-4 p-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-heading text-lg font-semibold text-primary">
            {o.company[0]}
          </div>
          <div className="min-w-48 flex-1">
            <p className="font-medium">{o.job}</p>
            <p className="text-sm text-muted-foreground">
              {o.company} &middot; Version {o.version} &middot; {o.updated}
            </p>
          </div>
          <Badge variant={o.status === "Awaiting approval" ? "default" : o.status === "Approved" ? "outline" : "secondary"}>
            {o.status}
          </Badge>
          <Button
            variant={o.status === "Awaiting approval" ? "default" : "outline"}
            className="cursor-pointer"
            disabled={o.status === "Drafting"}
          >
            {o.status === "Awaiting approval" ? "Review and approve" : "View"}
          </Button>
        </li>
      ))}
    </ul>
  </Section>
)

const TAB_VALUES: SettingsTab[] = ["base", "optimized", "preferences", "autofill"]

export const ResumeSettings = () => {
  const param = useSearchParams().get("tab")
  const initialTab = TAB_VALUES.find((t) => t === param) ?? "base"

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        Job &amp; resume settings
      </p>
      <Tabs key={initialTab} defaultValue={initialTab} className="gap-8">
        <TabsList
          variant="line"
          className="h-auto! w-full justify-start gap-1 overflow-x-auto rounded-none border-b p-0"
        >
          {tabs.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="h-11 flex-none cursor-pointer gap-2 rounded-none px-4 text-muted-foreground after:bg-primary hover:text-foreground data-active:text-primary group-data-horizontal/tabs:after:-bottom-px!"
            >
              <t.icon className="size-4" />
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="base">
          <BaseResumes />
        </TabsContent>
        <TabsContent value="optimized">
          <OptimizedResumes />
        </TabsContent>
        <TabsContent value="preferences">
          <JobPreferences />
        </TabsContent>
        <TabsContent value="autofill">
          <AutofillQuestions />
        </TabsContent>
      </Tabs>
    </div>
  )
}
