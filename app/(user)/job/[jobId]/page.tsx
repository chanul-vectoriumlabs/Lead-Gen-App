import { Suspense } from "react"
import type { Metadata } from "next"

import { JobDetails } from "@/components/user/job-details"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Job details | JobPilot",
}

const JobDetailsPage = () => (
  <Suspense fallback={<Skeleton className="mx-auto h-96 w-full max-w-7xl" />}>
    <JobDetails />
  </Suspense>
)

export default JobDetailsPage
