"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react"

import { GoogleButton, OrDivider } from "@/components/auth/google-button"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Errors = Partial<Record<"name" | "email" | "password" | "confirm" | "terms", string>>

const strength = (p: string) => {
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++
  if (/\d/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
}

const strengthLabel = ["Too short", "Weak", "Fair", "Good", "Strong"]

const FieldError = ({ id, message }: { id: string; message?: string }) =>
  message ? (
    <p id={id} className="text-xs text-destructive">
      {message}
    </p>
  ) : null

export const RegisterForm = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [show, setShow] = useState(false)
  const [terms, setTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [done, setDone] = useState(false)

  const score = strength(password)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: Errors = {}
    if (name.trim().length < 2) next.name = "Enter your full name."
    if (!EMAIL.test(email)) next.email = "Enter a valid email address."
    if (password.length < 8) next.password = "Use at least 8 characters."
    if (confirm !== password) next.confirm = "Passwords do not match."
    if (!terms) next.terms = "Please accept the terms to continue."
    setErrors(next)
    if (Object.keys(next).length) return

    // Demo only: account creation is not connected yet (Supabase auth later).
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setDone(true)
    }, 900)
  }

  if (done) {
    return (
      <div className="space-y-5 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Mail className="size-6" />
        </div>
        <div className="space-y-1">
          <h2 className="font-heading text-lg font-semibold">Check your email</h2>
          <p className="text-sm text-muted-foreground">
            We sent a confirmation link to <span className="font-medium text-foreground">{email}</span>.
            Confirm it to finish creating your account.
          </p>
        </div>
        <Button
          className="w-full cursor-pointer"
          size="lg"
          nativeButton={false}
          render={<Link href="/login" />}
        >
          Back to sign in
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <GoogleButton label="Sign up with Google" />
      <OrDivider />

      <form onSubmit={submit} noValidate className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              autoComplete="name"
              placeholder="Priya Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
              className="h-11 bg-background pl-9"
            />
          </div>
          <FieldError id="name-error" message={errors.name} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className="h-11 bg-background pl-9"
            />
          </div>
          <FieldError id="email-error" message={errors.email} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby="password-strength"
              className="h-11 bg-background px-9"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff /> : <Eye />}
            </Button>
          </div>
          {password && (
            <div id="password-strength" className="space-y-1.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-full",
                      i <= score
                        ? score <= 1
                          ? "bg-destructive"
                          : "bg-primary"
                        : "bg-muted"
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Strength: <span className="font-medium text-foreground">{strengthLabel[score]}</span>
              </p>
            </div>
          )}
          <FieldError id="password-error" message={errors.password} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirm"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              aria-invalid={!!errors.confirm}
              aria-describedby={errors.confirm ? "confirm-error" : undefined}
              className="h-11 bg-background pl-9"
            />
          </div>
          <FieldError id="confirm-error" message={errors.confirm} />
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              checked={terms}
              onCheckedChange={(v) => setTerms(!!v)}
              aria-invalid={!!errors.terms}
              className="mt-0.5 cursor-pointer"
            />
            <Label htmlFor="terms" className="cursor-pointer leading-snug font-normal text-muted-foreground">
              <span className="block">
              I agree to the{" "}
              <Link href="#" className="font-medium text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="font-medium text-primary hover:underline">
                Privacy Policy
              </Link>
              </span>
            </Label>
          </div>
          <FieldError id="terms-error" message={errors.terms} />
        </div>

        <Button type="submit" size="lg" className="h-11 w-full cursor-pointer" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          {loading ? "Creating account..." : "Create account"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
