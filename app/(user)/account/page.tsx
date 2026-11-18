import { Suspense } from "react"
import type { Metadata } from "next"

import { AccountSettings } from "@/components/user/account-settings"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Account & billing | JobPilot",
}

const AccountPage = () => (
  <Suspense fallback={<Skeleton className="mx-auto h-96 w-full max-w-5xl" />}>
    <AccountSettings />
  </Suspense>
)

export default AccountPage
