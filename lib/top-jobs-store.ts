"use client"

import { useSyncExternalStore } from "react"

// Demo-only: how many top jobs the admin lets each candidate see, kept in the browser.
// Replace with the candidate's setting from the API.

export const TOP_JOB_OPTIONS = [5, 10, 15, 20]
export const MAX_TOP_JOBS = 20

/** The signed-in demo user is this candidate in the admin panel. */
export const DEMO_CANDIDATE_ID = "priya-s"

const key = (candidateId: string) => `leadgen.demo.topJobs.${candidateId}`
const listeners = new Set<() => void>()

/** Smallest option that covers the candidate's current number of top jobs. */
export const defaultTopJobs = (current: number) => TOP_JOB_OPTIONS.find((n) => n >= current) ?? MAX_TOP_JOBS

const read = (candidateId: string): number | null => {
  try {
    const n = Number(window.localStorage.getItem(key(candidateId)))
    return TOP_JOB_OPTIONS.includes(n) ? n : null
  } catch {
    return null
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

export const setTopJobs = (candidateId: string, n: number) => {
  try {
    window.localStorage.setItem(key(candidateId), String(n))
  } catch {}
  listeners.forEach((l) => l())
}

/** The admin's limit for this candidate, or the fallback until one is set. */
export const useTopJobs = (candidateId: string, fallback: number): number =>
  useSyncExternalStore(
    subscribe,
    () => read(candidateId) ?? fallback,
    () => fallback
  )
