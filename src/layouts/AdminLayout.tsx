import { Outlet } from "react-router-dom" // <--- QUAN TRỌNG
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SiteHeader } from "@/components/sidebar/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function AdminLayout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "3rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        
        {/* Khu vực hiển thị nội dung thay đổi */}
        <div className="flex flex-1 flex-col p-4 md:p-6">
           <Outlet /> 
        </div>

      </SidebarInset>
    </SidebarProvider>
  )
}