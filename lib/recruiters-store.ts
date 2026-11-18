"use client"

import { useSyncExternalStore } from "react"

// Demo-only: recruiter search status per job, kept in the browser.
// Replace with the Recruiter Research Agent's results from the API.

export type RecruiterStatus = "searching" | "found" | "none"

const KEY = "leadgen.demo.recruiterStatus"
const STEP_MS = 1100
const listeners = new Set<() => void>()

const readRaw = () => {
  try {
    return window.localStorage.getItem(KEY) ?? "{}"
  } catch {
    return "{}"
  }
}

const read = (): Record<string, RecruiterStatus> => {
  try {
    return JSON.parse(readRaw()) as Record<string, RecruiterStatus>
  } catch {
    return {}
  }
}

const write = (patch: Record<string, RecruiterStatus>) => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...read(), ...patch }))
  } catch {}
  listeners.forEach((l) => l())
}

const subscribe = (cb: () => void) => {
  listeners.add(cb)
  window.addEventListener("storage", cb)
  return () => {
    listeners.delete(cb)
    window.removeEventListener("storage", cb)
  }
}

export const markRecruitersFound = (jobId: string) => write({ [jobId]: "found" })

/** Forgets the saved values for these jobs (a new selection starts fresh). */
export const clearRecruiterStatuses = (jobIds: string[]) => {
  try {
    const all = JSON.parse(readRaw()) as Record<string, unknown>
    jobIds.forEach((id) => delete all[id])
    window.localStorage.setItem(KEY, JSON.stringify(all))
  } catch {}
  listeners.forEach((l) => l())
}

/**
 * Starts the Recruiter Research Agent for these jobs. It runs in the background, so each job
 * shows "searching" until it finishes as "found" or "none".
 * Demo only: `found` says how each job will turn out.
 */
export const startRecruiterSearch = (jobs: { id: string; found: boolean }[]) => {
  write(Object.fromEntries(jobs.map((j) => [j.id, "searching" as const])))
  jobs.forEach((j, i) =>
    setTimeout(() => write({ [j.id]: j.found ? "found" : "none" }), STEP_MS * (i + 1))
  )
}

/** Recruiter search status of each job (missing = not searched yet). */
export const useRecruiterStatuses = (): Record<string, RecruiterStatus> => {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "{}")
  try {
    return JSON.parse(raw) as Record<string, RecruiterStatus>
  } catch {
    return {}
  }
}

/** True once recruiters have been found for this job. */
export const useRecruitersFound = (jobId: string): boolean => useRecruiterStatuses()[jobId] === "found"
