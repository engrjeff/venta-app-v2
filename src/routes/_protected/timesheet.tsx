import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { employeesApi } from "@/features/employees/employees.functions"
import { storeApi } from "@/features/store/store.functions"
import { timesheetQueryOptionsSchema } from "@/features/timesheet/schema"
import { TimesheetFilters } from "@/features/timesheet/timesheet-filters"
import { TimesheetMobileScreen } from "@/features/timesheet/timesheet-mobile-screen"
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
    <div className="flex h-full flex-col space-y-4 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ClockIcon className="size-4" />{" "}
          <h1 className="font-semibold">Timesheet</h1>
        </div>
      </div>
      <Card size="sm" className="h-full flex-1 rounded-md">
        <CardHeader className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>
              <Skeleton className="h-8 w-36" />
            </CardTitle>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-32" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center justify-center">
          <Skeleton className="size-full" />
        </CardContent>
      </Card>
    </div>
  ),
})

function RouteComponent() {
  return (
    <>
      {/* desktop page header */}
      <PageHeader className="hidden md:flex">
        <PageHeader.Heading>
          <PageHeader.Title>Timesheet</PageHeader.Title>
        </PageHeader.Heading>
        <PageHeader.Actions>
          <Button size="sm" variant="outline">
            Export CSV
          </Button>
        </PageHeader.Actions>
      </PageHeader>
      <div className="hidden min-h-0 flex-1 flex-col gap-4 pb-4 md:flex">
        {/* timesheet filters */}
        <TimesheetFilters />
        {/* timesheet table*/}
        <div className="min-h-0 flex-1 overflow-y-auto px-6">
          <TimesheetTable />
        </div>
      </div>

      {/* mobile screen */}
      <div className="min-h-0 flex-1 overflow-y-auto md:hidden">
        <TimesheetMobileScreen />
      </div>
    </>
  )
}
