import type { ReactElement, ReactNode } from "react"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

/** Explains what an element shows when it's hovered or focused. */
export const InfoTip = ({ text, children }: { text: ReactNode; children: ReactElement }) => (
  <Tooltip>
    <TooltipTrigger render={children} />
    <TooltipContent className="text-pretty">{text}</TooltipContent>
  </Tooltip>
)

/** What each candidate status on the dashboard means. */
export const STATUS_INFO: Record<string, string> = {
  "Select jobs": "Jobs are ranked. You need to pick the jobs this candidate will pursue.",
  "Jobs selected": "Jobs are picked and confirmed. The workflow is complete for this candidate.",
  "Source failed": "A job source didn't respond during the search. It retries automatically, or you can re-run it.",
  "Awaiting approval": "An application is ready and waiting for your approval before it's sent.",
}
