import { formatDate } from "date-fns"
import { HeaderUserMenu } from "./header-user-menu"
import { authClient } from "@/lib/auth-client"

export function AppHeader() {
  const session = authClient.useSession()

  const today = formatDate(new Date(), "PPPP")

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
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
