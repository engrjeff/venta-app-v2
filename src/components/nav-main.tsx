"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "@tanstack/react-router"
import { FileClockIcon, HomeIcon, SettingsIcon, UsersIcon } from "lucide-react"

const MAIN_NAV = [
  {
    id: "dashboard",
    title: "Dashboard",
    Icon: HomeIcon,
    pathname: "/dashboard",
  },
  {
    id: "timesheet",
    title: "Timesheet",
    Icon: FileClockIcon,
    pathname: "/timesheet",
  },
]

const OPERATIONS_NAV = [
  {
    id: "employees",
    title: "Employees",
    Icon: UsersIcon,
    pathname: "/employees",
  },
]

const SETTINGS_NAV = [
  {
    id: "settings",
    title: "Store Settings",
    Icon: SettingsIcon,
    pathname: "/settings",
  },
]

export function NavMain() {
  const location = useLocation()

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Menu</SidebarGroupLabel>
        <SidebarMenu>
          {MAIN_NAV.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={location.pathname.includes(item.pathname)}
                render={<Link to={item.pathname} />}
              >
                <item.Icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Operations</SidebarGroupLabel>
        <SidebarMenu>
          {OPERATIONS_NAV.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={location.pathname.includes(item.pathname)}
                render={<Link to={item.pathname} />}
              >
                <item.Icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Settings</SidebarGroupLabel>
        <SidebarMenu>
          {SETTINGS_NAV.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                isActive={location.pathname.includes(item.pathname)}
                render={<Link to={item.pathname} />}
              >
                <item.Icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  )
}
