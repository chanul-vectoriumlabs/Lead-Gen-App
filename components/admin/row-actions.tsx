"use client"

import { MoreHorizontal, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type RowAction = {
  label: string
  icon: LucideIcon
  destructive?: boolean
  onSelect?: () => void
}

export const RowActions = ({
  title,
  actions,
}: {
  title: string
  actions: RowAction[]
}) => {
  const normal = actions.filter((a) => !a.destructive)
  const danger = actions.filter((a) => a.destructive)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            aria-label={`Actions for ${title}`}
          />
        }
      >
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-1.5">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="truncate">{title}</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="flex flex-col gap-1">
          {normal.map((a) => (
            <DropdownMenuItem
              key={a.label}
              className="cursor-pointer gap-2.5 px-2 py-2"
              onClick={a.onSelect}
            >
              <a.icon /> {a.label}
            </DropdownMenuItem>
          ))}
        </div>
        {danger.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="flex flex-col gap-1">
              {danger.map((a) => (
                <DropdownMenuItem
                  key={a.label}
                  variant="destructive"
                  className="cursor-pointer gap-2.5 px-2 py-2"
                  onClick={a.onSelect}
                >
                  <a.icon /> {a.label}
                </DropdownMenuItem>
              ))}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
