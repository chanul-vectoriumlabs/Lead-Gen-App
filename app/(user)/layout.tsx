import { UserSidebar } from "@/components/user/user-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <TooltipProvider>
      <SidebarProvider className="print:hidden">
        <UserSidebar />
        <SidebarInset className="min-w-0 bg-muted/40">
          <header className="flex h-14 items-center gap-2 border-b bg-background px-4 md:hidden">
            <SidebarTrigger className="cursor-pointer" />
            <span className="font-heading font-semibold">JobPilot</span>
          </header>
          <main className="flex w-full min-w-0 flex-1 flex-col gap-6 p-4 md:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default UserLayout
