// Placeholder candidate details for the admin candidate page.
// Replace with the candidate record, audit log and session data from the API.

import { STAGES, type Candidate } from "@/lib/mock-data"

export type EventKind = "user" | "agent" | "system" | "admin"

export type TimelineEvent = {
  id: string
  kind: EventKind
  title: string
  detail: string
  time: string
  status?: "success" | "waiting" | "failed"
}

const SKILLS: Record<string, string[]> = {
  engineer: ["Python", "AWS", "Spark", "SQL", "Airflow", "dbt", "Docker", "Terraform"],
  manager: ["Roadmapping", "Discovery", "Analytics", "SQL", "Stakeholder management", "Jira"],
  designer: ["Figma", "User research", "Prototyping", "Design systems", "Accessibility"],
  analyst: ["SQL", "Excel", "Tableau", "Python", "Statistics", "Looker"],
  default: ["Communication", "Problem solving", "Project delivery", "Collaboration"],
}

const skillsFor = (title: string) => {
  const t = title.toLowerCase()
  if (t.includes("engineer") || t.includes("architect") || t.includes("devops")) return SKILLS.engineer
  if (t.includes("manager") || t.includes("partner")) return SKILLS.manager
  if (t.includes("designer")) return SKILLS.designer
  if (t.includes("analyst") || t.includes("scientist")) return SKILLS.analyst
  return SKILLS.default
}

const MAX_TOP_JOBS = 20

const unique = (xs: string[]) => [...new Set(xs)]

export type Keywords = {
  titles: string[]
  skills: string[]
  countries: string[]
  workTypes: string[]
  seniority: string[]
  exclude: string[]
}

/** Countries the job search can cover. */
export const COUNTRIES = [
  "Australia",
  "Canada",
  "France",
  "Germany",
  "India",
  "Ireland",
  "Netherlands",
  "Poland",
  "Portugal",
  "Singapore",
  "Spain",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
]

export const WORK_TYPES = ["Remote", "On-site", "Hybrid"]

export const SENIORITY_LEVELS = ["Intern", "Entry level", "Junior", "Mid level", "Senior", "Lead", "Staff", "Principal", "Manager", "Director"]

// City in a candidate's location -> country.
const CITY_COUNTRY: Record<string, string> = {
  austin: "United States",
  "new york": "United States",
  chicago: "United States",
  toronto: "Canada",
  london: "United Kingdom",
  dublin: "Ireland",
  berlin: "Germany",
  warsaw: "Poland",
  lisbon: "Portugal",
  bangalore: "India",
  dubai: "United Arab Emirates",
  singapore: "Singapore",
  sydney: "Australia",
}

const quote = (s: string) => (s.includes(" ") ? `"${s}"` : s)

/** The job search query built from the processed keywords. */
export const buildKeywordQuery = (k: Keywords) =>
  [
    k.titles.length ? `(${k.titles.map(quote).join(" OR ")})` : null,
    k.skills.length ? `(${k.skills.map(quote).join(" OR ")})` : null,
    k.countries.length ? `country:(${k.countries.map(quote).join(" OR ")})` : null,
    k.workTypes.length ? `workplace:(${k.workTypes.map(quote).join(" OR ")})` : null,
    k.seniority.length ? `level:(${k.seniority.map(quote).join(" OR ")})` : null,
    k.exclude.length ? `NOT (${k.exclude.map(quote).join(" OR ")})` : null,
  ]
    .filter(Boolean)
    .join(" AND ")
    .replace(" AND NOT", " NOT")

const RELATED_TITLES: Record<string, string[]> = {
  "Data Engineer": ["Data Platform Engineer", "Analytics Engineer"],
  "Product Manager": ["Product Owner", "Technical Product Manager"],
  "UX Designer": ["Product Designer", "UI/UX Designer"],
  "Product Designer": ["UX Designer", "UI/UX Designer"],
  "DevOps Engineer": ["Site Reliability Engineer", "Platform Engineer"],
  "Data Analyst": ["Business Intelligence Analyst", "Analytics Specialist"],
  "Data Scientist": ["Machine Learning Engineer", "Applied Scientist"],
  "Backend Engineer": ["Software Engineer", "API Engineer"],
  "Frontend Engineer": ["UI Engineer", "Software Engineer"],
  "QA Engineer": ["Test Automation Engineer", "SDET"],
  "Cloud Architect": ["Solutions Architect", "Cloud Engineer"],
}


const COMPANIES =["Acme Corp", "Northwind", "Brightly", "Globex", "Orbit", "Cloudnine", "Pixelworks"]

const hash = (s: string) => [...s].reduce((n, ch) => (n * 31 + ch.charCodeAt(0)) % 9973, 7)

// One event per completed stage, newest first.
const STAGE_EVENTS: Record<string, { kind: EventKind; title: string; detail: (c: Candidate) => string }> = {
  CV: { kind: "user", title: "CV uploaded", detail: (c) => `${c.name.split(" ")[0]}_CV.pdf, profile extracted by the CV Extraction Agent` },
  Criteria: { kind: "user", title: "Search criteria confirmed", detail: (c) => `Target: ${c.title}, ${c.location}` },
  Search: { kind: "agent", title: "Job search completed", detail: () => "24 jobs found, 11 kept after pre-filtering, 3 duplicates removed" },
  Rank: { kind: "agent", title: "Jobs ranked against the CV", detail: (c) => `Top ${Math.max(c.topJobs, 5)} jobs kept, best score 91/100` },
  Select: { kind: "user", title: "Jobs selected to pursue", detail: () => "3 jobs selected, 3 kept for later" },
}

const AGO = ["2 min ago", "25 min ago", "1 hour ago", "3 hours ago", "Yesterday, 4:12 PM", "Yesterday, 10:05 AM", "2 days ago", "3 days ago", "4 days ago", "5 days ago"]

const SOURCES = ["Greenhouse", "Lever", "Ashby", "Workable", "SmartRecruiters"]
const POSTED = ["Today", "Yesterday", "2 days ago", "4 days ago", "1 week ago"]

export const getCandidateDetail = (c: Candidate) => {
  const h = hash(c.id)
  const first = c.name.split(" ")[0].toLowerCase()
  const skills = skillsFor(c.title)
  const done = c.stages.filter((s) => s === "done").length
  const failedAt = c.stages.indexOf("failed")
  const waitingAt = c.stages.indexOf("waiting")

  // Timeline: stage events + supporting user/system/admin events.
  const events: TimelineEvent[] = []
  if (failedAt >= 0) {
    events.push({
      id: "fail",
      kind: "agent",
      title: `${STAGES[failedAt]} step failed`,
      detail: "Source sync timed out. Retrying automatically (attempt 2 of 3).",
      time: AGO[0],
      status: "failed",
    })
  }
  if (waitingAt >= 0) {
    events.push({
      id: "wait",
      kind: "system",
      title: `Waiting for the candidate: ${STAGES[waitingAt]}`,
      detail: "Email reminder sent. No response yet.",
      time: AGO[1],
      status: "waiting",
    })
  }
  events.push({ id: "login", kind: "user", title: "Signed in", detail: "Chrome on macOS, Austin, US", time: AGO[2] })
  STAGES.slice(0, done)
    .slice()
    .reverse()
    .forEach((stage, i) => {
      const e = STAGE_EVENTS[stage]
      events.push({ id: `st-${stage}`, kind: e.kind, title: e.title, detail: e.detail(c), time: AGO[Math.min(3 + i, AGO.length - 1)], status: "success" })
      if (stage === "Rank") {
        events.push({ id: "mail-ready", kind: "system", title: "Email sent: top jobs ready", detail: `To ${first}@example.com`, time: AGO[Math.min(3 + i, AGO.length - 1)] })
      }
    })
  events.push({ id: "admin-note", kind: "admin", title: "Account reviewed by admin", detail: "Admin User checked the extracted profile", time: AGO[AGO.length - 1] })
  events.push({ id: "signup", kind: "user", title: "Account created", detail: "Signed up with email", time: "6 days ago" })

  // Ranked jobs, best first. The admin chooses how many the candidate sees.
  const reasons = [
    `Strong ${skills[0]} and ${skills[1]} match`,
    `Good fit; missing ${skills[skills.length - 1]}`,
    `${skills[2]} strong; less ${skills[3]} experience`,
    `Matches seniority and ${skills[0]}`,
    `Location fit; partial ${skills[1]} overlap`,
  ]
  // Jobs the search finds, already in ranked order. Shown once the Search step has run.
  const city = c.location.split(/ or |, /)[0]
  const matches = Array.from({ length: MAX_TOP_JOBS }, (_, i) => {
    const id = `${c.id}-m${i}`
    const jh = hash(id)
    const workplace = ["Remote", "Hybrid", "On-site"][jh % 3]
    return {
      id,
      title: i % 4 === 0 ? `Senior ${c.title.replace("Senior ", "")}` : c.title,
      company: `${COMPANIES[i % COMPANIES.length]}${i >= COMPANIES.length ? ` ${["Labs", "Group"][Math.floor(i / COMPANIES.length) - 1]}` : ""}`,
      score: 93 - i * 2 - (h % 3),
      reason: reasons[i % reasons.length],
      status: i < 3 && done >= 5 ? "Selected" : "Not selected",
      location: workplace === "Remote" || city.toLowerCase() === "remote" ? "Remote" : `${workplace} · ${city}`,
      source: SOURCES[jh % SOURCES.length],
      posted: POSTED[jh % POSTED.length],
      // Already stored from an earlier search, or newly added by this one. Placeholder: comes from the search API.
      origin: (Math.floor(jh / 7) % 3 === 0 ? "New" : "Database") as "New" | "Database",
    }
  })

  const search = {
    found: matches.length + 4 + (h % 5),
    kept: matches.length,
    duplicates: 2 + (h % 3),
    sources: ["Greenhouse", "Lever", "Ashby", "Workable"],
    failed: failedAt === STAGES.indexOf("Search"),
  }

  // Keywords the Criteria step turns the CV and preferences into, used by the job search.
  const base = c.title.replace(/^(Senior|Lead) /, "")
  const titles = unique([c.title, base, `Senior ${base}`, `Lead ${base}`, ...(RELATED_TITLES[base] ?? [])]).slice(0, 5)
  const level = c.title.toLowerCase().includes("senior") ? "Senior" : "Mid level"
  const loc = c.location.toLowerCase()
  const countries = unique(
    Object.entries(CITY_COUNTRY)
      .filter(([city]) => loc.includes(city))
      .map(([, country]) => country)
  )
  const workTypes = loc.includes("remote")
    ? loc === "remote"
      ? ["Remote"]
      : ["Remote", "Hybrid"]
    : loc.includes("hybrid")
      ? ["Hybrid"]
      : ["Hybrid", "On-site"]
  const keywords: Keywords = {
    titles,
    skills,
    // Remote-only candidates default to the United States.
    countries: countries.length ? countries : ["United States"],
    workTypes,
    seniority: level === "Senior" ? ["Senior", "Lead", "Staff"] : ["Mid level", "Senior"],
    exclude: ["Internship", "Unpaid", "Commission only", "Contract under 3 months"],
  }

  return {
    search,
    email: `${first}@example.com`,
    phone: `+1 512 555 0${String(100 + (h % 900)).padStart(3, "0")}`,
    linkedin: `linkedin.com/in/${first}-${c.id.split("-")[1] ?? "x"}`,
    joined: "6 days ago",
    lastSeen: c.updated,
    profile: {
      level: c.title.toLowerCase().includes("senior") ? "Senior" : "Mid level",
      years: 3 + (h % 8),
      skills,
      education: "B.Sc. Computer Science, University of Texas",
      certifications: h % 2 ? ["AWS Certified Data Engineer"] : [],
      experience: [
        { role: c.title, company: "Northbridge Analytics", years: "2021 - present" },
        { role: c.title.replace("Senior ", ""), company: "Lumen Retail", years: "2018 - 2021" },
      ],
    },
    keywords,
    preferences: {
      titles,
      locations: c.location,
      workMode: c.location.toLowerCase().includes("remote") ? "Remote, Hybrid" : "Hybrid, On-site",
      salary: `$${110 + (h % 50)}k+ per year`,
      authorization: "Authorized to work, no sponsorship needed",
    },
    events,
    matches,
  }
}

export type CandidateDetail = ReturnType<typeof getCandidateDetail>


const RECRUITERS = [
  { name: "Jordan Carter", role: "Talent Acquisition Partner" },
  { name: "Maria Lopez", role: "Hiring Manager" },
  { name: "Sam Chen", role: "Technical Recruiter" },
  { name: "Anna Novak", role: "Head of Talent" },
  { name: "Ravi Patel", role: "Engineering Manager" },
]

const toRecruiter = (
  m: { id: string; company: string },
  r: (typeof RECRUITERS)[number],
  i: number,
  extra: { emailStatus: string; source: string; found: string }
) => {
  const domain = `${m.company.toLowerCase().replace(/[^a-z]/g, "")}.com`
  const handle = r.name.toLowerCase().replace(/[^a-z ]/g, "").replace(" ", ".")
  return {
    id: `${m.id}-r${i}`,
    name: r.name,
    role: r.role,
    email: `${handle}@${domain}`,
    linkedin: `linkedin.com/in/${handle.replace(".", "-")}`,
    ...extra,
  }
}

/** One ranked job for a candidate, with placeholder posting details. Replace with the job record from the API. */
export const getMatchDetail = (c: Candidate, matchId: string) => {
  const d = getCandidateDetail(c)
  const index = d.matches.findIndex((m) => m.id === matchId)
  if (index < 0) return null
  const m = d.matches[index]
  const h = hash(m.id)
  const required = d.profile.skills.slice(0, 5)
  const missing = required.filter((_, i) => (h + i) % 4 === 0)
  const low = 90 + (h % 60)

  return {
    candidate: c,
    detail: d,
    match: m,
    rank: index + 1,
    location: m.location,
    salary: h % 4 === 0 ? null : `$${low}k-$${low + 25}k / year`,
    type: "Full-time",
    source: m.source,
    posted: m.posted,
    matched: required.filter((s) => !missing.includes(s)),
    missing,
    description: `${m.company} is hiring a ${m.title} to join a growing team. You'll own core work end to end, partner with product and engineering, and help raise the bar for quality and delivery.`,
    responsibilities: [
      `Lead day-to-day ${m.title.toLowerCase()} work across one or more product areas.`,
      "Work with cross-functional partners to plan, scope and deliver projects.",
      "Share knowledge and help set standards for the team.",
    ],
    // Hiring contacts for this job, found by the Recruiter Research Agent.
    recruiters: RECRUITERS.slice(h % 3, (h % 3) + 2 + (h % 2)).map((r, i) =>
      toRecruiter(m, r, i, {
        emailStatus: i === 0 ? "Verified" : i === 1 ? "Pattern guess" : "Not found",
        source: i === 0 ? "Company careers page" : "Public profile",
        found: POSTED[(h + i) % POSTED.length],
      })
    ),
    // Extra contacts a "Find more recruiters" run turns up. Demo only.
    moreRecruiters: RECRUITERS.filter((_, i) => i < h % 3 || i >= (h % 3) + 2 + (h % 2)).map((r, i) =>
      toRecruiter(m, r, 10 + i, {
        emailStatus: i % 2 === 0 ? "Pattern guess" : "Verified",
        source: "LinkedIn search",
        found: "Today",
      })
    ),
    requirements: [
      `${3 + (h % 4)}+ years of experience in a similar role.`,
      `Hands-on experience with ${required.slice(0, 3).join(", ")}.`,
      "Clear written and spoken communication.",
    ],
  }
}

export type MatchDetail = NonNullable<ReturnType<typeof getMatchDetail>>
