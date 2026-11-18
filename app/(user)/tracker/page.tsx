import type { Metadata } from "next"

import { JobTracker } from "@/components/user/job-tracker"

export const metadata: Metadata = {
  title: "Job tracker | JobPilot",
}

const TrackerPage = () => (
  <div className="mx-auto w-full max-w-6xl">
    <JobTracker />
  </div>
)

export default TrackerPage
