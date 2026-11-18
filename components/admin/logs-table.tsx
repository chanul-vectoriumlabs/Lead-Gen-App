"use client"

import { Copy, ExternalLink, Eye, RotateCw } from "lucide-react"

import { DataTable, type Column } from "@/components/admin/data-table"
import { RowActions } from "@/components/admin/row-actions"
import { Badge } from "@/components/ui/badge"
import { logs } from "@/lib/mock-data"

type Log = (typeof logs)[number]

const tone = (r: string) =>
  r === "Failed" ? "destructive" : r === "Retrying" ? "outline" : "secondary"

const columns: Column<Log>[] = [
  {
    key: "time",
    label: "Time",
    sortValue: (l) => l.time,
    cell: (l) => <span className="tabular-nums text-muted-foreground">{l.time}</span>,
  },
  {
    key: "agent",
    label: "Agent",
    sortValue: (l) => l.agent.toLowerCase(),
    cell: (l) => <span className="font-medium">{l.agent}</span>,
  },
  { key: "candidate", label: "Candidate", sortValue: (l) => l.candidate.toLowerCase(), cell: (l) => l.candidate },
  { key: "step", label: "Step", sortValue: (l) => l.step.toLowerCase(), cell: (l) => l.step },
  {
    key: "result",
    label: "Result",
    sortValue: (l) => l.result,
    cell: (l) => <Badge variant={tone(l.result)}>{l.result}</Badge>,
  },
  {
    key: "retries",
    label: "Retries",
    align: "center",
    sortValue: (l) => l.retries,
    cell: (l) => l.retries,
  },
]

const filter = { label: "Result", allLabel: "All Results", value: (l: Log) => l.result }

export const LogsTable = () => (
  <DataTable
    data={logs}
    columns={columns}
    getRowId={(l) => l.id}
    searchText={(l) => `${l.agent} ${l.candidate} ${l.step} ${l.result}`}
    searchPlaceholder="Search by agent, candidate or step"
    filter={filter}
    initialSort={{ key: "time", dir: "desc" }}
    noun={["run", "runs"]}
    rowActions={(l) => (
      <RowActions
        title={`${l.agent}: ${l.step}`}
        actions={[
          { label: "View run details", icon: Eye },
          ...(l.result !== "Success" ? [{ label: "Re-run step", icon: RotateCw }] : []),
          { label: "Open in Temporal", icon: ExternalLink },
          { label: "Copy run ID", icon: Copy },
        ]}
      />
    )}
  />
)
