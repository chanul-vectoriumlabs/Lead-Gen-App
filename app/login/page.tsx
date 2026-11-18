import type { Metadata } from "next"

import { AuthShell } from "@/components/auth/auth-shell"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Sign in | JobPilot",
}

const UserLoginPage = () => {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your account"
      description="Upload your CV, review matched jobs and approve your applications."
      panelTitle="Your next role, matched to your CV."
      panelText="Upload your CV once. We find, rank and prepare applications for you to approve."
      points={[
        "Jobs ranked against your CV, with the reason for each score",
        "Tailored resume and cover letter for every job you pick",
        "Nothing is submitted without your approval",
        "Track every application and follow-up in one place",
      ]}
    >
      <LoginForm variant="user" />
    </AuthShell>
  )
}

export default UserLoginPage
