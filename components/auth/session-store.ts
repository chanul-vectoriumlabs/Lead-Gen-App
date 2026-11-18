"use client"

import { useSyncExternalStore } from "react"

// Demo-only sign-in state kept in the browser. Replace with real auth (Supabase) later.

export type Session = { email: string; name: string; role: "user" | "admin" }

const KEY = "leadgen.demo.session"
const listeners = new Set<() => void>()

const read = (): string | null => {
  try {
    return window.localStorage.getItem(KEY)
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

const emit = () => listeners.forEach((l) => l())

export const signIn = (session: Session) => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(session))
  } catch {}
  emit()
}

export const signOut = () => {
  try {
    window.localStorage.removeItem(KEY)
  } catch {}
  emit()
}

/** undefined while loading (server render), null when signed out, or the session. */
export const useSession = (): Session | null | undefined => {
  const raw = useSyncExternalStore(subscribe, read, () => undefined)
  if (raw === undefined) return undefined
  if (!raw) return null
  try {
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}
