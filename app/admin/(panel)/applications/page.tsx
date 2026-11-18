import { ApplicationsTable } from "@/components/admin/applications-table"
import { PageHeader } from "@/components/admin/page-header"

const ApplicationsPage = () => {
  return (
    <>
      <PageHeader
        title="Applications"
        description="Drafts awaiting approval, submitted applications, status and follow-ups."
      />
      <ApplicationsTable />
    </>
  )
}

export default ApplicationsPage
