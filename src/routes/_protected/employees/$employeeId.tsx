import { getThisWeekRange } from "@/components/date-range-filter/presets"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { attendanceApi } from "@/features/attendance/attendance.functions"
import { EmployeeAttendanceTab } from "@/features/employees/employee-attendance-tab"
import { EmployeeCurrentShiftCard } from "@/features/employees/employee-current-shift-card"
import { EmployeeDetailHeader } from "@/features/employees/employee-detail-header"
import { EmployeeMobileScreen } from "@/features/employees/employee-mobile-screen"
import { EmployeeProfileCard } from "@/features/employees/employee-profile-card"
import { EmployeeRequestsTab } from "@/features/employees/employee-requests-tab"
import { EmployeeStatCards } from "@/features/employees/employee-stat-cards"
import { employeesApi } from "@/features/employees/employees.functions"
import { requestsApi } from "@/features/requests/requests.functions"
import { calculateTimesheetTotals } from "@/features/timesheet/timesheet.utils"
import {
  AttendanceRequestStatus,
  AttendanceStatus,
} from "@/generated/prisma/enums"
import { generatePageTitle } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"
import { format } from "date-fns"
import { useState } from "react"
import z from "zod"

const employeeDetailSearchSchema = z.object({
  start: z.iso.date().optional(),
  end: z.iso.date().optional(),
})

export const Route = createFileRoute("/_protected/employees/$employeeId")({
  validateSearch: employeeDetailSearchSchema,
  loaderDeps: ({ search: { start, end } }) => ({ start, end }),
  loader: async ({ params, deps: { start, end } }) => {
    const thisWeek = getThisWeekRange()
    const thisWeekStart = thisWeek.from
      ? format(thisWeek.from, "yyyy-MM-dd")
      : undefined
    const thisWeekEnd = thisWeek.to
      ? format(thisWeek.to, "yyyy-MM-dd")
      : undefined

    const [
      employee,
      activeAttendance,
      weekAttendance,
      attendanceHistory,
      requests,
    ] = await Promise.all([
      employeesApi.getById({ data: { employeeId: params.employeeId } }),
      attendanceApi.getActiveByEmployeeId({
        data: { employeeId: params.employeeId },
      }),
      attendanceApi.getHistoryByEmployee({
        data: {
          employeeId: params.employeeId,
          start: thisWeekStart,
          end: thisWeekEnd,
        },
      }),
      attendanceApi.getHistoryByEmployee({
        data: { employeeId: params.employeeId, start, end },
      }),
      requestsApi.getByEmployeeFn({ data: { employeeId: params.employeeId } }),
    ])

    return {
      employee,
      activeAttendance,
      weekAttendance,
      attendanceHistory,
      requests,
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.employee.data
          ? generatePageTitle(
              `${loaderData.employee.data.firstName} ${loaderData.employee.data.lastName}`
            )
          : generatePageTitle("Employee"),
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { employee, activeAttendance, weekAttendance, requests } =
    Route.useLoaderData()

  const [tab, setTab] = useState<"attendance" | "requests">("attendance")

  if (employee.error || !employee.data) return <div>Employee not found</div>

  const isCurrentlyActive =
    activeAttendance.data?.status === AttendanceStatus.WORKING ||
    activeAttendance.data?.status === AttendanceStatus.ON_BREAK

  const weekTotals = calculateTimesheetTotals(weekAttendance.data ?? [])
  const overtimeShiftCount = (weekAttendance.data ?? []).filter(
    (attendance) => attendance.overtimeSeconds > 0
  ).length

  const thisWeek = getThisWeekRange()
  const weekRangeLabel =
    thisWeek.from && thisWeek.to
      ? `${format(thisWeek.from, "MMM d")} – ${format(thisWeek.to, "MMM d")}`
      : ""

  const pendingRequestsCount = (requests.data ?? []).filter(
    (request) => request.status === AttendanceRequestStatus.PENDING
  ).length

  return (
    <>
      {/* desktop screen */}
      <div className="hidden min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-6 md:flex">
        <EmployeeDetailHeader employee={employee.data} />

        <div className="grid grid-cols-12 gap-6 px-6">
          <div className="col-span-4 flex flex-col gap-4">
            <EmployeeProfileCard
              employee={employee.data}
              activeAttendanceStatus={
                isCurrentlyActive
                  ? (activeAttendance.data?.status ?? null)
                  : null
              }
            />

            <EmployeeCurrentShiftCard attendance={activeAttendance.data} />
          </div>

          <div className="col-span-8 flex flex-col gap-4">
            <EmployeeStatCards
              totals={weekTotals}
              overtimeShiftCount={overtimeShiftCount}
              weekRangeLabel={weekRangeLabel}
            />

            <Tabs
              value={tab}
              onValueChange={(value) => setTab(value as typeof tab)}
              className="gap-4"
            >
              <TabsList>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="requests">
                  Requests
                  {pendingRequestsCount > 0 ? (
                    <Badge>{pendingRequestsCount}</Badge>
                  ) : null}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="attendance">
                <EmployeeAttendanceTab />
              </TabsContent>
              <TabsContent value="requests">
                <EmployeeRequestsTab requests={requests.data ?? []} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* mobile screen */}
      <div className="md:hidden">
        <EmployeeMobileScreen
          employee={employee.data}
          activeAttendanceStatus={
            isCurrentlyActive ? (activeAttendance.data?.status ?? null) : null
          }
          hoursThisWeekSeconds={weekTotals.workHours * 3600}
          earnings={weekTotals.earnings}
          pendingRequestsCount={pendingRequestsCount}
        />
      </div>
    </>
  )
}
