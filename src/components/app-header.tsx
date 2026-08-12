import { authClient } from "@/lib/auth-client"
import { formatDate } from "date-fns"
import { CopyEmployeePortalButton } from "./copy-employee-portal-button"
import { HeaderUserMenu } from "./header-user-menu"

export function AppHeader() {
  const session = authClient.useSession()

  const today = formatDate(new Date(), "PPPP")

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2">
        {session.data?.user && (
          <div>
            <p className="font-semibold">
              Good day, {session.data?.user?.name} 👋
            </p>
            <p className="text-xs text-muted-foreground">{today}</p>
          </div>
        )}
        <div className="ml-auto flex items-center gap-4">
          <CopyEmployeePortalButton />
          <HeaderUserMenu />
        </div>
      </div>
    </header>
  )
}
