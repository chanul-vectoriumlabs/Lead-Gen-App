import { CandidatesTable } from "@/components/admin/candidates-table"
import { PageHeader } from "@/components/admin/page-header"

const CandidatesPage = () => {
  return (
    <>
      <PageHeader
        title="Candidates"
        description="Review criteria and follow each candidate through the workflow."
      />
      <CandidatesTable />
    </>
  )
}

export default CandidatesPage
