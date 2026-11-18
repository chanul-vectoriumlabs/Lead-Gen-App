"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, FileCheck2, ListChecks, Mail, RotateCw, Trash2 } from "lucide-react"

import { CandidateCell } from "@/components/admin/candidate-cell"
import { DataTable, type Column } from "@/components/admin/data-table"
import { RowActions } from "@/components/admin/row-actions"
import { StageTracker } from "@/components/admin/stage-tracker"
import { Badge } from "@/components/ui/badge"
import { candidateList, type Candidate } from "@/lib/mock-data"

const doneCount = (c: Candidate) => c.stages.filter((s) => s === "done").length

const columns: Column<Candidate>[] = [
  {
    key: "name",
    label: "Candidate",
    sortValue: (c) => c.name.toLowerCase(),
    cell: (c) => (
      <Link href={`/admin/candidates/${c.id}`} className="block rounded-md hover:text-primary">
        <CandidateCell name={c.name} subtitle={c.title} />
      </Link>
    ),
  },
  {
    key: "location",
    label: "Location",
    sortValue: (c) => c.location.toLowerCase(),
    cell: (c) => c.location,
  },
  {
    key: "progress",
    label: "Progress",
    sortValue: doneCount,
    cell: (c) => (
      <div className="space-y-1.5">
        <StageTracker stages={c.stages} />
        <p className="text-xs text-muted-foreground">
          {doneCount(c)} of {c.stages.length} stages
        </p>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    sortValue: (c) => c.status.toLowerCase(),
    cell: (c) => <Badge variant={c.statusTone}>{c.status}</Badge>,
  },
  {
    key: "topJobs",
    label: "Top jobs",
    align: "center",
    sortValue: (c) => c.topJobs,
    cell: (c) => c.topJobs,
  },
  {
    key: "updated",
    label: "Updated",
    sortValue: (c) => c.updatedMin,
    cell: (c) => <span className="text-muted-foreground">{c.updated}</span>,
  },
]

const filter = {
  label: "Status",
  allLabel: "All Statuses",
  value: (c: Candidate) => c.status,
}

export const CandidatesTable = () => {
  const router = useRouter()
  return (
  <DataTable
    data={candidateList}
    columns={columns}
    getRowId={(c) => c.id}
    searchText={(c) => `${c.name} ${c.title} ${c.location} ${c.status}`}
    searchPlaceholder="Search by name, title, location or status"
    filter={filter}
    initialSort={{ key: "updated", dir: "asc" }}
    noun={["candidate", "candidates"]}
    rowActions={(c) => (
      <RowActions
        title={c.name}
        actions={[
          { label: "View profile", icon: Eye, onSelect: () => router.push(`/admin/candidates/${c.id}`) },
          { label: "Review criteria", icon: ListChecks },
          { label: "View ranked jobs", icon: FileCheck2 },
          { label: "Re-run search", icon: RotateCw },
          { label: "Email candidate", icon: Mail },
          { label: "Delete candidate", icon: Trash2, destructive: true },
        ]}
      />
    )}
  />
)
}
