"use client"

import { KeyRound, Mail, ShieldCheck, UserCog, UserX } from "lucide-react"

import { CandidateCell } from "@/components/admin/candidate-cell"
import { DataTable, type Column } from "@/components/admin/data-table"
import { RowActions } from "@/components/admin/row-actions"
import { Badge } from "@/components/ui/badge"
import { users } from "@/lib/mock-data"

type User = (typeof users)[number]

const columns: Column<User>[] = [
  {
    key: "name",
    label: "Name",
    sortValue: (u) => u.name.toLowerCase(),
    cell: (u) => <CandidateCell name={u.name} subtitle={u.email} />,
  },
  {
    key: "role",
    label: "Role",
    sortValue: (u) => u.role,
    cell: (u) => <Badge variant="secondary">{u.role}</Badge>,
  },
  {
    key: "twoFactor",
    label: "2FA",
    align: "center",
    sortValue: (u) => (u.twoFactor ? 1 : 0),
    cell: (u) => (u.twoFactor ? "On" : "Off"),
  },
  {
    key: "status",
    label: "Status",
    sortValue: (u) => u.status,
    cell: (u) => (
      <Badge variant={u.status === "Active" ? "outline" : "secondary"}>{u.status}</Badge>
    ),
  },
]

const filter = { label: "Role", allLabel: "All Roles", value: (u: User) => u.role }

export const UsersTable = () => (
  <DataTable
    data={users}
    columns={columns}
    getRowId={(u) => u.email}
    searchText={(u) => `${u.name} ${u.email} ${u.role} ${u.status}`}
    searchPlaceholder="Search by name, email or role"
    filter={filter}
    initialSort={{ key: "name", dir: "asc" }}
    noun={["user", "users"]}
    rowActions={(u) => (
      <RowActions
        title={u.name}
        actions={[
          { label: "Change role", icon: UserCog },
          { label: "Reset password", icon: KeyRound },
          { label: "Require 2FA", icon: ShieldCheck },
          { label: "Resend invite", icon: Mail },
          { label: "Disable user", icon: UserX, destructive: true },
        ]}
      />
    )}
  />
)
