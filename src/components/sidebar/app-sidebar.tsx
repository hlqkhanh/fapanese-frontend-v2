import * as React from "react"
import { IconBook, IconChalkboardTeacher, IconDashboard, IconSchool, } from "@tabler/icons-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Thống kê",
      url: "dashboard",
      icon: IconDashboard,
    },
    {
      title: "Quản lí học sinh",
      url: "students",
      icon: IconSchool,
    },
    {
      title: "Quản lí giảng viên",
      url: "teachers",
      icon: IconChalkboardTeacher,
    },
    {
      title: "Quản lí khóa học",
      url: "courses",
      icon: IconBook,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div className="flex h-full justify-start">
                <img
                  src="/logo-v2.png"
                  alt="Fapanese Logo"
                  className="h-15 w-auto object-contain"
                />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
