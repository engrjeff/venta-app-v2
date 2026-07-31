import { AddEmployeeDialog } from "@/features/employees/add-employee-dialog"
import { EmployeesTable } from "@/features/employees/employees-table"
import { employeesApi } from "@/features/employees/employees.functions"
import { generatePageTitle } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"
import { UsersIcon } from "lucide-react"

export const Route = createFileRoute("/_protected/employees")({
  head: () => ({
    meta: [{ title: generatePageTitle("Employees") }],
  }),
  loader: async ({ context }) => {
    if (!context.activeStoreId) return null

    const employees = await employeesApi.getAll({
      data: { id: context.activeStoreId },
    })

    return employees
  },
  component: RouteComponent,
})

function RouteComponent() {
  const loader = Route.useLoaderData()

  return (
    <div className="space-y-6">
      {/* page header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <UsersIcon className="size-4" />{" "}
          <h1 className="font-semibold">Employees</h1>
        </div>
        <div className="flex items-center gap-3">
          <AddEmployeeDialog />
        </div>
      </div>
      <EmployeesTable employees={loader?.data ?? []} />
    </div>
  )
}
