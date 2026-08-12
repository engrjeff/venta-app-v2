import { employeesApi } from "@/features/employees/employees.functions"
import { EmployeeList } from "@/features/timesheet/employee-list"
import { generatePageTitle } from "@/lib/utils"
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/timesheet")({
  head: () => ({
    meta: [{ title: generatePageTitle("Timesheet") }],
  }),
  loader: async ({ context }) => {
    const storeId = context.activeStoreId

    if (!storeId) {
      return { employees: { data: [], error: "Store ID not found" } }
    }

    const employees = await employeesApi.getAll({ data: { storeId } })

    return { employees }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { employees } = Route.useLoaderData()

  if (employees.data?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-md border p-4">
        <p className="text-muted-foreground">No Employees</p>
      </div>
    )
  }

  return (
    <div className="grid h-full grid-cols-12 grid-rows-[1fr] gap-4 p-4">
      <aside className="col-span-3 min-h-0">
        <EmployeeList employees={employees.data ?? []} />
      </aside>
      <div className="col-span-9 min-h-0">
        <Outlet />
      </div>
    </div>
  )
}
