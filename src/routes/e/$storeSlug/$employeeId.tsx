import { AppLogo } from "@/components/app-logo"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { siteConfig } from "@/config/site"
import { EmployeeMenu } from "@/features/employees/employee-menu"
import { employeesApi } from "@/features/employees/employees.functions"
import { WorkHours } from "@/features/employees/work-hours"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { ListIcon } from "lucide-react"

export const Route = createFileRoute("/e/$storeSlug/$employeeId")({
  beforeLoad: async (context) => {
    const employeeSession = await employeesApi.getSession()

    if (!employeeSession?.data?.attendanceId) {
      throw redirect({
        to: "/e/$storeSlug",
        params: {
          storeSlug: context.params.storeSlug,
        },
        replace: true,
      })
    }
  },
  loader: async ({ context }) => {
    if (!context.employee?.employeeId) return null

    const result = await employeesApi.getById({
      data: { employeeId: context.employee?.employeeId },
    })

    return result.data
  },
  component: RouteComponent,
})

function RouteComponent() {
  const employee = Route.useLoaderData()

  const context = Route.useRouteContext()

  if (!employee) return null

  return (
    <>
      <div className="w-full text-left">
        <h1 className="text-2xl font-semibold">
          {employee.organization.name} Employee Portal
        </h1>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          Powered by{" "}
          <span className="inline-flex items-center gap-1">
            <AppLogo size={16} /> {siteConfig.title}
          </span>
        </p>
      </div>
      <div className="w-full space-y-6 py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">
              Hi, {employee.firstName} 👋
            </h2>
            <p className="text-xs text-muted-foreground">
              {employee.designation.name} @ {employee.organization.name}
            </p>
          </div>
          <EmployeeMenu />
        </div>

        {/* work hours */}
        {context.employee?.timeInString && (
          <WorkHours timeInString={context.employee?.timeInString} />
        )}

        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ListIcon />
            </EmptyMedia>
            <EmptyTitle>No attendance logs yet</EmptyTitle>
            <EmptyDescription>
              Attendance logs will appear here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    </>
  )
}
