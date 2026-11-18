"use client"

import type { ReactNode } from "react"
import { CheckCircle2, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export const tileClass = (on: boolean) =>
  cn(
    "flex cursor-pointer items-center gap-3 rounded-lg border bg-background px-4 py-3 text-sm transition-colors hover:border-primary/40",
    on && "border-primary bg-primary/5 font-medium text-primary"
  )

const cols = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-")

export const Section = ({
  icon: Icon,
  title,
  description,
  action,
  children,
}: {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  children: ReactNode
}) => (
  <Card className="overflow-visible border border-border">
    <CardContent className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="flex items-center gap-2.5 font-heading font-semibold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-4" />
            </span>
            {title}
          </h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </CardContent>
  </Card>
)

export const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="text-xs font-medium text-destructive">{message}</p> : null

export const Field = ({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string
  htmlFor?: string
  hint?: string
  error?: string
  children: ReactNode
}) => (
  <div className="space-y-2">
    <Label htmlFor={htmlFor}>{label}</Label>
    {children}
    {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
    <FieldError message={error} />
  </div>
)

export const CheckTiles = ({
  name,
  options,
  value,
  onChange,
  columns = 2,
  error,
}: {
  name: string
  options: string[]
  value: string[]
  onChange: (v: string[]) => void
  columns?: 2 | 3 | 4
  error?: boolean
}) => (
  <div className={cn("grid gap-3", cols[columns])}>
    {options.map((o) => {
      const on = value.includes(o)
      const id = `${name}-${slug(o)}`
      return (
        <label key={o} htmlFor={id} className={cn(tileClass(on), error && !on && "border-destructive/60")}>
          <Checkbox
            id={id}
            checked={on}
            onCheckedChange={(c) => onChange(c ? [...value, o] : value.filter((x) => x !== o))}
          />
          {o}
        </label>
      )
    })}
  </div>
)

export const RadioTiles = ({
  name,
  label,
  options,
  value,
  onChange,
  columns = 2,
  error,
}: {
  name: string
  label?: string
  options: string[]
  value: string
  onChange: (v: string) => void
  columns?: 2 | 3 | 4
  error?: string
}) => (
  <div className="space-y-2">
    {label && <Label id={`${name}-label`}>{label}</Label>}
    <RadioGroup
      aria-labelledby={label ? `${name}-label` : undefined}
      value={value}
      onValueChange={(v) => onChange(v as string)}
      className={cn("grid gap-3", cols[columns])}
    >
      {options.map((o) => {
        const id = `${name}-${slug(o)}`
        return (
          <label
            key={o}
            htmlFor={id}
            className={cn(tileClass(value === o), error && "border-destructive/60")}
          >
            <RadioGroupItem id={id} value={o} />
            {o}
          </label>
        )
      })}
    </RadioGroup>
    <FieldError message={error} />
  </div>
)

export const SelectField = ({
  id,
  value,
  onChange,
  options,
  placeholder = "Select an answer",
  disabled,
  className,
  invalid,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
  disabled?: boolean
  className?: string
  invalid?: boolean
}) => (
  <Select value={value || null} onValueChange={(v) => onChange((v as string) ?? "")} disabled={disabled}>
    <SelectTrigger id={id} aria-invalid={invalid || undefined} className={cn("h-10! w-full bg-background", className)}>
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent alignItemWithTrigger={false} className="max-h-72 p-1.5">
      {options.map((o) => (
        <SelectItem key={o} value={o} className="rounded-md px-2.5 py-2">
          {o}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)

export const StickySave = ({ saved, label, onSave }: { saved: boolean; label: string; onSave: () => void }) => (
  <div className="sticky bottom-0 z-10 -mx-4 -mb-4 flex items-center justify-end gap-3 border-t bg-background px-4 py-4 md:-mx-8 md:-mb-8 md:px-8">
    {saved && (
      <span className="flex items-center gap-1.5 text-sm text-primary">
        <CheckCircle2 className="size-4" /> {label}
      </span>
    )}
    <Button size="lg" onClick={onSave}>
      Save
    </Button>
  </div>
)
