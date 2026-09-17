import { PageHeader } from "@/components/page-header"
import { AddEmployeeDialog } from "@/features/employees/add-employee-dialog"
import { EmployeesFilters } from "@/features/employees/employees-filters"
import { EmployeesMobileScreen } from "@/features/employees/employees-mobile-screen"
import { EmployeesTable } from "@/features/employees/employees-table"
import { employeesApi } from "@/features/employees/employees.functions"
import { getEmployeesInputSchema } from "@/features/employees/schema"
import { storeApi } from "@/features/store/store.functions"
import { generatePageTitle } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/employees/")({
  head: () => ({
    meta: [{ title: generatePageTitle("Employees") }],
  }),
  validateSearch: getEmployeesInputSchema.omit({ storeId: true }),
  loaderDeps: ({ search: { q, branches, designations } }) => ({
    q,
    branches,
    designations,
  }),
  loader: async ({ context, deps: { q, branches, designations } }) => {
    if (!context.activeStoreId) return null

    const [employees, storeOptions] = await Promise.all([
      employeesApi.getAll({
        data: { storeId: context.activeStoreId, q, branches, designations },
      }),
      storeApi.getFieldOptions({ data: { id: context.activeStoreId } }),
    ])

    return {
      ...employees,
      branches: storeOptions.data?.branches ?? [],
      designations: storeOptions.data?.designations ?? [],
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const employees = Route.useLoaderData()

  if (employees?.error) return <div>Error</div>

  return (
    <>
      {/* desktop page header */}
      <PageHeader className="hidden md:flex">
        <PageHeader.Heading>
          <PageHeader.Title>Employees</PageHeader.Title>
        </PageHeader.Heading>
        <PageHeader.Actions>
          <AddEmployeeDialog />
        </PageHeader.Actions>
      </PageHeader>
      <div className="hidden min-h-0 flex-1 flex-col gap-4 pb-4 md:flex">
        {/* employees filters */}
        <EmployeesFilters />
        {/* employees table */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6">
          <EmployeesTable employees={employees?.data ?? []} />
        </div>
      </div>

      {/* mobile screen */}
      <div className="min-h-0 flex-1 overflow-y-auto md:hidden">
        <EmployeesMobileScreen employees={employees?.data ?? []} />
      </div>
    </>
  )
}
