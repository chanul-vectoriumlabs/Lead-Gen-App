"use client"

import { Fragment, Suspense } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { GlobalSearch } from "@/components/admin/global-search"
import { Notifications } from "@/components/admin/notifications"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { getMatchDetail } from "@/lib/candidate-detail"
import { candidateList } from "@/lib/mock-data"

const labels: Record<string, string> = {
  leads: "Recruiter leads",
}

const titleCase = (s: string) =>
  labels[s] ??
  candidateList.find((c) => c.id === s)?.name ??
  s.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase())

// A candidate's job page: Candidates > Name > Job title (there is no ".../jobs" page).
const matchCrumbs = (parts: string[]) => {
  const candidate = candidateList.find((c) => c.id === parts[1])
  const job = candidate ? getMatchDetail(candidate, decodeURIComponent(parts[3])) : null
  return [
    { label: "Candidates", href: "/admin/candidates" },
    { label: candidate?.name ?? titleCase(parts[1]), href: `/admin/candidates/${parts[1]}` },
    { label: job?.match.title ?? "Job", href: "/admin/" + parts.join("/") },
  ]
}

const Crumbs = ({ pathname }: { pathname: string }) => {
  const parts = pathname.split("/").filter(Boolean).slice(1)
  const crumbs =
    parts.length === 0
      ? [{ label: "Overview", href: "/admin" }]
      : parts[0] === "candidates" && parts[2] === "jobs" && parts[3]
        ? matchCrumbs(parts)
        : parts.map((p, i) => ({
            label: titleCase(p),
            href: "/admin/" + parts.slice(0, i + 1).join("/"),
          }))

  return (
    <Breadcrumb>
      <BreadcrumbList className="gap-2 sm:gap-2">
        <BreadcrumbItem>
          <BreadcrumbLink
            render={<Link href="/admin" aria-label="Admin home" />}
            className="flex size-7 items-center justify-center rounded-md bg-muted hover:bg-accent"
          >
            <Home className="size-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1
          return (
            <Fragment key={c.href}>
              <BreadcrumbSeparator className="text-muted-foreground/60" />
              <BreadcrumbItem>
                {last ? (
                  <BreadcrumbPage className="rounded-md bg-primary/10 px-2.5 py-1 font-medium text-primary">
                    {c.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={<Link href={c.href} />}
                    className="rounded-md px-1.5 py-1 font-medium hover:bg-accent"
                  >
                    {c.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

// usePathname is URL data, so it sits behind Suspense to keep dynamic routes prerenderable.
const ActiveCrumbs = () => <Crumbs pathname={usePathname()} />

export const Topbar = () => {

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger className="cursor-pointer" />
      <Separator orientation="vertical" className="h-4" />
      <Suspense fallback={<Crumbs pathname="/admin" />}>
        <ActiveCrumbs />
      </Suspense>

      <div className="ml-auto flex items-center gap-2">
        <GlobalSearch />
        <Notifications />
      </div>
    </header>
  )
}
