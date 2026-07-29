"use client"

import { Link, useLocation } from "@tanstack/react-router"
import {
  Building2Icon,
  CheckCircleIcon,
  HomeIcon,
  NetworkIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const MAIN_NAV = [
  {
    id: "dashboard",
    title: "Dashboard",
    Icon: HomeIcon,
    pathname: "/dashboard",
  },
]

const OPERATIONS_NAV = [
  {
    id: "attendance",
    title: "Attendance",
    Icon: CheckCircleIcon,
    pathname: "/attendance",
  },
  {
    id: "employees",
    title: "Employees",
    Icon: UsersIcon,
    pathname: "/employees",
  },
  {
    id: "branches",
    title: "Branches",
    Icon: Building2Icon,
    pathname: "/branches",
  },
  {
    id: "designations",
    title: "Designations",
    Icon: NetworkIcon,
    pathname: "/designations",
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
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Operations</SidebarGroupLabel>
        <SidebarMenu>
          {OPERATIONS_NAV.map((item) => (
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
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Settings</SidebarGroupLabel>
        <SidebarMenu>
          {SETTINGS_NAV.map((item) => (
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
    </>
  )
}
