import { DateRangeFilter } from "@/components/date-range-filter/date-range-filter"
import { getThisWeekRange } from "@/components/date-range-filter/presets"
import {
  rangeToSearch,
  searchToRange,
} from "@/components/date-range-filter/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { attendanceApi } from "@/features/attendance/attendance.functions"
import {
  calculatePay,
  getAttendanceRemark,
} from "@/features/timesheet/timesheet.utils"
import { formatPHP, formatTime } from "@/lib/utils"
import { createFileRoute, notFound } from "@tanstack/react-router"

import { endOfWeek, format, formatDate, startOfWeek } from "date-fns"
import { SearchIcon } from "lucide-react"
import { z } from "zod"

const today = new Date()

const timesheetSearchSchema = z.object({
  start: z.iso
    .date()
    .optional()
    .catch(format(startOfWeek(today), "yyyy-MM-dd")),
  end: z.iso
    .date()
    .optional()
    .catch(format(endOfWeek(today), "yyyy-MM-dd")),
})

export const Route = createFileRoute("/_protected/timesheet/$employeeId")({
  validateSearch: timesheetSearchSchema,
  loaderDeps: ({ search: { start, end } }) => ({ start, end }),
  loader: async ({ params, deps: { start, end } }) => {
    const employeeId = params.employeeId

    if (!employeeId) {
      return { data: null, error: "Employee ID not found" }
    }

    const employeeWithAttendance = await attendanceApi.getRecordsByEmployee({
      data: { employeeId, start, end },
    })

    if (!employeeWithAttendance.data) {
      throw notFound({ data: { message: "Employee not found" } })
    }

    return employeeWithAttendance
  },
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
  component: RouteComponent,
})

function RouteComponent() {
  const search = Route.useSearch()
  const employeeWithAttendance = Route.useLoaderData()
  const navigate = Route.useNavigate()

  if (!employeeWithAttendance.data) {
    return null
  }

  const employee = employeeWithAttendance.data

  const totals = employee.attendance.reduce<{
    workHours: number
    breakHours: number
    earnings: number
  }>(
    (acc, attendance) => {
      const payData = calculatePay(
        attendance.totalWorkedSeconds,
        employee.designation.salaryRate,
        employee.designation.salaryType
      )

      const breakHours = attendance.totalBreakSeconds / 3600

      return {
        workHours: acc.workHours + payData.time.workedHours,
        breakHours: acc.breakHours + breakHours,
        earnings: acc.earnings + payData.pay.regular,
      }
    },
    {
      workHours: 0,
      breakHours: 0,
      earnings: 0,
    }
  )

  const range = searchToRange(search) ?? getThisWeekRange()

  return (
    <Card size="sm" className="h-full flex-1 rounded-md pb-0">
      <CardHeader className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle>
            Timesheet for {employee.lastName}, {employee.firstName}
          </CardTitle>
          <CardDescription className="text-xs">
            {employee.designation.name} &middot;{" "}
            <span className="font-mono">
              {formatPHP(employee.designation.salaryRate)}
            </span>{" "}
            {employee.designation.salaryType.toLowerCase()}
          </CardDescription>
        </div>
        <div className="flex items-center gap-4">
          <DateRangeFilter
            value={range}
            onApply={(rangeQuery) => {
              navigate({
                search: (prev) => ({
                  ...prev,
                  ...rangeToSearch(rangeQuery),
                }),
              })
            }}
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-0">
        <Table className="h-full border-t">
          <TableHeader className="font-semibold">
            <TableRow className="bg-muted/50">
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Time In</TableHead>
              <TableHead className="text-center">Time Out</TableHead>
              <TableHead className="text-center">Total Work Hours</TableHead>
              <TableHead className="text-center">Total Break Hours</TableHead>
              <TableHead className="text-center">Earnings</TableHead>
              <TableHead className="text-center">Remarks</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employee?.attendance.length === 0 ? (
              <TableRow className="pointer-events-none">
                <TableCell colSpan={8}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon" className="size-4">
                        <SearchIcon size={16} className="size-4" />
                      </EmptyMedia>
                      <EmptyDescription>No records to show</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {employee?.attendance.map((attendance) => {
                  const payData = calculatePay(
                    attendance.totalWorkedSeconds,
                    employee.designation.salaryRate,
                    employee.designation.salaryType
                  )

                  const remark = attendance.timeIn
                    ? getAttendanceRemark(
                        attendance.timeIn,
                        employee.branches[0].branch.scheduleStartTime
                      )
                    : null
                  return (
                    <TableRow
                      key={attendance.id}
                      className="hover:bg-transparent"
                    >
                      <TableCell>
                        {formatDate(attendance.date, "EE, MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-mono">
                          {attendance.timeIn
                            ? formatTime(attendance.timeIn)
                            : "--"}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-mono">
                          {attendance.timeOut
                            ? formatTime(attendance.timeOut)
                            : "--"}
                        </p>
                      </TableCell>

                      <TableCell className="text-center font-mono">
                        {payData.time.workedHours.toFixed(2)}{" "}
                        <span className="text-xs text-muted-foreground">
                          hrs
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {(attendance.totalBreakSeconds / 3600).toFixed(2)}{" "}
                        <span className="text-xs text-muted-foreground">
                          hrs
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {formatPHP(payData.pay.total)}
                      </TableCell>
                      <TableCell className="text-center">
                        {remark ? (
                          <Badge variant={remark}>{remark}</Badge>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="link">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
                <TableRow className="bg-muted/50">
                  <TableCell
                    colSpan={3}
                    className="border-r text-right font-semibold"
                  >
                    Total
                  </TableCell>
                  <TableCell colSpan={1} className="text-center">
                    <span className="text-center font-mono font-semibold text-green-500">
                      {totals.workHours.toFixed(2)} hrs
                    </span>
                  </TableCell>
                  <TableCell colSpan={1} className="text-center">
                    <span className="text-center font-mono font-semibold text-green-500">
                      {totals.breakHours.toFixed(2)} hrs
                    </span>
                  </TableCell>
                  <TableCell colSpan={1} className="text-center">
                    <span className="text-center font-mono font-semibold text-green-500">
                      {formatPHP(totals.earnings)}
                    </span>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
