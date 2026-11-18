"use client"

import { useState } from "react"
import { Bell, CircleAlert, FileCheck2, Send, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { notifications as initial } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type Item = {
  id: string
  title: string
  body: string
  time: string
  unread: boolean
  tone: string
}

const iconFor =(title: string) => {
  if (title.includes("failed")) return CircleAlert
  if (title.includes("Approval")) return FileCheck2
  if (title.includes("submitted")) return Send
  return Sparkles
}

export const Notifications = () => {
  const [items, setItems] = useState<Item[]>(initial.map((n) => ({ ...n })))
  const unread = items.filter((n) => n.unread).length

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="relative cursor-pointer bg-background"
            aria-label={`Notifications, ${unread} unread`}
          />
        }
      >
        <Bell />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-white">
            {unread}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 max-w-[calc(100vw-2rem)] gap-0 overflow-hidden p-0">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-sm font-semibold">Notifications</h2>
            {unread > 0 && <Badge>{unread} new</Badge>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            disabled={unread === 0}
            onClick={() => setItems((all) => all.map((n) => ({ ...n, unread: false })))}
          >
            Mark all read
          </Button>
        </div>
        <Separator />
        <div className="max-h-72 overflow-y-auto">
          <ul>
            {items.map((n) => {
              const Icon = iconFor(n.title)
              return (
                <li
                  key={n.id}
                  className={cn(
                    "flex gap-3 border-b p-4 last:border-b-0",
                    n.unread && "bg-primary/5"
                  )}
                >
                  <div
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full",
                      n.tone === "destructive"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-primary/10 text-primary"
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{n.title}</p>
                      {n.unread && <span className="size-2 shrink-0 rounded-full bg-primary" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{n.body}</p>
                    <p className="text-xs text-muted-foreground">{n.time}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
        <Separator />
        <Button
          variant="ghost"
          className="h-11 w-full shrink-0 cursor-pointer rounded-none"
        >
          View all notifications
        </Button>
      </PopoverContent>
    </Popover>
  )
}
