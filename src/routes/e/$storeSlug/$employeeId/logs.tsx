import { DateRangeFilter } from "@/components/date-range-filter/date-range-filter"
import { getThisWeekRange } from "@/components/date-range-filter/presets"
import {
  rangeToSearch,
  searchToRange,
} from "@/components/date-range-filter/utils"
import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { attendanceApi } from "@/features/attendance/attendance.functions"
import {
  calculatePay,
  getAttendanceRemark,
} from "@/features/timesheet/timesheet.utils"
import { AttendanceStatus } from "@/generated/prisma/enums"
import { formatPHP, formatTime } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"
import { formatDate } from "date-fns"
import { InboxIcon } from "lucide-react"
import z from "zod"

const logsSearchSchema = z.object({
  start: z.iso.date().optional(),
  end: z.iso.date().optional(),
})

export const Route = createFileRoute("/e/$storeSlug/$employeeId/logs")({
  component: RouteComponent,
  validateSearch: logsSearchSchema,
  loaderDeps: ({ search: { start, end } }) => ({ start, end }),
  loader: async ({ params, deps: { start, end } }) => {
    const logs = await attendanceApi.getRecordsByEmployee({
      data: {
        employeeId: params.employeeId,
        status: AttendanceStatus.CLOCKED_OUT,
        start,
        end,
      },
    })

    return logs
  },
})

function RouteComponent() {
  const loaderData = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  const range = searchToRange(search) ?? getThisWeekRange()

  if (loaderData.error) return <p>An error occured</p>

  if (!loaderData.data?.attendance?.length)
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <InboxIcon />
          </EmptyMedia>
          <EmptyTitle>No attendance logs yet</EmptyTitle>
          <EmptyDescription>Attendance logs will appear here.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )

  const { attendance: logs, designation } = loaderData.data

  return (
    <>
      <div>
        <div className="hidden items-center gap-4">
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
      </div>
      <ul className="space-y-3">
        {logs.map((log) => {
          const payData = calculatePay(
            log.totalWorkedSeconds,
            designation.salaryRate,
            designation.salaryType
          )

          const remark = log.timeIn
            ? getAttendanceRemark(log.timeIn, log.branch.scheduleStartTime)
            : null

          return (
            <li key={log.id}>
              <div
                data-remark={remark}
                className="space-y-2 rounded-md border-l-4 border-emerald-500 bg-card p-3 shadow data-[remark=LATE]:border-red-400"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">
                    {formatDate(log.date, "MMM dd, yyy")}
                  </span>
                  {remark && (
                    <Badge variant={remark}>
                      {remark.replaceAll("_", " ").toLowerCase()}
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-4 text-sm">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">
                      In
                    </span>
                    {log.timeIn && (
                      <span className="font-mono">
                        {formatTime(log.timeIn)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">
                      Out
                    </span>
                    {log.timeOut ? (
                      <span className="font-mono">
                        {formatTime(log.timeOut)}
                      </span>
                    ) : (
                      "--"
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">
                      Work Hrs
                    </span>
                    <span className="font-mono">
                      {payData.time.workedHours.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-semibold text-muted-foreground uppercase">
                      Pay
                    </span>
                    <span className="font-mono">
                      {formatPHP(payData.pay.total)}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}
