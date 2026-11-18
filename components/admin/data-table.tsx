"use client"

import { useMemo, useState, type ReactNode } from "react"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Layers,
  ListFilter,
  Search,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export type Column<T> = {
  key: string
  label: string
  /** Provide to make the column sortable. */
  sortValue?: (row: T) => string | number
  cell: (row: T) => ReactNode
  className?: string
  align?: "left" | "center" | "right"
}

type SortDir = "asc" | "desc"

const alignClass = {
  left: "",
  center: "text-center",
  right: "text-right",
}

const itemClass = "cursor-pointer gap-2.5 rounded-md px-2.5 py-2"

const pageNumbers = (page: number, total: number) => {
  const pages: (number | "gap")[] = []
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || Math.abs(p - page) <= 1) pages.push(p)
    else if (pages[pages.length - 1] !== "gap") pages.push("gap")
  }
  return pages
}

export const DataTable = <T,>({
  data,
  columns,
  getRowId,
  searchText,
  searchPlaceholder = "Search",
  filter,
  initialSort,
  noun = ["row", "rows"],
  rowActions,
  pageSizes = [5, 10, 20],
}: {
  data: T[]
  columns: Column<T>[]
  getRowId: (row: T) => string
  searchText: (row: T) => string
  searchPlaceholder?: string
  filter?: { label: string; allLabel: string; value: (row: T) => string }
  initialSort?: { key: string; dir: SortDir }
  noun?: [string, string]
  rowActions?: (row: T) => ReactNode
  pageSizes?: number[]
}) => {
  const [query, setQuery] = useState("")
  const [filterValue, setFilterValue] = useState("all")
  const [sort, setSort] = useState<{ key: string; dir: SortDir } | null>(
    initialSort ?? null
  )
  const [pageSize, setPageSize] = useState(pageSizes[0])
  const [page, setPage] = useState(1)

  const filterOptions = useMemo(
    () =>
      filter ? Array.from(new Set(data.map(filter.value))).sort() : [],
    [data, filter]
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rows = data.filter(
      (r) =>
        (!filter || filterValue === "all" || filter.value(r) === filterValue) &&
        (!q || searchText(r).toLowerCase().includes(q))
    )
    const col = sort && columns.find((c) => c.key === sort.key)
    if (!col?.sortValue) return rows
    const get = col.sortValue
    return [...rows].sort((a, b) => {
      const av = get(a)
      const bv = get(b)
      const cmp = av < bv ? -1 : av > bv ? 1 : 0
      return sort!.dir === "asc" ? cmp : -cmp
    })
  }, [data, query, filter, filterValue, searchText, sort, columns])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const current = Math.min(page, totalPages)
  const start = (current - 1) * pageSize
  const rows = filtered.slice(start, start + pageSize)
  const colCount = columns.length + (rowActions ? 1 : 0)

  const toggleSort = (key: string) => {
    setSort((s) =>
      s?.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    )
    setPage(1)
  }

  const reset = () => {
    setQuery("")
    setFilterValue("all")
    setPage(1)
  }

  return (
    <Card className="border border-border">
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-foreground/60" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
              }}
              placeholder={searchPlaceholder}
              className="h-9 bg-background pl-8"
            />
          </div>

          {filter && (
            <Select
              value={filterValue}
              items={[
                { value: "all", label: filter.allLabel },
                ...filterOptions.map((o) => ({ value: o, label: o })),
              ]}
              onValueChange={(v) => {
                setFilterValue(v ?? "all")
                setPage(1)
              }}
            >
              <SelectTrigger className="w-56 cursor-pointer gap-2">
                <ListFilter className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">{filter.label}</span>
                <SelectValue className="font-medium" />
              </SelectTrigger>
              <SelectContent
                align="start"
                alignItemWithTrigger={false}
                className="w-(--anchor-width) min-w-0 p-1.5"
              >
                <SelectGroup>
                  <SelectLabel className="px-2.5 pt-1.5 pb-1 text-[11px] font-semibold tracking-wider uppercase">
                    Filter by {filter.label.toLowerCase()}
                  </SelectLabel>
                  <SelectItem value="all" className={itemClass}>
                    <Layers className="size-4 text-muted-foreground" />
                    {filter.allLabel}
                  </SelectItem>
                </SelectGroup>
                <SelectSeparator className="my-1.5" />
                <SelectGroup className="flex flex-col gap-0.5">
                  {filterOptions.map((o) => (
                    <SelectItem key={o} value={o} className={itemClass}>
                      <span className="size-2 shrink-0 self-center rounded-full bg-primary/60" />
                      {o}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}

          {(query || filterValue !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer text-muted-foreground"
              onClick={reset}
            >
              <X /> Reset
            </Button>
          )}

          <p className="ml-auto text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? noun[0] : noun[1]}
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                {columns.map((col) => {
                  const align = alignClass[col.align ?? "left"]
                  if (!col.sortValue) {
                    return (
                      <TableHead
                        key={col.key}
                        className={cn(
                          "h-10 text-xs font-semibold tracking-wide text-muted-foreground uppercase",
                          align,
                          col.className
                        )}
                      >
                        {col.label}
                      </TableHead>
                    )
                  }
                  const active = sort?.key === col.key
                  const Icon = !active
                    ? ArrowUpDown
                    : sort.dir === "asc"
                      ? ArrowUp
                      : ArrowDown
                  return (
                    <TableHead
                      key={col.key}
                      className={cn("h-10", align, col.className)}
                      aria-sort={
                        active
                          ? sort.dir === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-8 cursor-pointer text-xs font-semibold tracking-wide uppercase",
                          col.align === "center" ? "mx-auto" : "-ml-2",
                          active ? "text-foreground" : "text-muted-foreground"
                        )}
                        onClick={() => toggleSort(col.key)}
                      >
                        {col.label}
                        <Icon className={cn("size-3.5", !active && "opacity-50")} />
                      </Button>
                    </TableHead>
                  )
                })}
                {rowActions && (
                  <TableHead className="w-12">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={colCount}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No {noun[1]} match your search.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={getRowId(r)}>
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={cn("py-3", alignClass[col.align ?? "left"], col.className)}
                      >
                        {col.cell(r)}
                      </TableCell>
                    ))}
                    {rowActions && (
                      <TableCell className="text-right">{rowActions(r)}</TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>
              {filtered.length === 0
                ? "0 results"
                : `Showing ${start + 1}-${Math.min(start + pageSize, filtered.length)} of ${filtered.length}`}
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
                <SelectTrigger size="sm" className="w-16 cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="p-1.5">
                  {pageSizes.map((n) => (
                    <SelectItem key={n} value={String(n)} className={itemClass}>
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
                  className={cn(
                    "cursor-pointer",
                    current === 1 && "pointer-events-none opacity-50"
                  )}
                  aria-disabled={current === 1}
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(Math.max(1, current - 1))
                  }}
                />
              </PaginationItem>
              {pageNumbers(current, totalPages).map((p, i) =>
                p === "gap" ? (
                  <PaginationItem key={"gap" + i}>
                    <span className="px-1 text-muted-foreground">...</span>
                  </PaginationItem>
                ) : (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      className={cn(
                        "cursor-pointer",
                        p === current &&
                          "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                      )}
                      isActive={p === current}
                      onClick={(e) => {
                        e.preventDefault()
                        setPage(p)
                      }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  className={cn(
                    "cursor-pointer",
                    current === totalPages && "pointer-events-none opacity-50"
                  )}
                  aria-disabled={current === totalPages}
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(Math.min(totalPages, current + 1))
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  )
}
