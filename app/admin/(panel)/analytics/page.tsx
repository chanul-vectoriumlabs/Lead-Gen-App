import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"
import { PageHeader } from "@/components/admin/page-header"

const AnalyticsPage = () => {
  return (
    <>
      <PageHeader
        title="Analytics"
        description="Daily, weekly and monthly trends across jobs, applications and companies."
      />
      <AnalyticsDashboard />
    </>
  )
}

export default AnalyticsPage
