import { LogsTable } from "@/components/admin/logs-table"
import { PageHeader } from "@/components/admin/page-header"

const LogsPage = () => {
  return (
    <>
      <PageHeader
        title="Logs"
        description="Every agent run with result, errors and retries."
      />
      <LogsTable />
    </>
  )
}

export default LogsPage
