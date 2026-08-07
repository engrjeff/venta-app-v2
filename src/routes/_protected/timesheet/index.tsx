import { employeesApi } from "@/features/employees/employees.functions"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/timesheet/")({
  loader: async ({ context }) => {
    const storeId = context.activeStoreId

    if (!storeId) {
      return { employees: { data: [], error: "Store ID not found" } }
    }

    const employees = await employeesApi.getAll({ data: { storeId } })

    if (employees.data?.[0]) {
      throw redirect({
        to: "/timesheet/$employeeId",
        params: { employeeId: employees.data[0].id },
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <></>
}
