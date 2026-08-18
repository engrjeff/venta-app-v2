import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { employeesApi } from "@/features/employees/employees.functions"
import { storeApi } from "@/features/store/store.functions"
import { timesheetQueryOptionsSchema } from "@/features/timesheet/schema"
import { TimesheetList } from "@/features/timesheet/timesheet-list"
import { TimesheetTable } from "@/features/timesheet/timesheet-table"
import { timesheetApi } from "@/features/timesheet/timesheet.functions"
import { generatePageTitle } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"
import { ClockIcon } from "lucide-react"

export const Route = createFileRoute("/_protected/timesheet")({
  head: () => ({
    meta: [{ title: generatePageTitle("Timesheet") }],
  }),
  validateSearch: timesheetQueryOptionsSchema.omit({ storeId: true }),
  loaderDeps: ({
    search: { employees, branches, designations, start, end },
  }) => ({
    employees,
    branches,
    designations,
    start,
    end,
  }),
  loader: async ({
    context,
    deps: { employees, branches, designations, start, end },
  }) => {
    const [timesheets, employeeList, storeOptions] = await Promise.all([
      timesheetApi.getMany({
        data: {
          storeId: context.activeStoreId,
          employees,
          branches,
          designations,
          start,
          end,
        },
      }),
      employeesApi.getAll({ data: { storeId: context.activeStoreId } }),
      storeApi.getFieldOptions({ data: { id: context.activeStoreId } }),
    ])

    return {
      timesheets,
      employees: employeeList.data ?? [],
      branches: storeOptions.data?.branches ?? [],
      designations: storeOptions.data?.designations ?? [],
    }
  },
  component: RouteComponent,
  pendingComponent: () => (
    <Card size="sm" className="h-full flex-1 rounded-md">
      <CardHeader className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle>
            <Skeleton className="h-4 w-36" />
          </CardTitle>
          <CardDescription className="text-xs">
            <Skeleton className="h-3 w-40" />
          </CardDescription>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center">
        <Skeleton className="size-full" />
      </CardContent>
    </Card>
  ),
})

function RouteComponent() {
  return (
    <div className="flex h-full flex-col space-y-4 p-4">
      {/* page header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ClockIcon className="size-4" />{" "}
          <h1 className="font-semibold">Timesheet</h1>
        </div>
      </div>
      {/* content on mobile */}
      <TimesheetList />
      {/* content on desktop */}
      <TimesheetTable />
    </div>
  )
}
