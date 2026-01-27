import { Link, useLocation } from "react-router-dom"
import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const location = useLocation()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-6">
        {/* Phần Quick Create giữ nguyên */}
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-transparent text-primary-foreground hover:bg-primary/90 min-w-8"
            >
              <IconCirclePlusFilled className="!size-5" />
              <span className="font-medium">Quick Create</span>
            </SidebarMenuButton>
            <Button size="icon" className="size-9" variant="outline">
              <IconMail />
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Phần Menu Chính */}
        <SidebarMenu>
          <div className="flex flex-col gap-5">
            {items.map((item) => {
              // Logic check active (như cũ)
              const isActive = location.pathname.includes(item.url)

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    isActive={isActive}
                    className="
                      h-[40px]
                        data-[active=true]:bg-secondary
                        data-[active=true]:text-black
                      "
                  >
                    <Link to={item.url}>
                      {item.icon && <item.icon className="!size-6" />}
                      <span className={`text-base ${isActive ? "font-medium" : "font-normal"}`}>
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </div>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}