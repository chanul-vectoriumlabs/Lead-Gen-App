import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .replace(/[^A-Za-z]/g, "")
    .slice(0, 2)
    .toUpperCase()

export const CandidateCell = ({
  name,
  subtitle,
}: {
  name: string
  subtitle?: string
}) => {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-9">
        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
          {initials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="leading-tight">
        <div className="font-medium">{name}</div>
        {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
      </div>
    </div>
  )
}
