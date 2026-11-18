"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  CreditCard,
  Globe,
  Info,
  KeyRound,
  Mail,
  MapPin,
  Pencil,
  Receipt,
  Smartphone,
  User,
  UserRound,
  type LucideIcon,
} from "lucide-react"

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Tab = "account" | "notifications" | "subscription"
const TABS: { value: Tab; label: string; icon: LucideIcon }[] = [
  { value: "account", label: "Account info", icon: UserRound },
  { value: "notifications", label: "Notifications", icon: Bell },
  { value: "subscription", label: "Subscription", icon: CreditCard },
]

type Profile = {
  name: string
  email: string
  phone: string
  country: string
  state: string
  city: string
  zip: string
  street: string
  linkedin: string
  portfolio: string
  github: string
}

// Placeholder profile for the demo. Replace with the signed-in user's data.
const INITIAL: Profile = {
  name: "Priya Sharma",
  email: "priya@example.com",
  phone: "",
  country: "",
  state: "",
  city: "",
  zip: "",
  street: "",
  linkedin: "",
  portfolio: "",
  github: "",
}

const Info2 = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="truncate text-sm font-medium">{value || "-"}</p>
  </div>
)

const Group = ({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) => (
  <div className="space-y-4">
    <h3 className="flex items-center gap-2.5 font-heading font-semibold">
      <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="size-4" />
      </span>
      {title}
    </h3>
    <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">{children}</div>
  </div>
)

const EditProfileDialog = ({ profile, onSave }: { profile: Profile; onSave: (p: Profile) => void }) => {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(profile)

  const fields: { key: keyof Profile; label: string; type?: string; span?: boolean }[] = [
    { key: "name", label: "Full name" },
    { key: "phone", label: "Phone number", type: "tel" },
    { key: "country", label: "Country" },
    { key: "state", label: "State / Province" },
    { key: "city", label: "City" },
    { key: "zip", label: "Zip / Postal code" },
    { key: "street", label: "Street address", span: true },
    { key: "linkedin", label: "LinkedIn", type: "url" },
    { key: "portfolio", label: "Portfolio / Website", type: "url" },
    { key: "github", label: "GitHub", type: "url" },
  ]

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (o) setDraft(profile)
      }}
    >
      <DialogTrigger render={<Button variant="outline" className="w-full" />}>
        <Pencil /> Edit profile
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>This information is shared only when you apply for a job.</DialogDescription>
        </DialogHeader>
        <div className="grid max-h-[60vh] gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key} className={f.span ? "space-y-2 sm:col-span-2" : "space-y-2"}>
              <Label htmlFor={`edit-${f.key}`}>{f.label}</Label>
              <Input
                id={`edit-${f.key}`}
                type={f.type ?? "text"}
                value={draft[f.key]}
                onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                className="h-10 bg-background"
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button
            onClick={() => {
              onSave({ ...draft, name: draft.name.trim() || profile.name })
              setOpen(false)
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const ChangePasswordDialog = () => {
  const [open, setOpen] = useState(false)
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" })
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const submit = () => {
    if (!pw.current) return setError("Enter your current password.")
    if (pw.next.length < 8) return setError("New password must be at least 8 characters.")
    if (pw.next !== pw.confirm) return setError("New passwords do not match.")
    // Demo only: not connected to authentication yet.
    setError(null)
    setDone(true)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) {
          setPw({ current: "", next: "", confirm: "" })
          setError(null)
          setDone(false)
        }
      }}
    >
      <DialogTrigger render={<Button variant="outline" className="w-full" />}>
        <KeyRound /> Change password
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>Use at least 8 characters.</DialogDescription>
        </DialogHeader>
        {done ? (
          <p className="flex items-center gap-2 rounded-lg bg-primary/5 p-3 text-sm text-primary">
            <CheckCircle2 className="size-4" /> Your password was updated.
          </p>
        ) : (
          <div className="space-y-4">
            {(
              [
                ["current", "Current password", "current-password"],
                ["next", "New password", "new-password"],
                ["confirm", "Confirm new password", "new-password"],
              ] as const
            ).map(([key, label, auto]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={`pw-${key}`}>{label}</Label>
                <Input
                  id={`pw-${key}`}
                  type="password"
                  autoComplete={auto}
                  value={pw[key]}
                  onChange={(e) => setPw((p) => ({ ...p, [key]: e.target.value }))}
                  className="h-10 bg-background"
                />
              </div>
            ))}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )}
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>{done ? "Close" : "Cancel"}</DialogClose>
          {!done && <Button onClick={submit}>Update password</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const AccountInfo = () => {
  const [profile, setProfile] = useState(INITIAL)
  const initials = profile.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">Account info</h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Your personal information is only shared with recruiters when you apply for a position.
          It is encrypted in transit and at rest.
        </p>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[18rem_1fr]">
        <Card className="border border-border">
          <CardContent className="flex flex-col items-center gap-4 text-center">
            <Avatar className="size-20">
              <AvatarFallback className="bg-primary/10 font-heading text-2xl font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <p className="font-heading text-lg font-semibold">{profile.name}</p>
              <div>
                <p className="text-xs text-muted-foreground">Login email</p>
                <p className="text-sm">{profile.email}</p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
              <EditProfileDialog profile={profile} onSave={setProfile} />
              <ChangePasswordDialog />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardContent className="space-y-6">
            <Group icon={User} title="Personal information">
              <Info2 label="Email" value={profile.email} />
              <Info2 label="Phone number" value={profile.phone} />
            </Group>
            <Separator />
            <Group icon={MapPin} title="Location">
              <Info2 label="Country" value={profile.country} />
              <Info2 label="State" value={profile.state} />
              <Info2 label="City" value={profile.city} />
              <Info2 label="Zip / Postal code" value={profile.zip} />
              <Info2 label="Street address" value={profile.street} />
            </Group>
            <Separator />
            <Group icon={Globe} title="Online profiles">
              <Info2 label="LinkedIn" value={profile.linkedin} />
              <Info2 label="Portfolio / Website" value={profile.portfolio} />
              <Info2 label="GitHub" value={profile.github} />
            </Group>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const CATEGORIES = [
  { id: "matches", title: "Job match alerts", text: "When new jobs match your preferences", email: true, phone: false },
  { id: "approval", title: "Approval needed", text: "When a tailored resume and cover letter are ready for you", email: true, phone: true },
  { id: "status", title: "Application updates", text: "Submissions, interviews, offers and follow-up reminders", email: true, phone: false },
  { id: "news", title: "JobPilot news", text: "Weekly updates and platform announcements", email: false, phone: false },
]

const Notifications = () => {
  const [prefs, setPrefs] = useState(CATEGORIES)
  const [saved, setSaved] = useState(false)

  const toggle = (id: string, channel: "email" | "phone", v: boolean) => {
    setSaved(false)
    setPrefs((all) => all.map((c) => (c.id === id ? { ...c, [channel]: v } : c)))
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">Notifications</h2>
        <p className="text-sm text-muted-foreground">
          Choose how you want to hear about your applications and new opportunities.
        </p>
      </div>

      <Alert className="border-primary/30 bg-primary/5">
        <Info className="text-primary" />
        <AlertTitle>Control job match preferences</AlertTitle>
        <AlertDescription>Job alerts are based on your job preferences. Update them to get more relevant alerts.</AlertDescription>
        <AlertAction>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary"
            nativeButton={false}
            render={<Link href="/resume-settings?tab=preferences" />}
          >
            Go to job preferences <ArrowRight />
          </Button>
        </AlertAction>
      </Alert>

      <Card className="border border-border">
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-3 border-b pb-4">
            <h3 className="flex items-center gap-2.5 font-heading text-lg font-semibold">
              <Bell className="size-5 text-primary" /> Notification categories
            </h3>
            <div className="flex gap-6 pr-4 text-sm font-medium">
              <span className="flex w-14 items-center justify-center gap-1.5">
                <Mail className="size-4" /> Email
              </span>
              <span className="flex w-14 items-center justify-center gap-1.5">
                <Smartphone className="size-4" /> Phone
              </span>
            </div>
          </div>

          {prefs.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-4 rounded-lg border p-4">
              <div>
                <p className="font-medium">{c.title}</p>
                <p className="text-sm text-muted-foreground">{c.text}</p>
              </div>
              <div className="flex shrink-0 gap-6">
                <div className="flex w-14 justify-center">
                  <Switch
                    checked={c.email}
                    onCheckedChange={(v) => toggle(c.id, "email", v)}
                    aria-label={`${c.title} by email`}
                  />
                </div>
                <div className="flex w-14 justify-center">
                  <Switch
                    checked={c.phone}
                    onCheckedChange={(v) => toggle(c.id, "phone", v)}
                    aria-label={`${c.title} by phone`}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-end gap-3 pt-2">
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-primary">
                <CheckCircle2 className="size-4" /> Saved
              </span>
            )}
            <Button onClick={() => setSaved(true)}>Save changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const Subscription = () => (
  <div className="space-y-5">
    <h2 className="font-heading text-2xl font-semibold tracking-tight">Subscription</h2>

    <Card className="border border-border">
      <CardContent className="space-y-4">
        <h3 className="flex items-center gap-2.5 font-heading text-lg font-semibold">
          <CreditCard className="size-5 text-primary" /> Current plan
        </h3>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-muted/60 p-4 text-sm">
          <span className="text-muted-foreground">No active subscription found.</span>
          <Button size="sm" nativeButton={false} render={<Link href="/upgrade" />}>
            Choose a plan
          </Button>
        </div>
      </CardContent>
    </Card>

    <Card className="border border-border">
      <CardContent className="space-y-3">
        <h3 className="flex items-center gap-2.5 font-heading text-lg font-semibold">
          <CreditCard className="size-5 text-primary" /> Payment method
        </h3>
        <p className="text-sm text-muted-foreground">No payment method found.</p>
      </CardContent>
    </Card>

    <Card className="border border-border">
      <CardContent className="space-y-3">
        <h3 className="flex items-center gap-2.5 font-heading text-lg font-semibold">
          <Receipt className="size-5 text-primary" /> Billing history
        </h3>
        <p className="text-sm text-muted-foreground">No billing history found.</p>
      </CardContent>
    </Card>
  </div>
)

export const AccountSettings = () => {
  const param = useSearchParams().get("tab")
  const initialTab = TABS.find((t) => t.value === param)?.value ?? "account"

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
        Account &amp; billing
      </p>
      <Tabs key={initialTab} defaultValue={initialTab} className="gap-8">
        <TabsList
          variant="line"
          className="h-auto! w-full justify-start gap-1 overflow-x-auto rounded-none border-b p-0"
        >
          {TABS.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="h-11 flex-none gap-2 rounded-none px-4 text-muted-foreground after:bg-primary hover:text-foreground data-active:text-primary group-data-horizontal/tabs:after:-bottom-px!"
            >
              <t.icon className="size-4" />
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="account">
          <AccountInfo />
        </TabsContent>
        <TabsContent value="notifications">
          <Notifications />
        </TabsContent>
        <TabsContent value="subscription">
          <Subscription />
        </TabsContent>
      </Tabs>
    </div>
  )
}
