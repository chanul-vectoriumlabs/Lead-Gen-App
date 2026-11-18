import { PageHeader } from "@/components/admin/page-header"
import { SettingsTabs } from "@/components/admin/settings-tabs"

const SettingsPage = () => {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Users, sources, search behavior and notifications."
      />
      <SettingsTabs />
    </>
  )
}

export default SettingsPage
