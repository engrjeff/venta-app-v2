import { employeesApi } from "@/features/employees/employees.functions"
import { Outlet, createFileRoute } from "@tanstack/react-router"

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
    <main className="container mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4">
      <Outlet />
    </main>
  )
}
