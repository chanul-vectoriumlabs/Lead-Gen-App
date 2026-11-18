"use client"

import { BellRing, CheckCircle2, Eye, History, XCircle } from "lucide-react"

import { CandidateCell } from "@/components/admin/candidate-cell"
import { DataTable, type Column } from "@/components/admin/data-table"
import { RowActions } from "@/components/admin/row-actions"
import { Badge } from "@/components/ui/badge"
import { applications } from "@/lib/mock-data"

type Application = (typeof applications)[number]

const tone = (s: string) =>
  s === "Awaiting approval"
    ? "default"
    : s === "Rejected"
      ? "destructive"
      : s === "Offer" || s === "Interview"
        ? "outline"
        : "secondary"

const columns: Column<Application>[] = [
  {
    key: "candidate",
    label: "Candidate",
    sortValue: (a) => a.candidate.toLowerCase(),
    cell: (a) => <CandidateCell name={a.candidate} />,
  },
  { key: "job", label: "Job", sortValue: (a) => a.job.toLowerCase(), cell: (a) => a.job },
  {
    key: "status",
    label: "Status",
    sortValue: (a) => a.status,
    cell: (a) => <Badge variant={tone(a.status)}>{a.status}</Badge>,
  },
  {
    key: "updated",
    label: "Updated",
    sortValue: (a) => a.updatedMin,
    cell: (a) => <span className="text-muted-foreground">{a.updated}</span>,
  },
]

const filter = { label: "Status", allLabel: "All Statuses", value: (a: Application) => a.status }

export const ApplicationsTable = () => (
  <DataTable
    data={applications}
    columns={columns}
    getRowId={(a) => a.id}
    searchText={(a) => `${a.candidate} ${a.job} ${a.status}`}
    searchPlaceholder="Search by candidate, job or status"
    filter={filter}
    initialSort={{ key: "updated", dir: "asc" }}
    noun={["application", "applications"]}
    rowActions={(a) => (
      <RowActions
        title={`${a.candidate}: ${a.job}`}
        actions={[
          { label: "Review documents", icon: Eye },
          { label: "Approve", icon: CheckCircle2 },
          { label: "Status history", icon: History },
          { label: "Set follow-up reminder", icon: BellRing },
          { label: "Withdraw application", icon: XCircle, destructive: true },
        ]}
      />
    )}
  />
)
