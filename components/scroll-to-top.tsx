"use client"

import { Suspense, useEffect } from "react"
import { usePathname } from "next/navigation"

const Reset = () => {
  const pathname = usePathname()

  // Don't restore the old scroll position on reload or back/forward.
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual"
  }, [])

  // Every page opens at the top.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [pathname])

  return null
}

/** Opens every page at the top instead of where the previous page was scrolled to. */
export const ScrollToTop = () => (
  <Suspense fallback={null}>
    <Reset />
  </Suspense>
)
