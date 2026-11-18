import { JobsTable } from "@/components/admin/jobs-table"
import { PageHeader } from "@/components/admin/page-header"

const JobsPage = () => {
  return (
    <>
      <PageHeader
        title="Jobs"
        description="All jobs in the database, with their source and linked candidates."
      />
      <JobsTable />
    </>
  )
}

export default JobsPage
