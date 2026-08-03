import { AppLogo } from "@/components/app-logo"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { siteConfig } from "@/config/site"
import { attendanceApi } from "@/features/attendance/attendance.functions"
import { WorkHours } from "@/features/attendance/work-hours"
import { EmployeeMenu } from "@/features/employees/employee-menu"
import { employeesApi } from "@/features/employees/employees.functions"
import { formatScheduleTimeRange, generatePageTitle } from "@/lib/utils"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { ClockIcon, ListIcon } from "lucide-react"

export const Route = createFileRoute("/e/$storeSlug/$employeeId")({
  beforeLoad: async (context) => {
    const employeeSession = await employeesApi.getSession()

    if (!employeeSession.data?.attendanceId) {
      throw redirect({
        to: "/e/$storeSlug",
        params: {
          storeSlug: context.params.storeSlug,
        },
        replace: true,
      })
    }
  },
  loader: async ({ context, params }) => {
    if (!context.employee?.employeeId) {
      await employeesApi.clearSession()

      throw redirect({
        to: "/e/$storeSlug",
        params: { storeSlug: params.storeSlug },
      })
    }

    if (!context.employee.attendanceId) {
      await employeesApi.clearSession()

      throw redirect({
        to: "/e/$storeSlug",
        params: { storeSlug: params.storeSlug },
      })
    }

    const { employeeId, attendanceId } = context.employee

    const result = await attendanceApi.getActive({
      data: { attendanceId, employeeId },
    })

    if (!result.data?.id) {
      await employeesApi.clearSession()

      throw redirect({
        to: "/e/$storeSlug",
        params: { storeSlug: params.storeSlug },
      })
    }

    return result.data
  },
  head: ({ loaderData }) => ({
    meta: [{ title: generatePageTitle(loaderData?.employee?.firstName ?? "") }],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const data = Route.useLoaderData()

  const { organization: store, employee, branch, ...serverAttendance } = data

  const { formatted: branchSchedule } = formatScheduleTimeRange(
    branch.scheduleStartTime,
    branch.scheduleEndTime
  )

  return (
    <>
      <div className="w-full text-left">
        <h1 className="text-2xl font-semibold">{store.name} Employee Portal</h1>
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
              {employee.designation.name} @ {store.name} {branch.name}
            </p>
          </div>
          <EmployeeMenu />
        </div>

        {/* Branch - Schedule */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <ClockIcon className="size-3" />
          <p className="text-xs">Schedule: {branchSchedule}</p>
        </div>

        {/* work hours */}
        <WorkHours branch={branch} serverAttendance={serverAttendance} />

        <Empty className="hidden border border-dashed">
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
