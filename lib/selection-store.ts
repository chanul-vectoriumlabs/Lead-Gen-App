"use client"

import { useMemo, useSyncExternalStore } from "react"

// Demo-only: the jobs selected for each candidate, kept in the browser so the candidate
// page and the job pages agree. Replace with the selection from the workflow API.

const key = (candidateId: string) => `leadgen.demo.selected.${candidateId}`
const listeners = new Set<() => void>()

const read = (candidateId: string): string | null => {
  try {
    return window.localStorage.getItem(key(candidateId))
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

export const setSelectedJobs = (candidateId: string, ids: string[]) => {
  try {
    window.localStorage.setItem(key(candidateId), JSON.stringify(ids))
  } catch {}
  listeners.forEach((l) => l())
}

/** Selected job ids for a candidate, or `fallback` until a selection is saved. */
export const useSelectedJobs = (candidateId: string, fallback: string[]): string[] => {
  const raw = useSyncExternalStore(
    subscribe,
    () => read(candidateId),
    () => null
  )
  const fallbackKey = fallback.join(",")
  return useMemo(() => {
    if (raw === null) return fallbackKey ? fallbackKey.split(",") : []
    try {
      return JSON.parse(raw) as string[]
    } catch {
      return []
    }
  }, [raw, fallbackKey])
}
