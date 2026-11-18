import { Suspense } from "react"
import type { Metadata } from "next"

import { ApplyWorkspace } from "@/components/user/apply-workspace"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Autofill workspace | JobPilot",
}

const ApplyPage = () => (
  <Suspense fallback={<Skeleton className="mx-auto h-96 w-full max-w-3xl" />}>
    <ApplyWorkspace />
  </Suspense>
)

export default ApplyPage
