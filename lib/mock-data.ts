// Placeholder data for the admin panel UI. Replace with API calls later.

export const STAGES = [
  "CV",
  "Criteria",
  "Search",
  "Rank",
  "Select",
] as const

export type StageState = "done" | "waiting" | "failed" | "pending"

export type Candidate = {
  id: string
  name: string
  title: string
  location: string
  stages: StageState[]
  status: string
  statusTone: "default" | "secondary" | "destructive" | "outline"
  topJobs: number
  updated: string
  updatedMin: number
}

// Only the first 5 characters are used (one per stage).
const s = (code: string): StageState[] =>
  code.slice(0, STAGES.length).split("").map((c) =>
    c === "d" ? "done" : c === "w" ? "waiting" : c === "f" ? "failed" : "pending"
  )

export const candidates: Candidate[] = [
  { id: "priya-s", name: "Priya S.", title: "Senior Data Engineer", location: "Austin or remote", stages: s("ddddw---"), status: "Select jobs", statusTone: "default", topJobs: 6, updated: "10 min ago", updatedMin: 10 },
  { id: "marcus-t", name: "Marcus T.", title: "Product Manager", location: "Remote", stages: s("ddddddw-"), status: "Jobs selected", statusTone: "outline", topJobs: 5, updated: "1 hour ago", updatedMin: 60 },
  { id: "elena-r", name: "Elena R.", title: "UX Designer", location: "London", stages: s("ddddd---"), status: "Jobs selected", statusTone: "outline", topJobs: 5, updated: "just now", updatedMin: 0 },
  { id: "sam-k", name: "Sam K.", title: "DevOps Engineer", location: "Berlin or remote", stages: s("ddf-----"), status: "Source failed", statusTone: "destructive", topJobs: 0, updated: "25 min ago", updatedMin: 25 },
  { id: "aisha-m", name: "Aisha M.", title: "Data Analyst", location: "Toronto", stages: s("dddddddd"), status: "Jobs selected", statusTone: "outline", topJobs: 8, updated: "Yesterday", updatedMin: 1440 },
]

const more = (
  id: string, name: string, title: string, location: string, code: string,
  status: string, statusTone: Candidate["statusTone"], topJobs: number, updated: string, updatedMin: number
): Candidate => ({ id, name, title, location, stages: s(code), status, statusTone, topJobs, updated, updatedMin })

export const candidateList: Candidate[] = [
  ...candidates,
  more("leo-b", "Leo B.", "Backend Engineer", "Remote", "dd------", "Ready to search", "secondary", 0, "2 hours ago", 120),
  more("nina-p", "Nina P.", "Marketing Manager", "New York", "dddddddd", "Jobs selected", "outline", 7, "2 days ago", 2880),
  more("omar-h", "Omar H.", "Data Scientist", "Dubai or remote", "ddddw---", "Select jobs", "default", 5, "3 hours ago", 180),
  more("grace-l", "Grace L.", "Product Designer", "Singapore", "dddddd--", "Jobs selected", "outline", 6, "4 hours ago", 240),
  more("ivan-d", "Ivan D.", "QA Engineer", "Warsaw", "dddf----", "Ranking failed", "destructive", 0, "5 hours ago", 300),
  more("tara-w", "Tara W.", "HR Business Partner", "Sydney", "ddddddw-", "Jobs selected", "outline", 5, "6 hours ago", 360),
  more("hugo-m", "Hugo M.", "Frontend Engineer", "Lisbon or remote", "ddddd---", "Jobs selected", "outline", 5, "7 hours ago", 420),
  more("zoe-c", "Zoe C.", "Customer Success Lead", "Dublin", "dddddddd", "Jobs selected", "outline", 9, "3 days ago", 4320),
  more("raj-k", "Raj K.", "Cloud Architect", "Bangalore", "dddddddd", "Jobs selected", "outline", 8, "4 days ago", 5760),
  more("mia-f", "Mia F.", "Business Analyst", "Chicago", "ddd-----", "Ranking jobs", "secondary", 0, "1 day ago", 1500),
  more("noah-g", "Noah G.", "Software Engineer", "Remote", "w-------", "Awaiting CV", "default", 0, "5 min ago", 5),
  more("lena-v", "Lena V.", "Marketing Analyst", "Berlin", "dw------", "Review criteria", "default", 0, "40 min ago", 40),
]

export const kpis = [
  { label: "Candidates in progress", value: "12" },
  { label: "Jobs found", value: "248" },
  { label: "Recruiter leads", value: "96" },
  { label: "Awaiting job selection", value: "3" },
  { label: "Awaiting approval", value: "4" },
  { label: "Applications submitted", value: "18" },
]

export const actionQueue = [
  { label: "Select jobs", who: "Priya S.", href: "/admin/candidates/priya-s", cta: "Open" },
  { label: "Review criteria", who: "Lena V.", href: "/admin/candidates/lena-v", cta: "Open" },
  { label: "Run search", who: "Leo B.", href: "/admin/candidates/leo-b", cta: "Open" },
]

export const workflowHealth = { running: 7, waiting: 4, failed: 1 }

export const recentActivity = [
  { time: "10:42", text: "Ranking finished: Elena R." },
  { time: "10:31", text: "9 recruiter contacts linked: Priya S." },
  { time: "10:12", text: "Email sent: top jobs ready for Priya S." },
  { time: "09:58", text: "CV extracted: Leo B." },
]

export const users = [
  { name: "Admin User", email: "admin@example.com", role: "Admin", twoFactor: true, status: "Active" },
  { name: "R. Silva", email: "r.silva@example.com", role: "Recruiter", twoFactor: true, status: "Active" },
  { name: "J. Park", email: "j.park@example.com", role: "Viewer", twoFactor: false, status: "Active" },
  { name: "Priya S.", email: "priya@example.com", role: "Candidate", twoFactor: false, status: "Invited" },
]

export const sources = [
  { id: "ats", name: "Employer job boards", detail: "Greenhouse, Lever, Ashby, Workable, SmartRecruiters", sync: "Daily", enabled: true, note: "" },
  { id: "usajobs", name: "USAJOBS", detail: "US federal roles", sync: "Daily", enabled: true, note: "" },
  { id: "licensed", name: "Licensed job-data provider", detail: "Adzuna or similar", sync: "Daily", enabled: false, note: "Licence pending" },
  { id: "named", name: "Named job boards", detail: "LinkedIn, Indeed, Glassdoor, ZipRecruiter", sync: "-", enabled: false, note: "Needs written authorization" },
]

export const jobs = [
  { id: "j1", title: "Senior Data Engineer", company: "Acme Corp", location: "Austin, hybrid", salary: "$145k-$165k", source: "Greenhouse", status: "Open", seen: "3 days ago", seenDays: 3 },
  { id: "j2", title: "Data Platform Engineer", company: "Northwind", location: "Remote", salary: "Not listed", source: "Lever", status: "Open", seen: "5 days ago", seenDays: 5 },
  { id: "j3", title: "Analytics Engineer", company: "Brightly", location: "Austin", salary: "$120k-$140k", source: "Ashby", status: "Open", seen: "1 week ago", seenDays: 7 },
  { id: "j4", title: "ML Engineer", company: "Globex", location: "Remote", salary: "$150k-$180k", source: "USAJOBS", status: "Closed", seen: "2 weeks ago", seenDays: 14 },
  { id: "j5", title: "Product Manager", company: "Orbit", location: "Remote", salary: "$130k-$150k", source: "Greenhouse", status: "Open", seen: "Today", seenDays: 0 },
  { id: "j6", title: "UX Designer", company: "Pixelworks", location: "London", salary: "Not listed", source: "Workable", status: "Open", seen: "2 days ago", seenDays: 2 },
  { id: "j7", title: "DevOps Engineer", company: "Cloudnine", location: "Berlin", salary: "EUR 80k-95k", source: "SmartRecruiters", status: "Open", seen: "4 days ago", seenDays: 4 },
  { id: "j8", title: "Data Analyst", company: "Brightly", location: "Toronto", salary: "CAD 85k-100k", source: "Lever", status: "Closed", seen: "3 weeks ago", seenDays: 21 },
  { id: "j9", title: "BI Analyst", company: "Northwind", location: "Remote", salary: "$95k-$115k", source: "Ashby", status: "Open", seen: "6 days ago", seenDays: 6 },
  { id: "j10", title: "Backend Engineer", company: "Acme Corp", location: "Remote", salary: "$140k-$160k", source: "Greenhouse", status: "Open", seen: "Yesterday", seenDays: 1 },
  { id: "j11", title: "Cloud Architect", company: "Globex", location: "Bangalore", salary: "Not listed", source: "Workable", status: "Open", seen: "1 week ago", seenDays: 7 },
  { id: "j12", title: "QA Engineer", company: "Cloudnine", location: "Warsaw", salary: "PLN 18k-24k", source: "SmartRecruiters", status: "Closed", seen: "2 weeks ago", seenDays: 14 },
]

export const leads = [
  { id: "l1", name: "J. Lee", role: "Talent Acquisition", company: "Acme Corp", location: "Austin", email: "Verified", source: "Licensed provider", collected: "Today", collectedDays: 0 },
  { id: "l2", name: "M. Ortiz", role: "HR Partner", company: "Northwind", location: "Remote", email: "Verified", source: "Company site", collected: "Yesterday", collectedDays: 1 },
  { id: "l3", name: "D. Chen", role: "Hiring Manager", company: "Brightly", location: "Austin", email: "Unverified", source: "Job posting", collected: "3 days ago", collectedDays: 3 },
  { id: "l4", name: "S. Patel", role: "Recruiter", company: "Orbit", location: "Remote", email: "Verified", source: "Licensed provider", collected: "Today", collectedDays: 0 },
  { id: "l5", name: "A. Novak", role: "Talent Partner", company: "Cloudnine", location: "Berlin", email: "Verified", source: "Company site", collected: "2 days ago", collectedDays: 2 },
  { id: "l6", name: "K. Brown", role: "Head of People", company: "Pixelworks", location: "London", email: "Unverified", source: "Job posting", collected: "4 days ago", collectedDays: 4 },
  { id: "l7", name: "T. Rossi", role: "Hiring Manager", company: "Globex", location: "Remote", email: "Verified", source: "Licensed provider", collected: "1 week ago", collectedDays: 7 },
  { id: "l8", name: "R. Gupta", role: "Recruiter", company: "Globex", location: "Bangalore", email: "Verified", source: "Licensed provider", collected: "5 days ago", collectedDays: 5 },
]

export const applications = [
  { id: "a1", candidate: "Marcus T.", job: "Product Manager, Orbit", status: "Awaiting approval", updated: "1 hour ago", updatedMin: 60 },
  { id: "a2", candidate: "Priya S.", job: "Senior Data Engineer, Acme Corp", status: "Drafted", updated: "2 hours ago", updatedMin: 120 },
  { id: "a3", candidate: "Aisha M.", job: "Data Analyst, Brightly", status: "Submitted", updated: "Yesterday", updatedMin: 1440 },
  { id: "a4", candidate: "Aisha M.", job: "BI Analyst, Northwind", status: "Interview", updated: "2 days ago", updatedMin: 2880 },
  { id: "a5", candidate: "Tara W.", job: "HR Business Partner, Pixelworks", status: "Awaiting approval", updated: "6 hours ago", updatedMin: 360 },
  { id: "a6", candidate: "Nina P.", job: "Marketing Manager, Orbit", status: "Submitted", updated: "2 days ago", updatedMin: 2880 },
  { id: "a7", candidate: "Raj K.", job: "Cloud Architect, Globex", status: "Interview", updated: "4 days ago", updatedMin: 5760 },
  { id: "a8", candidate: "Zoe C.", job: "Customer Success Lead, Northwind", status: "Offer", updated: "3 days ago", updatedMin: 4320 },
  { id: "a9", candidate: "Grace L.", job: "Product Designer, Pixelworks", status: "Drafted", updated: "4 hours ago", updatedMin: 240 },
  { id: "a10", candidate: "Raj K.", job: "Solutions Architect, Cloudnine", status: "Rejected", updated: "1 week ago", updatedMin: 10080 },
]

export const logs = [
  { id: "g1", time: "10:42", agent: "Job Matching", candidate: "Elena R.", step: "Rank jobs", result: "Success", retries: 0 },
  { id: "g2", time: "10:31", agent: "Recruiter Research", candidate: "Priya S.", step: "Find contacts", result: "Success", retries: 0 },
  { id: "g3", time: "10:20", agent: "Job Search", candidate: "Sam K.", step: "Fetch jobs", result: "Failed", retries: 3 },
  { id: "g4", time: "10:12", agent: "Notification", candidate: "Priya S.", step: "Email top jobs", result: "Success", retries: 0 },
  { id: "g5", time: "09:58", agent: "CV Extraction", candidate: "Leo B.", step: "Extract profile", result: "Success", retries: 1 },
  { id: "g6", time: "09:40", agent: "Application", candidate: "Marcus T.", step: "Draft documents", result: "Success", retries: 0 },
  { id: "g7", time: "09:22", agent: "Job Search", candidate: "Ivan D.", step: "Fetch jobs", result: "Failed", retries: 3 },
  { id: "g8", time: "09:05", agent: "Reporting", candidate: "-", step: "Daily summary", result: "Success", retries: 0 },
  { id: "g9", time: "08:51", agent: "Job Matching", candidate: "Omar H.", step: "Rank jobs", result: "Success", retries: 0 },
  { id: "g10", time: "08:30", agent: "Recruiter Research", candidate: "Hugo M.", step: "Find contacts", result: "Retrying", retries: 1 },
  { id: "g11", time: "08:12", agent: "CV Extraction", candidate: "Mia F.", step: "Extract profile", result: "Success", retries: 0 },
]

export const navItems = [
  { title: "Overview", href: "/admin", icon: "layout" },
  { title: "Candidates", href: "/admin/candidates", icon: "users" },
  { title: "Jobs", href: "/admin/jobs", icon: "briefcase" },
  { title: "Recruiter leads", href: "/admin/leads", icon: "contact" },
  { title: "Applications", href: "/admin/applications", icon: "file" },
  { title: "Analytics", href: "/admin/analytics", icon: "chart" },
  { title: "Settings", href: "/admin/settings", icon: "settings" },
  { title: "Logs", href: "/admin/logs", icon: "scroll" },
] as const

export const notifications = [
  { id: "n1", title: "Top jobs ready", body: "6 jobs ranked for Priya S. Review and select jobs.", time: "10 min ago", unread: true, tone: "default" },
  { id: "n2", title: "Approval needed", body: "Resume and cover letter for Marcus T. are ready.", time: "1 hour ago", unread: true, tone: "default" },
  { id: "n3", title: "Source sync failed", body: "Fetch jobs failed for Sam K. and is retrying (2/3).", time: "25 min ago", unread: true, tone: "destructive" },
  { id: "n4", title: "Application submitted", body: "Aisha M. applied to Data Analyst, Brightly.", time: "Yesterday", unread: false, tone: "default" },
] as const
