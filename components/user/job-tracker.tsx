"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  Bookmark,
  CalendarClock,
  ClipboardList,
  Eye,
  FileText,
  History,
  MoreHorizontal,
  Trash2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { trackedJobs, trackerStatuses, type TrackerStatus } from "@/lib/tracker"
import { cn } from "@/lib/utils"

const tone = (s: TrackerStatus) =>
  s === "Awaiting approval" || s === "Needs info"
    ? "default"
    : s === "Rejected"
      ? "destructive"
      : s === "Interview" || s === "Offer"
        ? "outline"
        : "secondary"

export const JobTracker = () => {
  const [status, setStatus] = useState<"All" | TrackerStatus>("All")
  const [savedOnly, setSavedOnly] = useState(false)
  const [recent, setRecent] = useState(false)
  const [items, setItems] = useState(trackedJobs)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const base = useMemo(() => items.filter((j) => !savedOnly || j.saved), [items, savedOnly])

  const count = (s: "All" | TrackerStatus) =>
    s === "All" ? base.length : base.filter((j) => j.status === s).length

  const rows = useMemo(() => {
    const list = base.filter((j) => status === "All" || j.status === status)
    return [...list].sort((a, b) => (recent ? a.viewedMin - b.viewedMin : a.updatedMin - b.updatedMin))
  }, [base, status, recent])

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
  const current = Math.min(page, totalPages)
  const start = (current - 1) * pageSize
  const pageRows = rows.slice(start, start + pageSize)

  return (
    <Card className="border border-border">
      <CardHeader className="border-b">
        <CardTitle className="font-heading text-2xl font-semibold">Job tracker</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
          {(["All", ...trackerStatuses] as const).map((s) => {
            const active = status === s
            return (
              <Button
                key={s}
                role="tab"
                aria-selected={active}
                variant="outline"
                className={cn(
                  "cursor-pointer gap-2 bg-background",
                  active && "border-primary bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                )}
                onClick={() => {
                  setStatus(s)
                  setPage(1)
                }}
              >
                {s}
                <span
                  className={cn(
                    "flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs",
                    active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}
                >
                  {count(s)}
                </span>
              </Button>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="saved-only"
              checked={savedOnly}
              onCheckedChange={(v) => {
                setSavedOnly(!!v)
                setPage(1)
              }}
              className="cursor-pointer"
            />
            <Label htmlFor="saved-only" className="cursor-pointer font-normal">
              Saved only
            </Label>
          </div>
          <Button
            variant="outline"
            className={cn(
              "cursor-pointer bg-background",
              recent && "border-primary bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
            )}
            aria-pressed={recent}
            onClick={() => {
              setRecent((r) => !r)
              setPage(1)
            }}
          >
            <History /> Recently viewed
          </Button>
        </div>

        <Separator />

        {rows.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <ClipboardList className="size-6" />
            </div>
            <p className="font-heading text-lg font-semibold">Nothing tracked yet</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Jobs you save or apply to show up here.
            </p>
            <Button className="cursor-pointer" nativeButton={false} render={<Link href="/dashboard" />}>
              View job matches
            </Button>
          </div>
        ) : (
          <ul className="divide-y rounded-xl border">
            {pageRows.map((j) => (
              <li key={j.id} className="flex flex-wrap items-center gap-4 p-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-heading text-lg font-semibold text-primary">
                  {j.company[0]}
                </div>
                <div className="min-w-48 flex-1">
                  <p className="flex items-center gap-2 font-medium">
                    {j.title}
                    {j.saved && <Bookmark className="size-3.5 fill-primary text-primary" aria-label="Saved" />}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {j.company} &middot; {j.location}
                  </p>
                </div>
                {j.followUp && (
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CalendarClock className="size-4 text-primary" /> {j.followUp}
                  </span>
                )}
                <Badge variant={tone(j.status)}>{j.status}</Badge>
                <span className="w-24 text-right text-sm text-muted-foreground">{j.updated}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                        aria-label={`Actions for ${j.title}`}
                      />
                    }
                  >
                    <MoreHorizontal />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 p-1.5">
                    <DropdownMenuItem className="cursor-pointer py-2" render={<Link href={`/job/${j.jobId}`} />}>
                      <Eye /> View job
                    </DropdownMenuItem>
                    {j.status === "Awaiting approval" && (
                      <DropdownMenuItem className="cursor-pointer py-2" render={<Link href={`/apply/${j.jobId}`} />}>
                        <FileText /> Review documents
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="cursor-pointer py-2"
                      onClick={() =>
                        setItems((all) => all.map((x) => (x.id === j.id ? { ...x, saved: !x.saved } : x)))
                      }
                    >
                      <Bookmark /> {j.saved ? "Remove from saved" : "Save job"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      className="cursor-pointer py-2"
                      onClick={() => setItems((all) => all.filter((x) => x.id !== j.id))}
                    >
                      <Trash2 /> Stop tracking
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ))}
          </ul>
        )}

        {rows.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>
                Showing {start + 1}-{Math.min(start + pageSize, rows.length)} of {rows.length}
              </span>
              <div className="flex items-center gap-2">
                <span>Rows per page</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(v) => {
                    setPageSize(Number(v))
                    setPage(1)
                  }}
                >
                  <SelectTrigger size="sm" className="w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="p-1.5">
                    {[5, 10, 20].map((n) => (
                      <SelectItem key={n} value={String(n)} className="rounded-md px-2.5 py-2">
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    aria-disabled={current === 1}
                    className={cn(current === 1 && "pointer-events-none opacity-50")}
                    onClick={(e) => {
                      e.preventDefault()
                      setPage(Math.max(1, current - 1))
                    }}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === current}
                      className={cn(
                        p === current &&
                          "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                      )}
                      onClick={(e) => {
                        e.preventDefault()
                        setPage(p)
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    aria-disabled={current === totalPages}
                    className={cn(current === totalPages && "pointer-events-none opacity-50")}
                    onClick={(e) => {
                      e.preventDefault()
                      setPage(Math.min(totalPages, current + 1))
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
