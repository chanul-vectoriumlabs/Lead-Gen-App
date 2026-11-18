"use client"

import { useSyncExternalStore } from "react"

// Demo-only: which recruiter each job's application was sent to, kept in the browser.
// A job is applied to through one recruiter only. Replace with the application record from the API.

const KEY = "leadgen.demo.appliedVia"
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

export const markApplied = (jobId: string, recruiterId: string) => {
  try {
    const all = JSON.parse(readRaw()) as Record<string, string>
    window.localStorage.setItem(KEY, JSON.stringify({ ...all, [jobId]: recruiterId }))
  } catch {}
  listeners.forEach((l) => l())
}

/** Forgets the saved values for these jobs (a new selection starts fresh). */
export const clearApplied = (jobIds: string[]) => {
  try {
    const all = JSON.parse(readRaw()) as Record<string, unknown>
    jobIds.forEach((id) => delete all[id])
    window.localStorage.setItem(KEY, JSON.stringify(all))
  } catch {}
  listeners.forEach((l) => l())
}

/** The recruiter this job's application was sent to, or null if not applied yet. */
export const useAppliedVia = (jobId: string): string | null => {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "{}")
  try {
    return (JSON.parse(raw) as Record<string, string>)[jobId] ?? null
  } catch {
    return null
  }
}
