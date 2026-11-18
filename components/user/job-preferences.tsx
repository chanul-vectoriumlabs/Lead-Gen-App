"use client"

import { useState, type KeyboardEvent } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Briefcase,
  Clock,
  DollarSign,
  Gift,
  GraduationCap,
  Info,
  MapPin,
  Search,
  TrendingUp,
  X,
} from "lucide-react"

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { EligibilitySection, RoleFitSection, SALARY_PERIODS, type Answers } from "@/components/user/autofill-form"
import { saveAnswers } from "@/components/user/answers-store"
import { CheckTiles, Section, SelectField, StickySave, tileClass } from "@/components/user/settings-ui"

const BENEFITS = [
  "Paid vacation days",
  "Health insurance",
  "Dental insurance",
  "Retirement plan",
  "Performance bonus",
  "Equity or stock options",
  "Flexible working hours",
  "Learning support",
  "Workplace perks and benefits",
  "Paid parental leave",
]
const WORK_MODES = ["Remote", "On-site", "Hybrid"]
const EXPERIENCE = ["Entry level", "Mid/Senior", "Director", "Executive"]
const EDUCATION = [
  "High school or equivalent",
  "Associate degree",
  "Bachelor's degree",
  "Master's degree",
  "MBA",
  "PhD / Doctorate",
  "Self-taught / Bootcamp",
  "Other",
]
const SCHEDULE = ["Full-time", "Part-time", "Contract", "Freelance", "Internship", "Temporary"]

const ROLE_SUGGESTIONS = [
  "Data Engineer",
  "Senior Data Engineer",
  "Data Platform Engineer",
  "Analytics Engineer",
  "Data Analyst",
  "Machine Learning Engineer",
  "Software Engineer",
  "BI Engineer",
]
const LOCATION_SUGGESTIONS = [
  "Austin, TX",
  "New York, NY",
  "San Francisco, CA",
  "Toronto, ON",
  "London, UK",
  "Berlin, Germany",
  "United States",
  "Anywhere",
]

const TagInput = ({
  id,
  placeholder,
  suggestions,
  value,
  onChange,
}: {
  id: string
  placeholder: string
  suggestions: string[]
  value: string[]
  onChange: (v: string[]) => void
}) => {
  const [text, setText] = useState("")
  const [open, setOpen] = useState(false)

  const add = (t: string) => {
    const v = t.trim()
    if (v && !value.some((x) => x.toLowerCase() === v.toLowerCase())) onChange([...value, v])
    setText("")
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      add(text)
    } else if (e.key === "Backspace" && !text && value.length) {
      onChange(value.slice(0, -1))
    }
  }

  const q = text.trim().toLowerCase()
  const matches = suggestions
    .filter((s) => !value.includes(s) && (!q || s.toLowerCase().includes(q)))
    .slice(0, 6)

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          value={text}
          placeholder={placeholder}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKey}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          className="h-10 bg-background pl-9"
        />
        {open && matches.length > 0 && (
          <ul className="absolute top-full z-20 mt-1 w-full rounded-lg border bg-popover p-1.5 shadow-md">
            {matches.map((m) => (
              <li key={m}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => add(m)}
                  className="w-full cursor-pointer rounded-md px-2.5 py-2 text-left text-sm hover:bg-accent"
                >
                  {m}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((v) => (
            <Badge key={v} variant="secondary" className="h-7 gap-1 pr-1 pl-2.5 text-xs">
              {v}
              <button
                type="button"
                aria-label={`Remove ${v}`}
                onClick={() => onChange(value.filter((x) => x !== v))}
                className="flex size-5 cursor-pointer items-center justify-center rounded-sm hover:bg-foreground/10"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground">Press Enter to add. Add as many as you like.</p>
    </div>
  )
}

const SALARY_RANGE: Record<string, { max: number; step: number; unit: string; cap: string }> = {
  Yearly: { max: 500000, step: 5000, unit: "USD/year", cap: "500k" },
  Monthly: { max: 40000, step: 500, unit: "USD/month", cap: "40k" },
  Hourly: { max: 250, step: 1, unit: "USD/hour", cap: "250" },
}

export const JobPreferences = () => {
  const [roles, setRoles] = useState<string[]>([])
  const [salaryType, setSalaryType] = useState("Yearly")
  const [salary, setSalary] = useState(0)
  const [benefits, setBenefits] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [modes, setModes] = useState<string[]>(["Remote"])
  const [experience, setExperience] = useState<string[]>([])
  const [education, setEducation] = useState("")
  const [schedule, setSchedule] = useState<string[]>([])
  const [saved, setSaved] = useState(false)
  const [answers, setAnswers] = useState<Answers>({})
  const onAnswer = (key: string, value: string) => {
    setSaved(false)
    setAnswers((a) => ({ ...a, [key]: value }))
  }

  const { max, step, unit, cap } = SALARY_RANGE[salaryType] ?? SALARY_RANGE.Yearly
  const fmt = (n: number) => (n >= max ? `$${cap}+` : `$${n.toLocaleString()}`)

  const touch =
    <T,>(set: (v: T) => void) =>
    (v: T) => {
      setSaved(false)
      set(v)
    }

  return (
    <div className="space-y-5">
      <h2 className="font-heading text-2xl font-semibold tracking-tight">Job preferences</h2>

      <Alert className="border-primary/30 bg-primary/5">
        <Info className="text-primary" />
        <AlertTitle>Want alerts for these jobs?</AlertTitle>
        <AlertDescription>Set how you&apos;d like to be notified when jobs match your preferences.</AlertDescription>
        <AlertAction>
          <Button variant="ghost" size="sm" className="text-primary" nativeButton={false} render={<Link href="/account?tab=notifications" />}>
            Go to notifications <ArrowRight />
          </Button>
        </AlertAction>
      </Alert>

      <Section icon={Briefcase} title="Roles">
        <TagInput
          id="roles"
          placeholder="Search or type a job title..."
          suggestions={ROLE_SUGGESTIONS}
          value={roles}
          onChange={touch(setRoles)}
        />
      </Section>

      <Section icon={DollarSign} title="Salary">
        <div className="space-y-2">
          <Label htmlFor="salary-period">Pay period</Label>
          <SelectField
            id="salary-period"
            value={salaryType}
            onChange={(v) => {
              setSaved(false)
              setSalaryType(v)
              setSalary(0)
            }}
            options={SALARY_PERIODS}
            className="w-48"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Minimum salary ({unit})</Label>
            <span className="font-heading text-lg font-semibold">{fmt(salary)}</span>
          </div>
          <Slider
            value={[salary]}
            min={0}
            max={max}
            step={step}
            onValueChange={(v) => touch(setSalary)(Array.isArray(v) ? v[0] : v)}
            aria-label="Minimum salary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>{fmt(max)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="min-salary">Minimum salary</Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              $
            </span>
            <Input
              id="min-salary"
              inputMode="numeric"
              value={salary ? String(salary) : ""}
              placeholder="0"
              onChange={(e) => {
                const n = Number(e.target.value.replace(/[^0-9]/g, "")) || 0
                touch(setSalary)(Math.min(n, max))
              }}
              className="h-10 bg-background pl-7"
            />
          </div>
          <p className="text-xs text-muted-foreground">Jobs that don&apos;t list a salary are still shown, flagged.</p>
        </div>
      </Section>

      <EligibilitySection answers={answers} onAnswer={onAnswer} />
      <RoleFitSection answers={answers} onAnswer={onAnswer} />

      <Section
        icon={Gift}
        title="Benefits"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              touch(setBenefits)(benefits.length === BENEFITS.length ? [] : [...BENEFITS])
            }
          >
            {benefits.length === BENEFITS.length ? "Clear all" : "Select all"}
          </Button>
        }
      >
        <CheckTiles name="benefit" options={BENEFITS} value={benefits} onChange={touch(setBenefits)} />
      </Section>

      <Section icon={MapPin} title="Target locations">
        <TagInput
          id="locations"
          placeholder="Search city, state or country..."
          suggestions={LOCATION_SUGGESTIONS}
          value={locations}
          onChange={touch(setLocations)}
        />
        <div className="space-y-2">
          <Label>Work mode preferences</Label>
          <CheckTiles name="mode" options={WORK_MODES} value={modes} onChange={touch(setModes)} />
        </div>
      </Section>

      <Section icon={TrendingUp} title="Experience levels">
        <CheckTiles name="exp" options={EXPERIENCE} value={experience} onChange={touch(setExperience)} />
      </Section>

      <Section icon={GraduationCap} title="Education">
        <RadioGroup
          value={education}
          onValueChange={(v) => touch(setEducation)(v as string)}
          className="grid gap-3 sm:grid-cols-2"
        >
          {EDUCATION.map((e) => (
            <label key={e} htmlFor={`edu-${e}`} className={tileClass(education === e)}>
              <RadioGroupItem id={`edu-${e}`} value={e} />
              {e}
            </label>
          ))}
        </RadioGroup>
      </Section>

      <Section icon={Clock} title="Work schedule">
        <CheckTiles name="schedule" options={SCHEDULE} value={schedule} onChange={touch(setSchedule)} />
      </Section>

      <StickySave saved={saved} label="Preferences saved" onSave={() => {
          saveAnswers({
            ...answers,
            salaryType,
            salary: salary ? String(salary) : "",
          })
          setSaved(true)
        }} />
    </div>
  )
}
