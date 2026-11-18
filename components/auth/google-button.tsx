"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { signIn } from "@/components/auth/session-store"
import { Button } from "@/components/ui/button"

export const GoogleButton = ({ label, href }: { label: string; href?: string }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="h-11 w-full cursor-pointer gap-3 bg-background font-medium"
      disabled={loading}
      onClick={() => {
        // Demo only: Google OAuth is not connected yet (Supabase Google provider later).
        setLoading(true)
        setTimeout(() => {
          setLoading(false)
          if (href) {
            signIn({ email: "priya@example.com", name: "Priya Sharma", role: "user" })
            router.push(href)
          }
        }, 800)
      }}
    >
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Image src="/google.svg" alt="" width={18} height={18} />
      )}
      {label}
    </Button>
  )
}

export const OrDivider = () => (
  <div className="flex items-center gap-3">
    <span className="h-px flex-1 bg-border" />
    <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
      or continue with email
    </span>
    <span className="h-px flex-1 bg-border" />
  </div>
)
