"use client"

import { useSyncExternalStore } from "react"

// Demo-only plan state kept in the browser. Replace with the user's subscription from the API.

export type Plan = "free" | "pro"

const KEY = "leadgen.demo.plan"
const listeners = new Set<() => void>()

const read = (): Plan => {
  try {
    return window.localStorage.getItem(KEY) === "pro" ? "pro" : "free"
  } catch {
    return "free"
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

export const setPlan = (plan: Plan) => {
  try {
    window.localStorage.setItem(KEY, plan)
  } catch {}
  listeners.forEach((l) => l())
}

/** Defaults to "free" on the server and until the browser value loads. */
export const usePlan = (): Plan => useSyncExternalStore(subscribe, read, () => "free")
