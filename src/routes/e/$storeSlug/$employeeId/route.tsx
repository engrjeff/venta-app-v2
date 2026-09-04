import { AppLogo } from "@/components/app-logo"
import { siteConfig } from "@/config/site"
import { attendanceApi } from "@/features/attendance/attendance.functions"
import { EmployeePortalBottomNav } from "@/features/employees/employee-portal-bottom-nav"
import { employeesApi } from "@/features/employees/employees.functions"
import { generatePageTitle } from "@/lib/utils"
import {
  createFileRoute,
  Outlet,
  redirect,
  useLoaderData,
} from "@tanstack/react-router"

export const Route = createFileRoute("/e/$storeSlug/$employeeId")({
  loader: async ({ context, params }) => {
    if (!context.employee?.employeeId) {
      await employeesApi.clearSession()

      throw redirect({
        to: "/e/$storeSlug",
        params: { storeSlug: params.storeSlug },
      })
    }

    const { employeeId } = context.employee

    // a session created right after logging in (before ever clocking in)
    // has no attendanceId yet - check the db in case it's just stale
    let attendanceId = context.employee.attendanceId

    if (!attendanceId) {
      const activeByEmployee = await attendanceApi.getActiveByEmployeeId({
        data: { employeeId },
      })

      if (activeByEmployee.data?.timeIn) {
        await employeesApi.updateSession({
          data: {
            attendanceId: activeByEmployee.data.id,
            branchId: activeByEmployee.data.branchId,
            branchName: activeByEmployee.data.branch.name,
            timeIn: activeByEmployee.data.timeIn.toISOString(),
          },
        })

        attendanceId = activeByEmployee.data.id
      }
    }

    if (!attendanceId) {
      return { activeAttendance: null }
    }

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

    return { activeAttendance: result.data }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.activeAttendance
          ? generatePageTitle(
              `${loaderData.activeAttendance.employee?.lastName}, ${loaderData.activeAttendance.employee?.firstName}`
            )
          : "",
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const employee = useLoaderData({ from: "/e/$storeSlug" })

  return (
    <div className="py-20">
      <div className="w-full text-left">
        <h1 className="text-xl font-semibold lg:text-2xl">
          {employee?.organization.name} Employee Portal
        </h1>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          Powered by{" "}
          <span className="inline-flex items-center gap-1">
            <AppLogo size={16} /> {siteConfig.title}
          </span>
        </p>
      </div>
      <div className="w-full space-y-6 py-6 lg:py-10">
        <Outlet />
      </div>

      <EmployeePortalBottomNav />
    </div>
  )
}
