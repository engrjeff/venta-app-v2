import { AppLogo } from "@/components/app-logo"
import { Button } from "@/components/ui/button"
import { employeesApi } from "@/features/employees/employees.functions"
import { Link, Outlet, createFileRoute } from "@tanstack/react-router"
import { MenuIcon } from "lucide-react"

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
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-10 flex h-16 w-full items-center border-b bg-background px-4">
        <Link to="/">
          <AppLogo />
        </Link>
        <div className="ml-auto flex items-center">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <MenuIcon className="size-5" />
          </Button>
        </div>
      </header>
      <main className="container mx-auto w-full max-w-lg">
        <Outlet />
      </main>
    </>
  )
}
