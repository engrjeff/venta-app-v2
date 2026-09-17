import { Button } from "@/components/ui/button"
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
import { AttendanceStatusBadge } from "@/features/attendance/attendance-status-badge"
import { formatDurationFromSeconds, formatPHP, formatTime } from "@/lib/utils"
import { useLoaderData } from "@tanstack/react-router"
import { formatDate } from "date-fns"
import { SearchIcon } from "lucide-react"
import { calculateTimesheetTotals } from "./timesheet.utils"

export function TimesheetTable() {
  const { timesheets } = useLoaderData({
    from: "/_protected/timesheet",
  })

  if (timesheets.error) {
    return <p>An Error has occured</p>
  }

  const totals = calculateTimesheetTotals(timesheets.data ?? [])

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-md border bg-card">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Table className="h-full border-b">
          <TableHeader className="font-semibold">
            <TableRow className="bg-muted/50">
              <TableHead>Date</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead className="text-center">Time In</TableHead>
              <TableHead className="text-center">Time Out</TableHead>
              <TableHead className="text-center">Total Work Hours</TableHead>
              <TableHead className="text-center">Total Break Hours</TableHead>
              <TableHead className="text-center">Earnings</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!timesheets.data?.length ? (
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
                {timesheets.data.map((attendance) => {
                  // const remark = attendance.timeIn
                  //   ? getAttendanceRemark(
                  //       attendance.timeIn,
                  //       employee.branches[0].branch.scheduleStartTime
                  //     )
                  //   : null
                  return (
                    <TableRow
                      key={attendance.id}
                      className="hover:bg-transparent"
                    >
                      <TableCell>
                        {formatDate(attendance.date, "EE, MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>
                            {attendance.attendanceSnapshot?.employeeLastName},{" "}
                            {attendance.attendanceSnapshot?.employeeFirstName}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {attendance.attendanceSnapshot?.designationName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p>{attendance.attendanceSnapshot?.branchName}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-mono">
                          {attendance.timeIn
                            ? formatTime(attendance.timeIn)
                            : "--"}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        {attendance.timeOut ? (
                          <p className="font-mono">
                            {formatTime(attendance.timeOut)}
                          </p>
                        ) : (
                          <AttendanceStatusBadge
                            status={attendance.status}
                            date={attendance.date}
                          />
                        )}
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {formatDurationFromSeconds(
                          attendance.totalWorkedSeconds
                        )}
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {formatDurationFromSeconds(
                          attendance.totalBreakSeconds
                        )}
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {attendance.totalPay != null
                          ? formatPHP(attendance.totalPay)
                          : "--"}
                      </TableCell>
                    </TableRow>
                  )
                })}
                <TableRow className="bg-muted/50">
                  <TableCell
                    colSpan={5}
                    className="border-r text-right font-semibold"
                  >
                    Total
                  </TableCell>
                  <TableCell colSpan={1} className="text-center">
                    <span className="text-center font-mono font-semibold text-emerald-500">
                      {formatDurationFromSeconds(totals.workHours * 3600)}
                    </span>
                  </TableCell>
                  <TableCell colSpan={1} className="text-center">
                    <span className="text-center font-mono font-semibold text-emerald-500">
                      {formatDurationFromSeconds(totals.breakHours * 3600)}
                    </span>
                  </TableCell>
                  <TableCell colSpan={1} className="text-center">
                    <span className="text-center font-mono font-semibold text-emerald-500">
                      {formatPHP(totals.earnings)}
                    </span>
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between border-t px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {timesheets.data?.length ?? 0} of {timesheets.data?.length ?? 0} rows
        </p>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm">
            Previous
          </Button>
          <Button type="button" variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
