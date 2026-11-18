"use client"

import { useState } from "react"
import {
  BadgeCheck,
  CalendarDays,
  IdCard,
  MapPin,
  Phone,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react"

import {
  CheckTiles,
  Field,
  RadioTiles,
  Section,
  SelectField,
} from "@/components/user/settings-ui"
import { Input } from "@/components/ui/input"

// Small demo location list. Replace with a full country/state/city dataset or API.
const LOCATIONS: Record<string, Record<string, string[]>> = {
  "United States": {
    California: ["Los Angeles", "San Diego", "San Francisco", "San Jose"],
    "New York": ["Albany", "Buffalo", "New York City"],
    Texas: ["Austin", "Dallas", "Houston", "San Antonio"],
    Washington: ["Bellevue", "Seattle", "Spokane"],
  },
  Canada: {
    "British Columbia": ["Vancouver", "Victoria"],
    Ontario: ["Ottawa", "Toronto", "Waterloo"],
    Quebec: ["Montreal", "Quebec City"],
  },
  "United Kingdom": {
    England: ["Birmingham", "London", "Manchester"],
    Scotland: ["Edinburgh", "Glasgow"],
  },
  "Sri Lanka": {
    "Western Province": ["Colombo", "Gampaha", "Negombo"],
    "Central Province": ["Kandy", "Nuwara Eliya"],
  },
}

const DIAL_CODES = ["+1", "+44", "+61", "+91", "+94", "+49"]
const YES_NO = ["Yes", "No"]
const YES_NO_PNS = ["Yes", "No", "Prefer not to say"]

const WORK_STATUS = [
  "U.S. citizen",
  "Green card holder",
  "H-1B visa",
  "F-1 OPT / STEM OPT",
  "TN visa",
  "Other work authorization",
  "Not authorized to work in the U.S.",
]
const SCREENING = [
  "Additional interviews",
  "Drug test",
  "Background check",
  "Reference check",
  "Anything else required",
  "None of these",
]
const RACE = [
  "American Indian or Alaska Native",
  "Asian",
  "Black or African American",
  "Hispanic or Latino",
  "Native Hawaiian or Other Pacific Islander",
  "White",
  "Two or more races",
  "Prefer not to say",
]
const START = ["Immediately", "Within 2 weeks", "Within 1 month", "Within 2 months", "More than 2 months"]

const MANUAL = "Answer for each application. These are never pre-filled."

const ZIP_US = /^\d{5}(-\d{4})?$/

export type Answers = Record<string, string>
export type AutofillErrors = Partial<Record<string, string>>

export const initialAnswers = (): Answers => ({ dial: "+1", salaryType: "Yearly" })

const REQUIRED: Record<string, string> = {
  phone: "Please enter your phone number.",
  salary: "Please enter your desired minimum salary.",
  country: "Please select your country.",
  state: "Please select your state or region.",
  city: "Please select your city.",
  zip: "Please enter your zip or postal code.",
  authorized: "This question is required.",
  sponsorship: "This question is required.",
  workStatus: "This question is required.",
  adult: "This question is required.",
  relocate: "This question is required.",
  years: "This question is required.",
  conviction: "This question is required.",
  disability: "This question is required.",
  veteran: "This question is required.",
  clearance: "This question is required.",
  start: "This question is required.",
  travel: "This question is required.",
}

/** Required-field checks used before an application can be approved. Self-identification stays optional. */
export const validateAnswers = (a: Answers, screening: string[]): AutofillErrors => {
  const errors: AutofillErrors = {}
  for (const [key, msg] of Object.entries(REQUIRED)) if (!a[key]?.trim()) errors[key] = msg
  if (a.country === "United States" && a.zip && !ZIP_US.test(a.zip))
    errors.zip = "Use 5 digits or ZIP+4, e.g. 12345 or 12345-6789."
  if (screening.length === 0) errors.screening = "This question is required."
  return errors
}

type PartProps = {
  answers: Answers
  onAnswer: (key: string, value: string) => void
  errors?: AutofillErrors
}

export const SALARY_PERIODS = ["Yearly", "Monthly", "Hourly"]

const SALARY_PLACEHOLDER: Record<string, string> = { Yearly: "120,000", Monthly: "10,000", Hourly: "60" }

export const SalaryFields = ({ answers: a, onAnswer, errors = {} }: PartProps) => {
  const set = (key: string) => (value: string) => onAnswer(key, value)
  const salaryDisplay = a.salary ? Number(a.salary).toLocaleString() : ""
  const period = a.salaryType || "Yearly"
  return (
    <Field label="Desired minimum salary (USD)" htmlFor="salary-amount" error={errors.salary}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
          <Input
            id="salary-amount"
            inputMode="numeric"
            placeholder={SALARY_PLACEHOLDER[period]}
            value={salaryDisplay}
            onChange={(e) => set("salary")(e.target.value.replace(/[^0-9]/g, ""))}
            aria-invalid={!!errors.salary || undefined}
            className="h-10 bg-background pl-7"
          />
        </div>
        <SelectField
          id="salary-period"
          value={period}
          onChange={set("salaryType")}
          options={SALARY_PERIODS}
          className="w-36 shrink-0"
        />
      </div>
    </Field>
  )
}

export const EligibilitySection = ({ answers: a, onAnswer, errors = {} }: PartProps) => {
  const set = (key: string) => (value: string) => onAnswer(key, value)
  return (
    <Section icon={IdCard} title="Work eligibility">
      <RadioTiles
        name="authorized"
        label="Are you authorized to work in the United States?"
        options={YES_NO}
        value={a.authorized ?? ""}
        onChange={set("authorized")}
        error={errors.authorized}
      />
      <RadioTiles
        name="sponsorship"
        label="Will you now or in the future require sponsorship to work in the United States?"
        options={YES_NO}
        value={a.sponsorship ?? ""}
        onChange={set("sponsorship")}
        error={errors.sponsorship}
      />
      <Field label="What is your U.S. work status?" htmlFor="work-status" error={errors.workStatus}>
        <SelectField
          id="work-status"
          value={a.workStatus ?? ""}
          onChange={set("workStatus")}
          options={WORK_STATUS}
          invalid={!!errors.workStatus}
        />
      </Field>
      <RadioTiles
        name="adult"
        label="Are you at least 18 years old?"
        options={YES_NO}
        value={a.adult ?? ""}
        onChange={set("adult")}
        error={errors.adult}
      />
    </Section>
  )
}

export const RoleFitSection = ({
  answers: a,
  onAnswer,
  errors = {},
  withSalary = false,
}: PartProps & { withSalary?: boolean }) => {
  const set = (key: string) => (value: string) => onAnswer(key, value)
  return (
    <Section icon={Target} title={withSalary ? "Role fit and salary" : "Role fit"}>
      {withSalary && <SalaryFields answers={a} onAnswer={onAnswer} errors={errors} />}
      <RadioTiles
        name="relocate"
        label="Open to relocating?"
        options={["Yes", "No", "Depends on the role"]}
        value={a.relocate ?? ""}
        onChange={set("relocate")}
        columns={3}
        error={errors.relocate}
      />
      <RadioTiles
        name="years"
        label="Years of experience in your target field?"
        options={["0-1 years", "2-4 years", "5-9 years", "10+ years"]}
        value={a.years ?? ""}
        onChange={set("years")}
        columns={4}
        error={errors.years}
      />
    </Section>
  )
}

export const AutofillForm = ({
  answers: a,
  onAnswer,
  screening,
  onScreening,
  errors = {},
  scope = "full",
}: {
  answers: Answers
  onAnswer: (key: string, value: string) => void
  screening: string[]
  onScreening: (v: string[]) => void
  errors?: AutofillErrors
  /** "full" on the application form; "autofill" leaves out the parts kept in Job preferences. */
  scope?: "full" | "autofill"
}) => {
  const full = scope === "full"
  const set = (key: string) => (value: string) => onAnswer(key, value)

  const states = a.country ? Object.keys(LOCATIONS[a.country] ?? {}) : []
  const cities = a.country && a.state ? LOCATIONS[a.country]?.[a.state] ?? [] : []
  const zipInvalid = a.country === "United States" && !!a.zip && !ZIP_US.test(a.zip)

  return (
    <>
      <Section icon={Phone} title="Contact">
        <Field label="Phone number" htmlFor="phone" error={errors.phone}>
          <div className="flex gap-2">
            <SelectField id="dial" value={a.dial} onChange={set("dial")} options={DIAL_CODES} className="w-24 shrink-0" />
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              placeholder="123-456-7890"
              value={a.phone ?? ""}
              onChange={(e) => set("phone")(e.target.value.replace(/[^0-9 -]/g, ""))}
              aria-invalid={!!errors.phone || undefined}
              className="h-10 bg-background"
            />
          </div>
        </Field>
      </Section>

      <Section icon={MapPin} title="Location and LinkedIn">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Country" htmlFor="country" error={errors.country}>
            <SelectField
              id="country"
              value={a.country ?? ""}
              onChange={set("country")}
              options={Object.keys(LOCATIONS)}
              placeholder="Select a country"
              invalid={!!errors.country}
            />
          </Field>
          <Field label="State / Province" htmlFor="state" error={errors.state}>
            <SelectField
              id="state"
              value={a.state ?? ""}
              onChange={set("state")}
              options={states}
              placeholder={a.country ? "Select a state" : "Select a country first"}
              disabled={!a.country}
              invalid={!!errors.state}
            />
          </Field>
          <Field label="City" htmlFor="city" error={errors.city}>
            <SelectField
              id="city"
              value={a.city ?? ""}
              onChange={set("city")}
              options={cities}
              placeholder={a.state ? "Select a city" : "Select a state first"}
              disabled={!a.state}
              invalid={!!errors.city}
            />
          </Field>
          <Field
            label="Zip / Postal code"
            htmlFor="zip"
            hint={a.country === "United States" ? "5 digits or ZIP+4, e.g. 12345 or 12345-6789" : undefined}
            error={errors.zip}
          >
            <Input
              id="zip"
              placeholder="Zip / Postal code"
              value={a.zip ?? ""}
              onChange={(e) => set("zip")(e.target.value)}
              aria-invalid={zipInvalid || !!errors.zip || undefined}
              className="h-10 bg-background"
            />
          </Field>
        </div>
        <Field label="Street address (optional)" htmlFor="street">
          <Input
            id="street"
            placeholder="Street address"
            value={a.street ?? ""}
            onChange={(e) => set("street")(e.target.value)}
            className="h-10 bg-background"
          />
        </Field>
        <Field label="LinkedIn (optional)" htmlFor="linkedin">
          <Input
            id="linkedin"
            type="url"
            placeholder="www.linkedin.com/in/your-name"
            value={a.linkedin ?? ""}
            onChange={(e) => set("linkedin")(e.target.value)}
            className="h-10 bg-background"
          />
        </Field>
      </Section>

      {full && (
        <>
          <EligibilitySection answers={a} onAnswer={onAnswer} errors={errors} />
          <RoleFitSection answers={a} onAnswer={onAnswer} errors={errors} withSalary />
        </>
      )}


      {full && (
        <>
        <Section icon={ShieldCheck} title="Background and compliance" description={MANUAL}>
          <RadioTiles
            name="conviction"
            label="Have you ever been convicted of a crime (excluding minor traffic violations)?"
            options={YES_NO}
            value={a.conviction ?? ""}
            onChange={set("conviction")}
            error={errors.conviction}
          />
          <Field label="Are you willing to complete any pre-employment screening that is required?" error={errors.screening}>
            <CheckTiles
              name="screening"
              options={SCREENING}
              value={screening}
              error={!!errors.screening}
              onChange={(v) => {
                const picked = v.find((x) => !screening.includes(x))
                onScreening(picked === "None of these" ? ["None of these"] : v.filter((x) => x !== "None of these"))
              }}
            />
          </Field>
          <RadioTiles
            name="disability"
            label="Do you have a disability?"
            options={YES_NO_PNS}
            value={a.disability ?? ""}
            onChange={set("disability")}
            columns={3}
            error={errors.disability}
          />
          <RadioTiles
            name="veteran"
            label="Are you a veteran?"
            options={YES_NO_PNS}
            value={a.veteran ?? ""}
            onChange={set("veteran")}
            columns={3}
            error={errors.veteran}
          />
        </Section>

        <Section icon={BadgeCheck} title="Security clearance" description={MANUAL}>
          <RadioTiles
            name="clearance"
            label="Do you hold a U.S. government security clearance?"
            options={["Active", "Inactive (held before, lapsed)", "None"]}
            value={a.clearance ?? ""}
            onChange={set("clearance")}
            columns={3}
            error={errors.clearance}
          />
        </Section>

        <Section
          icon={Users}
          title="Voluntary self-identification"
          description="Optional. Answer for each application. Used only for the equal-opportunity questions some applications include."
        >
          <RadioTiles
            name="gender"
            label="Gender"
            options={["Male", "Female", "Non-binary", "Prefer not to say"]}
            value={a.gender ?? ""}
            onChange={set("gender")}
            columns={4}
          />
          <Field label="Race / ethnicity (EEO-1 categories)" htmlFor="race">
            <SelectField id="race" value={a.race ?? ""} onChange={set("race")} options={RACE} />
          </Field>
        </Section>

        <Section icon={CalendarDays} title="Availability and logistics" description={MANUAL}>
          <Field label="When can you start a new job?" htmlFor="start" error={errors.start}>
            <SelectField id="start" value={a.start ?? ""} onChange={set("start")} options={START} invalid={!!errors.start} />
          </Field>
          <RadioTiles
            name="travel"
            label="Willing to travel?"
            options={["No", "Occasionally", "Yes"]}
            value={a.travel ?? ""}
            onChange={set("travel")}
            columns={3}
            error={errors.travel}
          />
        </Section>
        </>
      )}
    </>
  )
}

/** Shared answer state. Resets dependent fields (country > state > city). */
export const useAutofillState = () => {
  const [answers, setAnswers] = useState<Answers>(initialAnswers)
  const [screening, setScreening] = useState<string[]>([])

  const onAnswer = (key: string, value: string) =>
    setAnswers((prev) => {
      const next = { ...prev, [key]: value }
      if (key === "country") {
        next.state = ""
        next.city = ""
      }
      if (key === "state") next.city = ""
      return next
    })

  /** Replace all answers at once, e.g. to pre-fill from the user's saved profile. */
  const fill = (next: Answers, nextScreening: string[]) => {
    setAnswers({ ...initialAnswers(), ...next })
    setScreening(nextScreening)
  }

  return { answers, onAnswer, screening, setScreening, fill }
}

