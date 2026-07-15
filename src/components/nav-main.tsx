"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "@tanstack/react-router"
import { Building2Icon, HomeIcon, NetworkIcon, UsersIcon } from "lucide-react"

const MAIN_NAV = [
  {
    id: "dashboard",
    title: "Dashboard",
    Icon: HomeIcon,
    pathname: "/dashboard",
  },
  {
    id: "branch",
    title: "Branch",
    Icon: Building2Icon,
    pathname: "/branch",
  },
  {
    id: "designations",
    title: "Designations",
    Icon: NetworkIcon,
    pathname: "/designations",
  },
  {
    id: "employees",
    title: "Employees",
    Icon: UsersIcon,
    pathname: "/employees",
  },
]

export function NavMain() {
  const location = useLocation()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {MAIN_NAV.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              isActive={item.pathname === location.pathname}
              render={<Link to={item.pathname} />}
            >
              <item.Icon />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
