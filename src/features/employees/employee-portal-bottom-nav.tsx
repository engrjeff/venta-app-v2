import {
  Link,
  useLoaderData,
  useParams,
  useRouter,
} from "@tanstack/react-router"
import {
  ChartNoAxesColumnIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardListIcon,
  FileTextIcon,
  HomeIcon,
  LogOutIcon,
  MoreHorizontalIcon,
  UserIcon,
} from "lucide-react"
import { useState } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn, getInitials } from "@/lib/utils"
import { useEmployeeSession } from "./use-employee-session"

const navItems = [
  {
    label: "Home",
    to: "/e/$storeSlug/$employeeId",
    icon: HomeIcon,
    exact: true,
    requiresActiveAttendance: false,
  },
  {
    label: "Daily Sales",
    to: "/e/$storeSlug/$employeeId/daily-sales",
    icon: ChartNoAxesColumnIcon,
    exact: false,
    requiresActiveAttendance: true,
  },
  {
    label: "Logs",
    to: "/e/$storeSlug/$employeeId/logs",
    icon: ClipboardListIcon,
    exact: false,
    requiresActiveAttendance: false,
  },
  {
    label: "Requests",
    to: "/e/$storeSlug/$employeeId/requests",
    icon: FileTextIcon,
    exact: false,
    requiresActiveAttendance: false,
  },
] as const

export function EmployeePortalBottomNav() {
  const [moreOpen, setMoreOpen] = useState(false)
  const [sheetView, setSheetView] = useState<"menu" | "profile">("menu")

  const params = useParams({ from: "/e/$storeSlug/$employeeId" })
  const { activeAttendance } = useLoaderData({
    from: "/e/$storeSlug/$employeeId",
  })
  const employee = useLoaderData({ from: "/e/$storeSlug" })
  const employeeSession = useEmployeeSession()
  const router = useRouter()

  if (!employee) return null

  const branchName =
    activeAttendance?.branch.name ?? employee.branches[0]?.branch.name

  const visibleNavItems = navItems.filter(
    (item) => !item.requiresActiveAttendance || activeAttendance
  )

  const handleOpenChange = (open: boolean) => {
    setMoreOpen(open)
    if (!open) {
      // reset to the menu view after the close transition finishes
      setTimeout(() => setSheetView("menu"), 200)
    }
  }

  const handleSignOut = async () => {
    await employeeSession.clear()
    setMoreOpen(false)
    await router.invalidate()
  }

  return (
    <>
      <nav
        aria-label="Employee portal navigation"
        className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/80 backdrop-blur-lg supports-backdrop-filter:bg-background/60"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex h-16 max-w-lg items-stretch justify-around">
          {visibleNavItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              params={params}
              activeOptions={{ exact: item.exact }}
              className="flex flex-1 flex-col items-center justify-center gap-1 outline-none active:scale-95"
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      "size-5 text-muted-foreground",
                      isActive && "text-primary"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[11px] font-medium text-muted-foreground",
                      isActive && "text-primary"
                    )}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </Link>
          ))}

          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="flex flex-1 flex-col items-center justify-center gap-1 outline-none active:scale-95"
          >
            <MoreHorizontalIcon className="size-5 text-muted-foreground" />
            <span className="text-[11px] font-medium text-muted-foreground">
              More
            </span>
          </button>
        </div>
      </nav>

      <Sheet open={moreOpen} onOpenChange={handleOpenChange}>
        <SheetContent side="right" className="flex flex-col gap-0 p-0">
          {sheetView === "menu" ? (
            <>
              <SheetHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar size="lg" className="bg-primary">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(employee.firstName, employee.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <SheetTitle>
                      {employee.firstName} {employee.lastName}
                    </SheetTitle>
                    <SheetDescription>
                      {employee.designation.name}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <ItemGroup className="gap-0 p-2">
                <Item
                  size="sm"
                  render={<button type="button" />}
                  onClick={() => setSheetView("profile")}
                >
                  <ItemMedia variant="icon">
                    <UserIcon />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>My Profile</ItemTitle>
                  </ItemContent>
                  <ChevronRightIcon className="size-4 text-muted-foreground" />
                </Item>
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
            </>
          ) : (
            <>
              <SheetHeader className="flex-row items-center gap-2 space-y-0 border-b">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Back"
                  onClick={() => setSheetView("menu")}
                >
                  <ChevronLeftIcon />
                </Button>
                <SheetTitle>My Profile</SheetTitle>
              </SheetHeader>

              <ItemGroup className="gap-0 p-2">
                <Item size="sm">
                  <ItemContent>
                    <ItemDescription>Name</ItemDescription>
                    <ItemTitle>
                      {employee.firstName} {employee.lastName}
                    </ItemTitle>
                  </ItemContent>
                </Item>
                <Item size="sm">
                  <ItemContent>
                    <ItemDescription>Designation</ItemDescription>
                    <ItemTitle>{employee.designation.name}</ItemTitle>
                  </ItemContent>
                </Item>
                <Item size="sm">
                  <ItemContent>
                    <ItemDescription>Branch</ItemDescription>
                    <ItemTitle>{branchName}</ItemTitle>
                  </ItemContent>
                </Item>
                <Item size="sm">
                  <ItemContent>
                    <ItemDescription>Organization</ItemDescription>
                    <ItemTitle>{employee.organization.name}</ItemTitle>
                  </ItemContent>
                </Item>
              </ItemGroup>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
