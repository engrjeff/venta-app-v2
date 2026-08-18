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
import { ArrowRightIcon } from "lucide-react"

export function TimesheetList() {
  const { timesheets } = useLoaderData({
    from: "/_protected/timesheet",
  })

  if (timesheets.error) {
    return <p>An Error has occured</p>
  }

  return (
    <div className="lg:hidden">
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
                <CardContent className="space-y-3 p-0">
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <p className="font-semibold">Shift</p>
                    {attendance.timeIn && attendance.timeOut ? (
                      <div className="ml-auto flex items-center gap-1 font-mono">
                        <span>{formatTime(attendance.timeIn)}</span>
                        <ArrowRightIcon className="size-3" />
                        <span>{formatTime(attendance.timeOut)}</span>
                      </div>
                    ) : null}
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono">
                      Worked for{" "}
                      {formatDurationFromSeconds(attendance.totalWorkedSeconds)}
                    </span>
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
