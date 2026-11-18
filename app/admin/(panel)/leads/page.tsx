import { LeadsTable } from "@/components/admin/leads-table"
import { PageHeader } from "@/components/admin/page-header"

const LeadsPage = () => {
  return (
    <>
      <PageHeader
        title="Recruiter leads"
        description="Compliant recruiter and HR contacts linked to companies and top jobs."
      />
      <LeadsTable />
    </>
  )
}

export default LeadsPage
