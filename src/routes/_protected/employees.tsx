import { AddEmployeeDialog } from "@/features/employees/add-employee-dialog"
import { EmployeesTable } from "@/features/employees/employees-table"
import { employeesApi } from "@/features/employees/employees.functions"
import { getEmployeesInputSchema } from "@/features/employees/schema"
import { generatePageTitle } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"
import { UsersIcon } from "lucide-react"

export const Route = createFileRoute("/_protected/employees")({
  head: () => ({
    meta: [{ title: generatePageTitle("Employees") }],
  }),
  validateSearch: getEmployeesInputSchema.omit({ storeId: true }),
  loaderDeps: ({ search: { q } }) => ({ q }),
  loader: async ({ context, deps: { q } }) => {
    if (!context.activeStoreId) return null

    const employees = await employeesApi.getAll({
      data: { storeId: context.activeStoreId, q },
    })

    return employees
  },
  component: RouteComponent,
})

function RouteComponent() {
  const loader = Route.useLoaderData()

  return (
    <div className="flex h-full flex-col space-y-4">
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
