"use client"

import { useMemo, useSyncExternalStore } from "react"

// Demo-only: the application status of each selected job, kept in the browser so the
// job page and the candidate page agree. Replace with the application status from the API.

export const JOB_STATUSES = [
  "Preparing application",
  "Ready to apply",
  "Applied",
  "Interviewing",
  "Offer",
  "Rejected",
  "Withdrawn",
] as const

export type JobStatus = (typeof JOB_STATUSES)[number]

/** Badge style per status: in progress, good news, or closed. */
export const statusTone = (s: JobStatus): "default" | "secondary" | "outline" | "destructive" =>
  s === "Offer" || s === "Interviewing" ? "default" : s === "Rejected" ? "destructive" : s === "Withdrawn" ? "outline" : "secondary"

const KEY = "leadgen.demo.jobStatus"
const listeners = new Set<() => void>()

const readRaw = () => {
  try {
    return window.localStorage.getItem(KEY) ?? "{}"
  } catch {
    return "{}"
  }
}

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  window.addEventListener("storage", cb)
  return () => {
    listeners.delete(cb)
    window.removeEventListener("storage", cb)
  }
}

export const setJobStatus = (jobId: string, status: JobStatus) => {
  try {
    const all = JSON.parse(readRaw()) as Record<string, JobStatus>
    window.localStorage.setItem(KEY, JSON.stringify({ ...all, [jobId]: status }))
  } catch {}
  listeners.forEach((l) => l())
}

/** Forgets the saved values for these jobs (a new selection starts fresh). */
export const clearJobStatuses = (jobIds: string[]) => {
  try {
    const all = JSON.parse(readRaw()) as Record<string, unknown>
    jobIds.forEach((id) => delete all[id])
    window.localStorage.setItem(KEY, JSON.stringify(all))
  } catch {}
  listeners.forEach((l) => l())
}

/** Statuses for the given jobs. A job has no status until one is set. */
export const useJobStatuses = (jobIds: string[]): Record<string, JobStatus> => {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "{}")
  const ids = jobIds.join(",")
  return useMemo(() => {
    let saved: Record<string, JobStatus> = {}
    try {
      saved = JSON.parse(raw) as Record<string, JobStatus>
    } catch {}
    return Object.fromEntries(
      (ids ? ids.split(",") : []).filter((id) => saved[id]).map((id) => [id, saved[id]])
    )
  }, [raw, ids])
}
