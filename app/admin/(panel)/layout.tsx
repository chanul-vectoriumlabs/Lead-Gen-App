import type { Metadata } from "next"

import { AppSidebar } from "@/components/admin/app-sidebar"
import { Topbar } from "@/components/admin/topbar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export const metadata: Metadata = {
  title: "JobPilot | Admin",
  description: "AI Job Intelligence & Recruitment Automation Platform",
}

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <TooltipProvider>
      <SidebarProvider className="print:hidden">
        <AppSidebar />
        <SidebarInset className="bg-muted/40">
          <Topbar />
          <main className="flex w-full flex-1 flex-col gap-6 p-4 md:p-8">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default AdminLayout
