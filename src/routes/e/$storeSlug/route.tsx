import { AppLogo } from "@/components/app-logo"
import { Button } from "@/components/ui/button"
import { employeesApi } from "@/features/employees/employees.functions"
import { Link, Outlet, createFileRoute } from "@tanstack/react-router"
import { MenuIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

export const Route = createFileRoute("/e/$storeSlug")({
  beforeLoad: async () => {
    const employeeSession = await employeesApi.getSession()

    return {
      employee: employeeSession.data,
    }
  },
  loader: async ({ context }) => {
    if (!context.employee?.employeeId) return null

    const result = await employeesApi.getById({
      data: { employeeId: context.employee.employeeId },
    })

    return result.data
  },
  component: RouteComponent,
})

function RouteComponent() {
  const employee = Route.useLoaderData()

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-10 h-16 w-full border-b bg-background px-4">
        <div className="container mx-auto flex h-full max-w-lg items-center">
          {employee ? (
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary font-bold text-primary-foreground">
                  {getInitials(employee.firstName, employee.lastName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-sm font-bold">
                  {employee.firstName} {employee.lastName}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {employee.designation.name} &bull;{" "}
                  {employee.organization.name}
                </p>
              </div>
            </div>
          ) : (
            <Link to="/">
              <AppLogo />
            </Link>
          )}
          <div className="ml-auto flex items-center">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <MenuIcon className="size-5" />
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto h-screen min-h-screen w-full max-w-lg px-4">
        <Outlet />
      </main>
    </>
  )
}
