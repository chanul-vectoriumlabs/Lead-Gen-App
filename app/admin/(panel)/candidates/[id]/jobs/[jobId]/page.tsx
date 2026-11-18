import { Suspense } from "react"
import type { Metadata } from "next"

import { MatchDetail } from "@/components/admin/match-detail"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Job details | JobPilot Admin",
}

const JobDetailsPage = () => (
  <Suspense fallback={<Skeleton className="h-96 w-full" />}>
    <MatchDetail />
  </Suspense>
)

export default JobDetailsPage
