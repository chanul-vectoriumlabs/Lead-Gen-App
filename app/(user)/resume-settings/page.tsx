import { Suspense } from "react"
import type { Metadata } from "next"

import { ResumeSettings } from "@/components/user/resume-settings"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Job & resume settings | JobPilot",
}

const ResumeSettingsPage = () => (
  <Suspense fallback={<Skeleton className="mx-auto h-96 w-full max-w-6xl" />}>
    <ResumeSettings />
  </Suspense>
)

export default ResumeSettingsPage
