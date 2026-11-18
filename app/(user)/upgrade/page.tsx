import { Suspense } from "react"
import type { Metadata } from "next"

import { UpgradePlans } from "@/components/user/upgrade-plans"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Upgrade | JobPilot",
}

const UpgradePage = () => (
  <Suspense fallback={<Skeleton className="mx-auto h-96 w-full max-w-6xl" />}>
    <UpgradePlans />
  </Suspense>
)

export default UpgradePage
