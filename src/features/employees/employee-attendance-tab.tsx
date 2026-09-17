import { DateRangeFilter } from "@/components/date-range-filter/date-range-filter"
import { getThisWeekRange } from "@/components/date-range-filter/presets"
import {
  rangeToSearch,
  searchToRange,
} from "@/components/date-range-filter/utils"
import {
  Card,
  CardAction,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AttendanceShiftBadge,
  AttendanceShiftBar,
  isAttendanceUnresolved,
} from "@/features/attendance/attendance-shift"
import { calculateTimesheetTotals } from "@/features/timesheet/timesheet.utils"
import { formatDurationFromSeconds, formatPHP, formatTime } from "@/lib/utils"
import { useLoaderData, useNavigate, useSearch } from "@tanstack/react-router"
import { formatDate } from "date-fns"
import { SearchIcon } from "lucide-react"

export function EmployeeAttendanceTab() {
  const { attendanceHistory } = useLoaderData({
    from: "/_protected/employees/$employeeId",
  })
  const search = useSearch({ from: "/_protected/employees/$employeeId" })
  const navigate = useNavigate({ from: "/employees/$employeeId" })

  const range = searchToRange(search) ?? getThisWeekRange()
  const records = attendanceHistory.data ?? []
  const totals = calculateTimesheetTotals(records)

  return (
    <Card size="sm" className="pb-0">
      <CardHeader className="gap-0">
        <CardTitle>Timesheet</CardTitle>
        <CardDescription>Attendance Logs</CardDescription>
        <CardAction>
          <DateRangeFilter
            value={range}
            onApply={(rangeQuery) =>
              navigate({
                search: (prev) => ({ ...prev, ...rangeToSearch(rangeQuery) }),
              })
            }
          />
        </CardAction>
      </CardHeader>

      <CardContent className="border-t p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 font-semibold">
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Time in</TableHead>
              <TableHead className="text-center">Time out</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead className="text-center">Hours</TableHead>
              <TableHead className="text-center">Earnings</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow className="pointer-events-none">
                <TableCell colSpan={6}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon" className="size-4">
                        <SearchIcon className="size-4" />
                      </EmptyMedia>
                      <EmptyDescription>
                        No attendance records for this range
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {records.map((attendance) => (
                  <TableRow key={attendance.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {formatDate(attendance.date, "EEE, MMM dd")}
                        </span>
                        <AttendanceShiftBadge attendance={attendance} />
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {attendance.timeIn ? formatTime(attendance.timeIn) : "--"}
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {attendance.timeOut ? (
                        formatTime(attendance.timeOut)
                      ) : isAttendanceUnresolved(attendance) ? (
                        <span className="text-destructive">missing</span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="min-w-40">
                      <AttendanceShiftBar attendance={attendance} />
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {formatDurationFromSeconds(attendance.totalWorkedSeconds)}
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {attendance.totalPay != null
                        ? formatPHP(attendance.totalPay)
                        : "--"}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableCell
                    colSpan={4}
                    className="border-r text-right font-semibold"
                  >
                    Total
                  </TableCell>
                  <TableCell className="text-center font-mono font-semibold">
                    {formatDurationFromSeconds(totals.workHours * 3600)}
                  </TableCell>
                  <TableCell className="text-center font-mono font-semibold">
                    {formatPHP(totals.earnings)}
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
