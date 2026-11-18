import type { Match } from "@/lib/user-matches"

// Demo keyword pool. Replace with the Job Matching Agent's keyword analysis.
const POOL = ["SQL", "Data modeling", "CI/CD", "Docker", "Terraform", "Stakeholder management", "Kubernetes", "Testing"]

export const analyse = (m: Match) => {
  const total = 11
  const full = Math.round((m.score / 100) * 8)
  const missing = m.score >= 85 ? 1 : m.score >= 75 ? 2 : 3
  const partial = Math.max(0, total - full - missing)
  const extra = POOL.filter((k) => !m.skills.includes(k))
  const fullList = [...m.skills, ...extra].slice(0, full)
  const rest = extra.filter((k) => !fullList.includes(k))
  return {
    pct: Math.round(((full + partial * 0.5) / total) * 100),
    full: fullList,
    partial: rest.slice(0, partial),
    missing: ["Team leadership", "GraphQL", "Go"].slice(0, missing),
  }
}

