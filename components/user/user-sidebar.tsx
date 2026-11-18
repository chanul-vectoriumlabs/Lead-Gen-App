"use client"

import { Suspense } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  ChevronsUpDown,
  ClipboardList,
  PanelLeftClose,
  PanelLeftOpen,
  Crown,
  FileUser,
  LayoutDashboard,
  LogOut,
  Settings,
  Target,
  User,
  type LucideIcon,
} from "lucide-react"

import { isLocked } from "@/components/user/feature-locks"
import { usePlan } from "@/components/user/plan-store"
import { signOut } from "@/components/auth/session-store"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"

type Item = { title: string; href: string; icon: LucideIcon }

const main: Item[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Job Tracker", href: "/tracker", icon: ClipboardList },
]

const settings: Item[] = [
  { title: "Job & Resume Settings", href: "/resume-settings", icon: FileUser },
  { title: "Account & Billing", href: "/account", icon: Settings },
]

const MenuList = ({ items, pathname }: { items: Item[]; pathname: string }) => (
  <SidebarMenu className="gap-1">
    {items.map((item) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          isActive={item.href !== "#" && pathname.startsWith(item.href)}
          tooltip={item.title}
          className="h-10 cursor-pointer gap-3 data-active:bg-primary/10 data-active:text-primary"
          render={<Link href={item.href} />}
        >
          <item.icon />
          <span>{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ))}
  </SidebarMenu>
)

// Locked pages are hidden for now (see feature-locks.ts).
const visibleMain = main.filter((i) => !isLocked(i.href))
const visibleSettings = settings.filter((i) => !isLocked(i.href))
const accountLocked = isLocked("/account")

const ActiveMenu = ({ items }: { items: Item[] }) => <MenuList items={items} pathname={usePathname()} />

// usePathname is URL data, so it sits behind Suspense to keep dynamic routes prerenderable.
const Menu = ({ items }: { items: Item[] }) => (
  <Suspense fallback={<MenuList items={items} pathname="" />}>
    <ActiveMenu items={items} />
  </Suspense>
)

const SidebarToggle = () => {
  const { state, toggleSidebar, isMobile } = useSidebar()
  const collapsed = state === "collapsed" && !isMobile
  const Icon = collapsed ? PanelLeftOpen : PanelLeftClose
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 shrink-0 text-muted-foreground hover:text-foreground"
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      onClick={toggleSidebar}
    >
      <Icon />
    </Button>
  )
}

export const UserSidebar = () => {
  const router = useRouter()
  const plan = usePlan()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-2 p-3 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-1 group-data-[collapsible=icon]:flex-col">
            <SidebarMenuButton size="lg" tooltip="JobPilot" render={<Link href="/dashboard" />}>
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:rounded-lg">
                <Target className="size-5" />
              </div>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-heading text-base font-semibold">JobPilot</span>
                <span className="truncate text-xs text-muted-foreground">Job search</span>
              </div>
            </SidebarMenuButton>
            <SidebarToggle />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold tracking-wider uppercase">
            Main menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <Menu items={visibleMain} />
          </SidebarGroupContent>
        </SidebarGroup>
        {visibleSettings.length > 0 && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupContent>
                <Menu items={visibleSettings} />
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="gap-3 p-3 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            {plan === "free" ? (
              <SidebarMenuButton
                tooltip="Upgrade to Pro"
                className="h-10 justify-center gap-2 bg-primary font-medium text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                render={<Link href="/upgrade" />}
              >
                <Crown />
                <span className="group-data-[collapsible=icon]:hidden">Upgrade</span>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                tooltip="Pro plan"
                className="h-10 justify-center gap-2 border border-primary/30 bg-primary/5 font-medium text-primary hover:bg-primary/10 hover:text-primary"
                render={<Link href="/account?tab=subscription" />}
              >
                <Crown />
                <span className="group-data-[collapsible=icon]:hidden">Pro plan</span>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="h-14 cursor-pointer gap-3 border bg-background px-2.5 shadow-xs hover:border-primary/30 hover:bg-background group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:shadow-none"
                  />
                }
              >
                <Avatar className="size-9 shrink-0 group-data-[collapsible=icon]:size-8">
                  <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                    PS
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate text-sm font-semibold">Priya Sharma</span>
                  <span className="truncate text-xs text-muted-foreground">priya@example.com</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56 p-1.5">
                {!accountLocked && (
                  <>
                    <DropdownMenuItem className="cursor-pointer py-2" onClick={() => router.push("/account")}>
                      <User /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer py-2"
                      onClick={() => router.push("/account?tab=notifications")}
                    >
                      <Settings /> Notifications
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  variant="destructive"
                  className="cursor-pointer py-2"
                  onClick={() => {
                    signOut()
                    router.push("/login")
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
