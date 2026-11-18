// Placeholder tracked jobs for the user's Job Tracker. Replace with the user's applications.

export const trackerStatuses = [
  "Drafting",
  "Awaiting approval",
  "Submitted",
  "Needs info",
  "Interview",
  "Offer",
  "Rejected",
  "Closed",
] as const

export type TrackerStatus = (typeof trackerStatuses)[number]

export type TrackedJob = {
  id: string
  // Job the application is for (job details page).
  jobId: string
  title: string
  company: string
  location: string
  status: TrackerStatus
  saved: boolean
  updated: string
  updatedMin: number
  followUp?: string
  viewedMin: number
}

export const trackedJobs: TrackedJob[] = [
  { id: "t1", jobId: "m1", title: "Senior Data Engineer", company: "Acme Corp", location: "Austin, hybrid", status: "Awaiting approval", saved: true, updated: "1 hour ago", updatedMin: 60, viewedMin: 20 },
  { id: "t2", jobId: "m6", title: "BI Engineer", company: "Globex", location: "Remote", status: "Interview", saved: false, updated: "2 days ago", updatedMin: 2880, followUp: "Interview on Nov 18", viewedMin: 300 },
  { id: "t3", jobId: "m1", title: "Data Engineer", company: "Orbit", location: "New York, hybrid", status: "Submitted", saved: false, updated: "3 days ago", updatedMin: 4320, followUp: "Follow up on Nov 20", viewedMin: 1500 },
  { id: "t4", jobId: "m2", title: "Data Platform Engineer", company: "Northwind", location: "Remote", status: "Drafting", saved: true, updated: "Today", updatedMin: 30, viewedMin: 10 },
  { id: "t5", jobId: "m3", title: "Analytics Engineer", company: "Brightly", location: "Austin", status: "Drafting", saved: true, updated: "Today", updatedMin: 45, viewedMin: 40 },
  { id: "t6", jobId: "m4", title: "Streaming Data Engineer", company: "Cloudnine", location: "Remote", status: "Needs info", saved: false, updated: "Yesterday", updatedMin: 1440, followUp: "Screening question waiting", viewedMin: 200 },
  { id: "t7", jobId: "m5", title: "ML Platform Engineer", company: "Globex", location: "Remote", status: "Rejected", saved: false, updated: "1 week ago", updatedMin: 10080, viewedMin: 9000 },
  { id: "t8", jobId: "m2", title: "Data Engineer II", company: "Pixelworks", location: "London", status: "Offer", saved: true, updated: "4 days ago", updatedMin: 5760, followUp: "Reply by Nov 21", viewedMin: 700 },
  { id: "t9", jobId: "m3", title: "Senior Analytics Engineer", company: "Northwind", location: "Remote", status: "Closed", saved: false, updated: "2 weeks ago", updatedMin: 20160, viewedMin: 15000 },
]
