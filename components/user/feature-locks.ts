// Demo switches for what the user area shows right now.
// Flip these to bring hidden parts back.

/** Show the Job matches section on the user dashboard. */
export const SHOW_JOB_MATCHES = false

/** User pages that are locked (shown with a lock, not clickable). */
export const LOCKED_PATHS = ["/tracker", "/resume-settings", "/account"]

export const isLocked = (href: string) => LOCKED_PATHS.some((p) => href === p || href.startsWith(`${p}?`) || href.startsWith(`${p}/`))
