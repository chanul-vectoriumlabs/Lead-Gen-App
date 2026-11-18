import type { Metadata } from "next"

import { AuthShell } from "@/components/auth/auth-shell"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Create account | JobPilot",
}

const RegisterPage = () => {
  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your account"
      description="Upload your CV and let us find and prepare applications for you."
      panelTitle="Start with your CV. We do the searching."
      panelText="Create an account, upload your CV, and get ranked jobs with tailored applications ready to approve."
      points={[
        "Free to start, no job board accounts needed",
        "Jobs only from approved, compliant sources",
        "You approve every application before it is sent",
        "Your data is encrypted and never sold",
      ]}
    >
      <RegisterForm />
    </AuthShell>
  )
}

export default RegisterPage
