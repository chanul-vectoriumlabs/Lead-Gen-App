"use client"

import { Suspense } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BarChart3,
  Briefcase,
  ChevronsUpDown,
  FileText,
  LayoutDashboard,
  LogOut,
  ScrollText,
  Settings,
  Target,
  User,
  Users,
  UserSearch,
  type LucideIcon,
} from "lucide-react"

import { signOut } from "@/components/auth/session-store"
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { isHiddenAdminPage } from "@/lib/admin-pages"

type NavItem = { title: string; href: string; icon: LucideIcon; badge?: string }

const groups: { label: string; items: NavItem[] }[] = [
  {
    label: "Workspace",
    items: [
      { title: "Overview", href: "/admin", icon: LayoutDashboard },
      { title: "Candidates", href: "/admin/candidates", icon: Users, badge: "3" },
      { title: "Applications", href: "/admin/applications", icon: FileText, badge: "4" },
    ],
  },
  {
    label: "Data",
    items: [
      { title: "Jobs", href: "/admin/jobs", icon: Briefcase },
      { title: "Recruiter leads", href: "/admin/leads", icon: UserSearch },
      { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Logs", href: "/admin/logs", icon: ScrollText, badge: "1" },
      { title: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
]

// Groups without the hidden pages (empty groups are dropped).
const visibleGroups = groups
  .map((g) => ({ ...g, items: g.items.filter((i) => !isHiddenAdminPage(i.href)) }))
  .filter((g) => g.items.length > 0)

const NavGroups = ({ pathname }: { pathname: string }) => (
  <>
    {visibleGroups.map((group) => (
      <SidebarGroup key={group.label}>
        <SidebarGroupLabel className="text-[11px] font-semibold tracking-wider uppercase">
          {group.label}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="gap-1">
            {group.items.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href)
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={active}
                    tooltip={item.title}
                    className="h-9 data-active:bg-primary/10 data-active:text-primary"
                    render={<Link href={item.href} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge className="min-w-5 rounded-full bg-primary px-1.5 text-primary-foreground! peer-data-active/menu-button:text-primary-foreground!">
                      {item.badge}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    ))}
  </>
)

// usePathname is URL data, so it sits behind Suspense to keep dynamic routes prerenderable.
const ActiveNavGroups = () => <NavGroups pathname={usePathname()} />

export const AppSidebar = () => {
  const router = useRouter()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-3 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/admin" />}>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:rounded-lg">
                <Target className="size-5" />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-heading text-base font-semibold">
                  JobPilot
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  Admin panel
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <Suspense fallback={<NavGroups pathname="" />}>
          <ActiveNavGroups />
        </Suspense>
      </SidebarContent>

      <SidebarFooter className="p-3 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="h-14 cursor-pointer gap-3 rounded-xl border bg-background px-2.5 shadow-xs hover:border-primary/30 hover:bg-background data-popup-open:border-primary/40 data-popup-open:ring-2 data-popup-open:ring-primary/15 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:shadow-none"
                  />
                }
              >
                <Avatar className="size-9 shrink-0 ring-2 ring-primary/20 group-data-[collapsible=icon]:size-8">
                  <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                    AU
                  </AvatarFallback>
                  <AvatarBadge className="size-2.5 bg-chart-2" />
                </Avatar>
                <div className="grid flex-1 gap-0.5 text-left leading-tight">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-semibold">Admin User</span>
                    <Badge className="h-4 rounded-sm px-1.5 text-[10px] font-semibold">
                      Admin
                    </Badge>
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    admin@example.com
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuItem>
                  <User /> Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => {
                    signOut()
                    router.push("/admin/login")
                  }}
                >
                  <LogOut /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
