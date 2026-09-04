import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDurationFromSeconds, formatPHP, formatTime } from "@/lib/utils"
import { useLoaderData } from "@tanstack/react-router"
import { formatDate } from "date-fns"
import { ArrowRightIcon } from "lucide-react"

export function TimesheetList() {
  const { timesheets } = useLoaderData({
    from: "/_protected/timesheet",
  })

  if (timesheets.error) {
    return <p>An Error has occured</p>
  }

  const totals = timesheets.data?.reduce<{
    workHours: number
    breakHours: number
    earnings: number
  }>(
    (acc, attendance) => {
      const breakHours = attendance.totalBreakSeconds / 3600
      const workHours = attendance.totalWorkedSeconds / 3600
      const pay = attendance.totalPay ?? 0

      return {
        workHours: acc.workHours + workHours,
        breakHours: acc.breakHours + breakHours,
        earnings: acc.earnings + pay,
      }
    },
    {
      workHours: 0,
      breakHours: 0,
      earnings: 0,
    }
  ) ?? {
    workHours: 0,
    breakHours: 0,
    earnings: 0,
  }

  return (
    <div className="space-y-5 lg:hidden">
      {/* total working hours and total pay */}
      <div className="space-y-2 rounded-md bg-card p-4 shadow">
        <div className="flex items-center justify-between gap-4 text-sm font-semibold">
          <span>Total Working Hours</span>
          <span className="font-mono text-emerald-500">
            {formatDurationFromSeconds(totals.workHours * 3600)}
          </span>
        </div>
        <Separator />
        <div className="flex items-center justify-between gap-4 text-sm font-semibold">
          <span>Total Pay</span>
          <span className="font-mono text-emerald-500">
            {formatPHP(totals.earnings)}
          </span>
        </div>
      </div>
      {/* list */}
      <ul className="space-y-3">
        {timesheets.data?.map((attendance) => {
          const { attendanceSnapshot } = attendance

          return (
            <li key={attendance.id}>
              <Card size="sm" className="rounded-md p-2">
                <CardHeader className="gap-0 px-0">
                  <CardTitle>
                    {attendanceSnapshot?.employeeFirstName}{" "}
                    {attendanceSnapshot?.employeeLastName}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {attendanceSnapshot?.designationName}
                  </CardDescription>
                  <CardAction>
                    <Badge variant="SUCCESS">
                      {attendanceSnapshot?.branchName}
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardContent className="space-y-2 p-0">
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <p>{formatDate(attendance.date, "EE, MMM dd, yyyy")}</p>
                    {attendance.timeIn && attendance.timeOut ? (
                      <div className="ml-auto flex items-center gap-1 font-mono">
                        <span>{formatTime(attendance.timeIn)}</span>
                        <ArrowRightIcon className="size-3" />
                        <span>{formatTime(attendance.timeOut)}</span>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <p>
                      Worked for{" "}
                      <span className="font-mono">
                        {formatDurationFromSeconds(
                          attendance.totalWorkedSeconds
                        )}
                      </span>
                    </p>
                    <span className="text-right font-semibold text-emerald-400">
                      {formatPHP(attendance.totalPay ?? 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
