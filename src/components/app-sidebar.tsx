import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import type { Store } from "@/features/store/store.types"
import { useRouteContext } from "@tanstack/react-router"
import { NavMain } from "./nav-main"
import { StoreSwitcher } from "./store-switcher"

interface AppSidebarProps {
  stores: Store[] | null
}

export function AppSidebar({ stores }: AppSidebarProps) {
  const { user, activeStoreId } = useRouteContext({ from: "/_protected" })

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <StoreSwitcher stores={stores ?? []} activeStoreId={activeStoreId} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
