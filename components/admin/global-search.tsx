"use client"

import { useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  Briefcase,
  FileText,
  LayoutDashboard,
  ScrollText,
  Search,
  Settings,
  UserSearch,
  Users,
  type LucideIcon,
} from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { applications, candidates, jobs, leads } from "@/lib/mock-data"
import { isHiddenAdminPage } from "@/lib/admin-pages"

type Suggestion = {
  id: string
  group: "Pages" | "Candidates" | "Jobs" | "Recruiter leads" | "Applications"
  label: string
  detail?: string
  href: string
  icon: LucideIcon
}

const pages: Suggestion[] = [
  { id: "p-overview", group: "Pages", label: "Overview", href: "/admin", icon: LayoutDashboard },
  { id: "p-candidates", group: "Pages", label: "Candidates", href: "/admin/candidates", icon: Users },
  { id: "p-applications", group: "Pages", label: "Applications", href: "/admin/applications", icon: FileText },
  { id: "p-jobs", group: "Pages", label: "Jobs", href: "/admin/jobs", icon: Briefcase },
  { id: "p-leads", group: "Pages", label: "Recruiter leads", href: "/admin/leads", icon: UserSearch },
  { id: "p-analytics", group: "Pages", label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { id: "p-settings", group: "Pages", label: "Settings", href: "/admin/settings", icon: Settings },
  { id: "p-logs", group: "Pages", label: "Logs", href: "/admin/logs", icon: ScrollText },
]

const allSuggestions: Suggestion[] = [
  ...pages,
  ...candidates.map<Suggestion>((c) => ({
    id: "c-" + c.id,
    group: "Candidates",
    label: c.name,
    detail: c.title,
    href: `/admin/candidates/${c.id}`,
    icon: Users,
  })),
  ...jobs.map<Suggestion>((j, i) => ({
    id: "j-" + i,
    group: "Jobs",
    label: j.title,
    detail: `${j.company} - ${j.location}`,
    href: "/admin/jobs",
    icon: Briefcase,
  })),
  ...leads.map<Suggestion>((l, i) => ({
    id: "l-" + i,
    group: "Recruiter leads",
    label: l.name,
    detail: `${l.role}, ${l.company}`,
    href: "/admin/leads",
    icon: UserSearch,
  })),
  ...applications.map<Suggestion>((a, i) => ({
    id: "a-" + i,
    group: "Applications",
    label: a.job,
    detail: `${a.candidate} - ${a.status}`,
    href: "/admin/applications",
    icon: FileText,
  })),
]

// Hidden admin pages (and their results) are left out.
const all = allSuggestions.filter((s) => !isHiddenAdminPage(s.href))

const GROUPS: Suggestion["group"][] = [
  "Pages",
  "Candidates",
  "Jobs",
  "Recruiter leads",
  "Applications",
]

export const GlobalSearch = () => {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return pages.slice(0, 5)
    return all.filter((s) =>
      `${s.label} ${s.detail ?? ""} ${s.group}`.toLowerCase().includes(q)
    )
  }, [query])

  const go = (href: string) => {
    setOpen(false)
    setQuery("")
    inputRef.current?.blur()
    router.push(href)
  }

  return (
    <Command
      shouldFilter={false}
      loop
      className="relative hidden w-72 overflow-visible bg-transparent p-0 md:flex"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false)
          inputRef.current?.blur()
        }
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false)
      }}
    >
      <Search className="pointer-events-none absolute left-2.5 top-1/2 z-10 size-4 -translate-y-1/2 text-foreground/60" />
      <Input
        ref={inputRef}
        value={query}
        placeholder="Search candidates, jobs, leads"
        className="h-9 border-input bg-background pl-8 shadow-xs"
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
      />

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-[26rem] overflow-hidden rounded-xl border bg-popover shadow-lg"
          onMouseDown={(e) => e.preventDefault()}
        >
          <CommandList className="max-h-96 p-1">
            <CommandEmpty>
              No results for &ldquo;{query}&rdquo;
            </CommandEmpty>
            {GROUPS.map((g) => {
              const items = results.filter((r) => r.group === g).slice(0, 5)
              if (items.length === 0) return null
              return (
                <CommandGroup
                  key={g}
                  heading={query.trim() ? g : "Quick links"}
                >
                  {items.map((s) => (
                    <CommandItem
                      key={s.id}
                      value={s.id}
                      onSelect={() => go(s.href)}
                      className="cursor-pointer gap-3 py-2"
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <s.icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1 leading-tight">
                        <div className="truncate text-sm font-medium">{s.label}</div>
                        {s.detail && (
                          <div className="truncate text-xs text-muted-foreground">
                            {s.detail}
                          </div>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            })}
          </CommandList>
        </div>
      )}
    </Command>
  )
}
