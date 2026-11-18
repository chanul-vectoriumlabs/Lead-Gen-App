"use client"

import { useSyncExternalStore } from "react"

// Demo-only CV state kept in the browser. Replace with the user's profile from the API.

export type StoredCv = { name: string; size: number; uploadedAt: string }

const KEY = "leadgen.demo.cv"
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

export const saveCv = (cv: StoredCv) => {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cv))
  } catch {}
  emit()
}

export const clearCv = () => {
  try {
    window.localStorage.removeItem(KEY)
  } catch {}
  void fileStore("readwrite", (s) => s.delete(FILE_KEY)).catch(() => {})
  emit()
}

// The uploaded file itself lives in IndexedDB (too big for localStorage).
const DB = "leadgen-demo"
const STORE = "files"
const FILE_KEY = "cv"

const fileStore = <T,>(mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T>) =>
  new Promise<T>((resolve, reject) => {
    const open = window.indexedDB.open(DB, 1)
    open.onupgradeneeded = () => open.result.createObjectStore(STORE)
    open.onerror = () => reject(open.error)
    open.onsuccess = () => {
      const req = run(open.result.transaction(STORE, mode).objectStore(STORE))
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    }
  })

/** Keep the uploaded CV file so it can be viewed later. `key` defaults to the signed-in user's CV. */
export const saveCvFile = (file: File, key = FILE_KEY) =>
  fileStore("readwrite", (s) => s.put(file, key)).catch(() => undefined)

/** The uploaded CV file, or null if it isn't stored in this browser. */
export const loadCvFile = (key = FILE_KEY) =>
  fileStore<File | undefined>("readonly", (s) => s.get(key) as IDBRequest<File | undefined>)
    .then((f) => f ?? null)
    .catch(() => null)

// ---------- CVs the admin uploads for a candidate ----------

const candidateKey = (candidateId: string) => `leadgen.demo.candidateCv.${candidateId}`

/** IndexedDB key for a candidate's admin-uploaded CV file. */
export const candidateCvFileKey = (candidateId: string) => `cv:${candidateId}`

/** Admin uploads a CV for a candidate: keeps the file and its details. */
export const saveCandidateCv = async (candidateId: string, file: File) => {
  await saveCvFile(file, candidateCvFileKey(candidateId))
  try {
    const cv: StoredCv = { name: file.name, size: file.size, uploadedAt: new Date().toISOString() }
    window.localStorage.setItem(candidateKey(candidateId), JSON.stringify(cv))
  } catch {}
  emit()
}

/** The CV an admin uploaded for this candidate, or null. */
export const useCandidateCv = (candidateId: string): StoredCv | null => {
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return window.localStorage.getItem(candidateKey(candidateId))
      } catch {
        return null
      }
    },
    () => null
  )
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredCv
  } catch {
    return null
  }
}

/** Returns undefined while loading (server render), null when no CV, or the CV. */
export const useCv = (): StoredCv | null | undefined => {
  const raw = useSyncExternalStore(subscribe, read, () => undefined)
  if (raw === undefined) return undefined
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredCv
  } catch {
    return null
  }
}
