import { Suspense } from "react"
import type { Metadata } from "next"

import { CandidateDetail } from "@/components/admin/candidate-detail"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Candidate | JobPilot Admin",
}

const CandidatePage = () => (
  <Suspense fallback={<Skeleton className="h-96 w-full" />}>
    <CandidateDetail />
  </Suspense>
)

export default CandidatePage
