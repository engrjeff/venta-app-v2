import { authClient } from "@/lib/auth-client"
import { formatDate } from "date-fns"
import { HeaderUserMenu } from "./header-user-menu"
import { SidebarTrigger } from "./ui/sidebar"

export function AppHeader() {
  const session = authClient.useSession()

  const today = formatDate(new Date(), "PPPP")

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 pr-4 pl-2 lg:gap-2">
        <SidebarTrigger />
        {session.data?.user && (
          <div>
            <p className="font-semibold">
              Good day, {session.data?.user?.name} 👋
            </p>
            <p className="text-xs text-muted-foreground">{today}</p>
          </div>
        )}
        <div className="ml-auto flex items-center gap-2">
          <HeaderUserMenu />
        </div>
      </div>
    </header>
  )
}
