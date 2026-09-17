import {
  Link,
  useLocation,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router"
import {
  BoxIcon,
  ChartNoAxesColumnIcon,
  ChevronRightIcon,
  ClockIcon,
  FileTextIcon,
  HomeIcon,
  LogOutIcon,
  MoreHorizontalIcon,
  SettingsIcon,
  ShoppingBagIcon,
  UsersIcon,
} from "lucide-react"
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { authClient } from "@/lib/auth-client"
import { getInitials } from "@/lib/utils"
import { MobileTabBar } from "./mobile-tab-bar"
import type { MobileTabBarTab } from "./mobile-tab-bar"

const MORE_NAV = [
  { label: "Requests", to: "/requests", Icon: FileTextIcon },
  { label: "Products", to: "/products", Icon: BoxIcon },
  { label: "Orders", to: "/orders", Icon: ShoppingBagIcon },
  { label: "Store Settings", to: "/settings", Icon: SettingsIcon },
] as const

function getActiveTab(pathname: string) {
  if (pathname.startsWith("/dashboard")) return "home"
  if (pathname.startsWith("/timesheet")) return "timesheet"
  if (pathname.startsWith("/sales")) return "sales"
  if (pathname.startsWith("/employees")) return "team"

  // requests, products, orders, and settings all live behind "More"
  return "more"
}

export function AppBottomNav() {
  const [moreOpen, setMoreOpen] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useRouteContext({ from: "/_protected" })

  const activeTab = getActiveTab(location.pathname)

  const tabs: MobileTabBarTab[] = [
    { id: "home", label: "Home", icon: HomeIcon, to: "/dashboard" },
    { id: "timesheet", label: "Timesheet", icon: ClockIcon, to: "/timesheet" },
    { id: "sales", label: "Sales", icon: ChartNoAxesColumnIcon, to: "/sales" },
    { id: "team", label: "Team", icon: UsersIcon, to: "/employees" },
    {
      id: "more",
      label: "More",
      icon: MoreHorizontalIcon,
      onClick: () => setMoreOpen(true),
    },
  ]

  const handleSignOut = async () => {
    await authClient.signOut()
    setMoreOpen(false)
    await navigate({ to: "/sign-in" })
  }

  return (
    <>
      <MobileTabBar tabs={tabs} activeTab={activeTab} />

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="right" className="flex flex-col gap-0 p-0">
          <SheetHeader className="border-b">
            <div className="flex items-center gap-3">
              <Avatar size="lg" className="bg-primary">
                <AvatarImage src={user.image ?? undefined} alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle>{user.name}</SheetTitle>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </SheetHeader>

          <ItemGroup className="gap-0 p-2">
            {MORE_NAV.map((item) => (
              <Item
                key={item.to}
                size="sm"
                render={
                  <Link to={item.to} onClick={() => setMoreOpen(false)} />
                }
              >
                <ItemMedia variant="icon">
                  <item.Icon />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{item.label}</ItemTitle>
                </ItemContent>
                <ChevronRightIcon className="size-4 text-muted-foreground" />
              </Item>
            ))}
          </ItemGroup>

          <div className="mt-auto border-t p-2">
            <Button
              type="button"
              variant="secondary"
              className="w-full justify-between"
              onClick={handleSignOut}
            >
              Log out
              <LogOutIcon />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
