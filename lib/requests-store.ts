"use client"

import { useMemo, useSyncExternalStore } from "react"

// Demo-only: admin requests for documents or information, kept in the browser so the
// admin panel and the candidate's dashboard see the same data. Replace with the requests API.

export type InfoRequest = {
  id: string
  candidateId: string
  documents: string[]
  questions: string[]
  message: string
  due: string
  createdAt: string
  status: "pending" | "submitted"
  response?: { files: string[]; answers: Record<string, string>; note: string; at: string }
}

export const DOCUMENT_OPTIONS = [
  "Updated CV",
  "Portfolio",
  "Certificates",
  "Proof of work authorization",
  "References",
  "Cover letter samples",
]

export const QUESTION_OPTIONS = [
  "Salary expectations",
  "Notice period",
  "Earliest start date",
  "Open to relocation?",
  "Preferred interview times",
]

const KEY = "leadgen.demo.requests"
const listeners = new Set<() => void>()

const readRaw = () => {
  try {
    return window.localStorage.getItem(KEY) ?? "[]"
  } catch {
    return "[]"
  }
}

const readAll = (): InfoRequest[] => {
  try {
    return JSON.parse(readRaw()) as InfoRequest[]
  } catch {
    return []
  }
}

const write = (all: InfoRequest[]) => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(all))
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

export const addRequest = (r: Omit<InfoRequest, "id" | "createdAt" | "status">) =>
  write([
    { ...r, id: `req-${Date.now()}`, createdAt: new Date().toISOString(), status: "pending" },
    ...readAll(),
  ])

export const respondToRequest = (id: string, response: Omit<NonNullable<InfoRequest["response"]>, "at">) =>
  write(
    readAll().map((r) =>
      r.id === id ? { ...r, status: "submitted", response: { ...response, at: new Date().toISOString() } } : r
    )
  )

export const cancelRequest = (id: string) => write(readAll().filter((r) => r.id !== id))

/** Requests for one candidate, newest first. Empty on the server. */
export const useRequests = (candidateId: string): InfoRequest[] => {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "[]")
  return useMemo(() => {
    try {
      return (JSON.parse(raw) as InfoRequest[]).filter((r) => r.candidateId === candidateId)
    } catch {
      return []
    }
  }, [raw, candidateId])
}
