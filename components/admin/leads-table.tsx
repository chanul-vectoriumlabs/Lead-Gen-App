"use client"

import { Building2, Copy, Eye, MailCheck, Trash2 } from "lucide-react"

import { CandidateCell } from "@/components/admin/candidate-cell"
import { DataTable, type Column } from "@/components/admin/data-table"
import { RowActions } from "@/components/admin/row-actions"
import { Badge } from "@/components/ui/badge"
import { leads } from "@/lib/mock-data"

type Lead = (typeof leads)[number]

const columns: Column<Lead>[] = [
  {
    key: "name",
    label: "Contact",
    sortValue: (l) => l.name.toLowerCase(),
    cell: (l) => <CandidateCell name={l.name} subtitle={l.role} />,
  },
  { key: "company", label: "Company", sortValue: (l) => l.company.toLowerCase(), cell: (l) => l.company },
  { key: "location", label: "Location", sortValue: (l) => l.location.toLowerCase(), cell: (l) => l.location },
  {
    key: "email",
    label: "Email",
    sortValue: (l) => l.email,
    cell: (l) => <Badge variant={l.email === "Verified" ? "secondary" : "outline"}>{l.email}</Badge>,
  },
  { key: "source", label: "Source", sortValue: (l) => l.source.toLowerCase(), cell: (l) => l.source },
  {
    key: "collected",
    label: "Collected",
    sortValue: (l) => l.collectedDays,
    cell: (l) => <span className="text-muted-foreground">{l.collected}</span>,
  },
]

const filter = { label: "Email", allLabel: "All Emails", value: (l: Lead) => l.email }

export const LeadsTable = () => (
  <DataTable
    data={leads}
    columns={columns}
    getRowId={(l) => l.id}
    searchText={(l) => `${l.name} ${l.role} ${l.company} ${l.location} ${l.source}`}
    searchPlaceholder="Search by name, role, company or location"
    filter={filter}
    initialSort={{ key: "collected", dir: "asc" }}
    noun={["lead", "leads"]}
    rowActions={(l) => (
      <RowActions
        title={l.name}
        actions={[
          { label: "View contact", icon: Eye },
          { label: "View company", icon: Building2 },
          { label: "Re-validate email", icon: MailCheck },
          { label: "Copy email", icon: Copy },
          { label: "Delete contact", icon: Trash2, destructive: true },
        ]}
      />
    )}
  />
)
