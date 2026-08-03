import { timesheetQueryOptionsSchema } from "@/features/timesheet/schema"
import { timesheetApi } from "@/features/timesheet/timesheet.functions"
import { formatPHP, formatTime, generatePageTitle } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"
import { FileClockIcon } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  calculatePay,
  getAttendanceRemark,
} from "@/features/timesheet/timesheet.utils"
import { formatDate } from "date-fns"

export const Route = createFileRoute("/_protected/timesheet")({
  head: () => ({
    meta: [{ title: generatePageTitle("Timesheet") }],
  }),
  validateSearch: (search) =>
    timesheetQueryOptionsSchema.omit({ storeId: true }).parse(search),
  loader: async ({ context }) => {
    const storeId = context.activeStoreId

    if (!storeId) return null

    const timesheet = await timesheetApi.getMany({ data: { storeId } })

    return timesheet
  },
  component: RouteComponent,
})

function RouteComponent() {
  const timesheet = Route.useLoaderData()

  return (
    <div className="space-y-6">
      {/* page header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileClockIcon className="size-4" />{" "}
          <h1 className="font-semibold">Timesheet</h1>
        </div>
      </div>
      {/* filters */}
      <div>Filters here</div>
      {/* table */}
      {timesheet?.data?.map((employee) => (
        <div key={employee.id} className="rounded-md border">
          <Table>
            <TableHeader className="font-semibold">
              <TableRow className="bg-muted/40">
                <TableHead colSpan={3}>
                  Employee: {employee.lastName}, {employee.firstName}
                </TableHead>
                <TableHead colSpan={2}>
                  Designation: {employee.designation.name}
                </TableHead>
                <TableHead colSpan={2}>
                  Rate:{" "}
                  <span className="font-mono">
                    {formatPHP(employee.designation.salaryRate)}
                  </span>{" "}
                  <span className="text-xs text-muted-foreground">
                    {employee.designation.salaryType.toLowerCase()}
                  </span>
                </TableHead>
              </TableRow>
              <TableRow className="bg-muted/50">
                <TableHead>Date</TableHead>
                <TableHead>Time In</TableHead>
                <TableHead>Time Out</TableHead>
                <TableHead className="text-center">Break Hours</TableHead>
                <TableHead className="text-center">Worked Hours</TableHead>
                <TableHead className="text-center">Pay</TableHead>
                <TableHead>Remark</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employee.attendance.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="flex flex-col items-center justify-center p-4">
                      <p className="text-muted-foreground">No Data</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                employee.attendance.map((attendance) => {
                  const payData = calculatePay(
                    attendance.totalWorkedSeconds,
                    employee.designation.salaryRate,
                    employee.designation.salaryType
                  )

                  return (
                    <TableRow>
                      <TableCell>
                        {formatDate(attendance.date, "EE, MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        {attendance.timeIn
                          ? formatTime(attendance.timeIn)
                          : null}
                      </TableCell>
                      <TableCell>
                        {attendance.timeOut
                          ? formatTime(attendance.timeOut)
                          : null}
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {(attendance.totalBreakSeconds / 3600).toFixed(2)}{" "}
                        <span className="text-xs text-muted-foreground">
                          hours
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {payData.time.workedHours.toFixed(2)}{" "}
                        <span className="text-xs text-muted-foreground">
                          hours
                        </span>
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {formatPHP(payData.pay.total)}
                      </TableCell>
                      <TableCell>
                        {attendance.timeIn ? (
                          <span>
                            {getAttendanceRemark(
                              attendance.timeIn,
                              employee.branches[0].branch.scheduleStartTime
                            )}
                          </span>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  )
}
