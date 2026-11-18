"use client"

// Demo-only saved application answers kept in the browser.
// Replace with the user's saved autofill answers and job preferences from the API.

import type { Answers } from "@/components/user/autofill-form"

const KEY = "leadgen.demo.answers"

type Saved = { answers: Answers; screening?: string[] }

// Sample profile used for anything the user hasn't saved yet.
const DEMO_PROFILE: Saved = {
  answers: {
    dial: "+1",
    phone: "512-555-0142",
    salaryType: "Yearly",
    salary: "130000",
    country: "United States",
    state: "Texas",
    city: "Austin",
    zip: "78701",
    linkedin: "www.linkedin.com/in/priya-sharma",
    authorized: "Yes",
    sponsorship: "No",
    workStatus: "U.S. citizen",
    adult: "Yes",
    relocate: "Depends on the role",
    years: "5-9 years",
  },
}

const read = (): Saved => {
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Saved) : { answers: {} }
  } catch {
    return { answers: {} }
  }
}

/** Merge new answers into what's saved (empty values are ignored). */
export const saveAnswers = (answers: Answers, screening?: string[]) => {
  const current = read()
  const filled = Object.fromEntries(Object.entries(answers).filter(([, v]) => v?.trim()))
  const next: Saved = {
    answers: { ...current.answers, ...filled },
    screening: screening?.length ? screening : current.screening,
  }
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next))
  } catch {}
}

// Answered by the user on each application, so never pre-filled.
const MANUAL_KEYS = ["conviction", "disability", "veteran", "clearance", "gender", "race", "start", "travel"]

/** Saved answers on top of the demo profile, ready to pre-fill an application. */
export const loadAnswers = (): { answers: Answers; screening: string[] } => {
  const merged: Answers = { ...DEMO_PROFILE.answers, ...read().answers }
  for (const k of MANUAL_KEYS) delete merged[k]
  return { answers: merged, screening: [] }
}
