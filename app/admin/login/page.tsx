import type { Metadata } from "next"

import { AuthShell } from "@/components/auth/auth-shell"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Admin sign in | JobPilot",
}

const AdminLoginPage = () => {
  return (
    <AuthShell
      eyebrow="Admin panel"
      badge="Restricted"
      title="Sign in as administrator"
      description="Manage candidates, approvals, sources and system health."
      panelTitle="Run the whole platform from one place."
      panelText="Every agent, workflow and decision in a single dashboard."
      points={[
        "Track every candidate across the 5-stage workflow",
        "See what needs your decision, with one-click actions",
        "Monitor agent runs, failures and retries",
        "Manage users, roles and approved job sources",
      ]}
    >
      <LoginForm variant="admin" />
    </AuthShell>
  )
}

export default AdminLoginPage
