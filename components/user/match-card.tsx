"use client"

import Link from "next/link"
import {
  Check,
  ChevronRight,
  Clock,
  EyeOff,
  Flag,
  Heart,
  MapPin,
  MoreHorizontal,
  Share2,
  Sparkles,
  Zap,
} from "lucide-react"

import type { Match } from "@/lib/user-matches"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export const MatchCard = ({
  match,
  saved,
  applied,
  onSave,
  onPass,
  onApply,
}: {
  match: Match
  saved: boolean
  applied: boolean
  onSave: () => void
  onPass: () => void
  onApply: () => void
}) => {
  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card shadow-xs transition-shadow hover:shadow-md">
      <button
        type="button"
        className="flex cursor-pointer items-center gap-2 border-b bg-primary/5 px-5 py-2.5 text-left text-sm hover:bg-primary/10"
      >
        <span className="font-heading font-semibold text-primary">{match.score}%</span>
        <span className="min-w-0 flex-1 truncate text-muted-foreground">
          Matches {match.skills.join(", ")}
        </span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      </button>

      <div className="flex flex-1 flex-col gap-4 px-5 py-4">
        <div className="flex items-center gap-2">
          <Badge variant={match.salary ? "default" : "secondary"}>
            {match.salary ?? "Salary not listed"}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" /> {match.posted}
          </span>
          <div className="ml-auto flex">
            <Button
              variant="ghost"
              size="icon-sm"
              className="cursor-pointer"
              aria-label={saved ? "Remove from saved" : "Save job"}
              aria-pressed={saved}
              onClick={onSave}
            >
              <Heart className={cn(saved && "fill-primary text-primary")} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon-sm" className="cursor-pointer" aria-label="More actions" />
                }
              >
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-1.5">
                <DropdownMenuItem className="cursor-pointer py-2">
                  <Share2 /> Share job
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer py-2" onClick={onPass}>
                  <EyeOff /> Hide this company
                </DropdownMenuItem>
                <DropdownMenuItem variant="destructive" className="cursor-pointer py-2">
                  <Flag /> Report job
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-heading text-lg font-semibold text-primary">
            {match.company[0]}
          </div>
          <div className="min-w-0">
            <h3 className="line-clamp-2 font-heading font-semibold leading-snug">{match.title}</h3>
            <p className="text-sm text-muted-foreground">{match.company}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="gap-1">
            <MapPin className="size-3" /> {match.workplace}
          </Badge>
          {match.quickApply && (
            <Badge variant="secondary" className="gap-1 text-primary">
              <Zap className="size-3" /> Quick apply
            </Badge>
          )}
        </div>

        <p className="flex gap-2 text-sm text-muted-foreground">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
          {match.note}
        </p>

        <div className="mt-auto flex items-center gap-2">
          <Button variant="outline" size="sm" nativeButton={false} render={<Link href={`/job/${match.id}`} />}>
            View details
          </Button>
          <Button variant="ghost" size="sm" className="ml-auto cursor-pointer" onClick={onPass} disabled={applied}>
            Pass
          </Button>
          <Button size="sm" className="cursor-pointer" onClick={onApply} disabled={applied}>
            {applied ? (
              <>
                <Check /> Drafting
              </>
            ) : (
              "Apply"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
