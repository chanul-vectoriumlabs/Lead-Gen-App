"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react"

import { GoogleButton, OrDivider } from "@/components/auth/google-button"
import { signIn } from "@/components/auth/session-store"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const LoginForm = ({
  variant,
}: {
  variant: "admin" | "user"
}) => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({})

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next: typeof errors = {}
    if (variant === "user") {
      // Demo: any email and password lets the user in.
      if (!email.trim()) next.email = "Enter your email."
      if (!password) next.password = "Enter your password."
    } else {
      if (!EMAIL.test(email)) next.email = "Enter a valid email address."
      if (password.length < 8) next.password = "Password must be at least 8 characters."
    }
    setErrors(next)
    if (Object.keys(next).length) return

    // Demo only: authentication is not connected yet (Supabase auth later).
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const name = variant === "admin" ? "Admin User" : "Priya Sharma"
      signIn({ email: email.trim(), name, role: variant })
      router.push(variant === "admin" ? "/admin" : "/dashboard")
    }, 800)
  }

  return (
    <div className="space-y-6">
      {variant === "user" && (
        <>
          <GoogleButton label="Sign in with Google" href="/dashboard" />
          <OrDivider />
        </>
      )}
    <form onSubmit={submit} noValidate className="space-y-5">

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={variant === "admin" ? "admin@company.com" : "you@example.com"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="h-11 bg-background pl-9"
          />
        </div>
        {errors.email && (
          <p id="email-error" className="text-xs text-destructive">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="#"
            className="text-xs font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
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
        {errors.password && (
          <p id="password-error" className="text-xs text-destructive">
            {errors.password}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="remember"
          checked={remember}
          onCheckedChange={(v) => setRemember(!!v)}
          className="cursor-pointer"
        />
        <Label htmlFor="remember" className="cursor-pointer font-normal text-muted-foreground">
          Keep me signed in for 30 days
        </Label>
      </div>

      <Button type="submit" size="lg" className="h-11 w-full cursor-pointer" disabled={loading}>
        {loading && <Loader2 className="animate-spin" />}
        {loading ? "Signing in..." : variant === "admin" ? "Sign in to admin panel" : "Sign in"}
      </Button>

      <p className={cn("text-center text-sm text-muted-foreground")}>
        {variant === "admin" ? (
          <>
            Not an administrator?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Go to user sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
    </div>
  )
}
