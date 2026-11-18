import { STAGES, type StageState } from "@/lib/mock-data"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const tone: Record<StageState, string> = {
  done: "bg-primary",
  waiting: "bg-primary/40 animate-pulse",
  failed: "bg-destructive",
  pending: "bg-muted",
}

const label: Record<StageState, string> = {
  done: "Done",
  waiting: "Waiting for you",
  failed: "Failed",
  pending: "Not started",
}

export const StageTracker = ({ stages }: { stages: StageState[] }) => {
  return (
    <div className="flex gap-1" role="list" aria-label="Progress by stage">
      {stages.map((state, i) => (
        <Tooltip key={STAGES[i]}>
          <TooltipTrigger
            render={
              <span
                role="listitem"
                className={cn("h-2 w-6 rounded-full", tone[state])}
              />
            }
          />
          <TooltipContent>
            {STAGES[i]}: {label[state]}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}

export const StageLegend = () => {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
      {(Object.keys(label) as StageState[]).map((k) => (
        <span key={k} className="flex items-center gap-1.5">
          <span className={cn("h-2 w-4 rounded-full", tone[k])} />
          {label[k]}
        </span>
      ))}
    </div>
  )
}
