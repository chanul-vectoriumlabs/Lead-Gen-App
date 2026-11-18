import type { Metadata } from "next"

import { UserDashboard } from "@/components/user/user-dashboard"

export const metadata: Metadata = {
  title: "Dashboard | JobPilot",
}

const DashboardPage = () => <UserDashboard />

export default DashboardPage
