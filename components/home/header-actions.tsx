"use client"

import Link from "next/link"
import { LayoutDashboard } from "lucide-react"

import { useSession } from "@/components/auth/session-store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

export const HeaderActions = () => {
  const session = useSession()

  if (session === undefined) return <Skeleton className="h-9 w-48" />

  if (session) {
    const home = session.role === "admin" ? "/admin" : "/dashboard"
    return (
      <div className="flex items-center gap-3">
        <Avatar className="hidden size-8 sm:flex">
          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
            {initials(session.name)}
          </AvatarFallback>
        </Avatar>
        <Button nativeButton={false} render={<Link href={home} />}>
          <LayoutDashboard /> Dashboard
        </Button>
      </div>
    )
  }

  return (
    <>
      <Button variant="ghost" nativeButton={false} render={<Link href="/login" />}>
        Sign in
      </Button>
      <Button nativeButton={false} render={<Link href="/register" />}>
        Get started
      </Button>
    </>
  )
}
