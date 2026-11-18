// Placeholder job matches for the user dashboard. Replace with the Job Matching Agent's output.

export type Match = {
  id: string
  score: number
  skills: string[]
  salary: string | null
  posted: string
  title: string
  company: string
  workplace: string
  quickApply: boolean
  note: string
}

const baseMatches: Match[] = [
  { id: "m1", score: 91, skills: ["Python", "AWS", "Spark"], salary: "$145k-165k/yr", posted: "3 days ago", title: "Senior Data Engineer", company: "Acme Corp", workplace: "Hybrid · Austin", quickApply: true, note: "Your 7 years of pipeline work matches the senior level asked for." },
  { id: "m2", score: 84, skills: ["Airflow", "dbt", "SQL"], salary: null, posted: "5 days ago", title: "Data Platform Engineer", company: "Northwind", workplace: "Remote", quickApply: true, note: "Strong pipeline match; the role asks for 5 years of management." },
  { id: "m3", score: 79, skills: ["SQL", "dbt", "Looker"], salary: "$120k-140k/yr", posted: "1 week ago", title: "Analytics Engineer", company: "Brightly", workplace: "On-site · Austin", quickApply: false, note: "SQL and dbt are strong; less streaming experience than asked." },
  { id: "m4", score: 74, skills: ["Kafka", "Python", "GCP"], salary: "$65-72/hr", posted: "2 days ago", title: "Streaming Data Engineer", company: "Cloudnine", workplace: "Remote", quickApply: true, note: "Python fits; Kafka is listed in your CV as a side project." },
  { id: "m5", score: 71, skills: ["Python", "ML", "AWS"], salary: "$150k-170k/yr", posted: "2 weeks ago", title: "ML Platform Engineer", company: "Globex", workplace: "Remote", quickApply: false, note: "This role could be worth exploring based on your profile." },
  { id: "m6", score: 68, skills: ["SQL", "Tableau", "Python"], salary: "$95k-115k/yr", posted: "4 days ago", title: "BI Engineer", company: "Orbit", workplace: "Hybrid · New York", quickApply: true, note: "Your experience level (mid/senior) matches the job." },
]

// Lower-ranked jobs so the admin's "Top 5 / 10 / 15 / 20" limit has something to cut.
const MORE_COMPANIES = ["Pixelworks", "Lumen", "Vertex", "Harbor", "Quanta", "Bluebird", "Summit"]
const POSTED = ["1 day ago", "3 days ago", "6 days ago", "1 week ago", "2 weeks ago"]

const moreMatches: Match[] = Array.from({ length: 14 }, (_, i) => {
  const base = baseMatches[i % baseMatches.length]
  return {
    ...base,
    id: `m${i + 7}`,
    score: 66 - i * 2,
    salary: i % 3 === 1 ? null : base.salary,
    posted: POSTED[i % POSTED.length],
    company: MORE_COMPANIES[i % MORE_COMPANIES.length],
    quickApply: i % 2 === 0,
    note: "A partial match worth a look; some required skills are missing from your CV.",
  }
})

/** Every ranked job, best first. The candidate sees the top N the admin chose. */
export const matches: Match[] = [...baseMatches, ...moreMatches]
