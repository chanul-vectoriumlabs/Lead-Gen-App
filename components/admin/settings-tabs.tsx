"use client"

import { useState } from "react"
import { Bell, Database, SlidersHorizontal, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersTable } from "@/components/admin/users-table"
import { sources } from "@/lib/mock-data"

const tabs = [
  { value: "users", label: "Users and roles", icon: Users },
  { value: "sources", label: "Sources", icon: Database },
  { value: "search", label: "Search", icon: SlidersHorizontal },
  { value: "notifications", label: "Notifications", icon: Bell },
]

const notificationTypes = [
  "Top jobs ready",
  "New recruiter leads",
  "Approval needed",
  "Application status changes",
  "Workflow failures",
  "Daily and weekly summary",
]

export const SettingsTabs = () => {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(sources.map((s) => [s.id, s.enabled]))
  )

  return (
    <Tabs defaultValue="users" className="gap-6">
      <TabsList
        variant="line"
        className="h-auto! w-full justify-start gap-1 rounded-none border-b p-0"
      >
        {tabs.map((t) => (
          <TabsTrigger
            key={t.value}
            value={t.value}
            className="h-11 flex-none cursor-pointer gap-2 rounded-none px-4 text-muted-foreground hover:text-foreground data-active:text-primary after:bg-primary group-data-horizontal/tabs:after:-bottom-px!"
          >
            <t.icon className="size-4" />
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="users" className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-base font-medium">Users</h2>
            <p className="text-sm text-muted-foreground">
              Roles: Admin, Recruiter, Viewer, Candidate.
            </p>
          </div>
          <Button className="cursor-pointer">Invite user</Button>
        </div>
        <UsersTable />
      </TabsContent>

      <TabsContent value="sources">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Job sources</CardTitle>
            <CardDescription>
              Only sources with confirmed access and usage rights can be switched on.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {sources.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between gap-4 rounded-lg border p-3"
              >
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-sm text-muted-foreground">{s.detail}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Sync: {s.sync}</span>
                  {s.note && <Badge variant="outline">{s.note}</Badge>}
                  <Switch
                    checked={enabled[s.id]}
                    disabled={!!s.note}
                    onCheckedChange={(v) =>
                      setEnabled((e) => ({ ...e, [s.id]: v }))
                    }
                    aria-label={`Enable ${s.name}`}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="search">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Search and ranking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Top jobs kept per candidate</Label>
              <Select defaultValue="6">
                <SelectTrigger className="w-40 cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="p-1.5">
                  {[5, 6, 7, 8, 9, 10].map((n) => (
                    <SelectItem className="cursor-pointer rounded-md px-2.5 py-2" key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Source refresh schedule</Label>
              <Select defaultValue="daily">
                <SelectTrigger className="w-40 cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="p-1.5">
                  <SelectItem className="cursor-pointer rounded-md px-2.5 py-2" value="hourly">Hourly</SelectItem>
                  <SelectItem className="cursor-pointer rounded-md px-2.5 py-2" value="daily">Daily</SelectItem>
                  <SelectItem className="cursor-pointer rounded-md px-2.5 py-2" value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label>Search the job database first</Label>
              <Switch defaultChecked />
            </div>
            <Button>Save changes</Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Email notifications</CardTitle>
            <CardDescription>Choose who is emailed and when.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notificationTypes.map((n) => (
              <div
                key={n}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <Label>{n}</Label>
                <Switch defaultChecked />
              </div>
            ))}
            <div className="space-y-2">
              <Label htmlFor="to">Alert recipients</Label>
              <Input id="to" defaultValue="admin@example.com" />
            </div>
            <Button>Save changes</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
