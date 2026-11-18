import type { LucideIcon } from "lucide-react"
import { TrendingUp } from "lucide-react"

import { InfoTip } from "@/components/admin/info-tip"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const StatCard = ({
  label,
  value,
  hint,
  info,
  icon: Icon,
  accent = "bg-primary/10 text-primary",
  attention = false,
}: {
  label: string
  value: string
  hint?: string
  /** What this number counts, shown as a tooltip. */
  info?: string
  icon: LucideIcon
  accent?: string
  attention?: boolean
}) => {
  const card = (
    <Card
      size="sm"
      tabIndex={info ? 0 : undefined}
      className={cn(
        "border border-border transition-shadow hover:shadow-md",
        info && "cursor-help",
        attention && "border-primary/50 ring-2 ring-primary/30"
      )}
    >
      <CardContent className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="font-heading text-3xl font-semibold tracking-tight">{value}</p>
          {hint && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="size-3 text-primary" />
              {hint}
            </p>
          )}
        </div>
        <div className={cn("flex size-10 items-center justify-center rounded-xl", accent)}>
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  )

  return info ? <InfoTip text={info}>{card}</InfoTip> : card
}
