import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { attendanceApi } from "@/features/attendance/attendance.functions"
import { AttendanceStatus } from "@/generated/prisma/enums"
import { formatDurationFromSeconds, formatPHP, formatTime } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"
import { formatDate, isToday } from "date-fns"
import { InboxIcon, MoreHorizontalIcon } from "lucide-react"
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
    const logs = await attendanceApi.getHistoryByEmployee({
      data: {
        employeeId: params.employeeId,
        start,
        end,
      },
    })

    return logs
  },
})

function RouteComponent() {
  const loaderData = Route.useLoaderData()

  if (loaderData.error) return <p>An error occured</p>

  if (!loaderData.data?.length)
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

  const logs = loaderData.data

  return (
    <>
      <div>
        <h2 className="font-bold">Attendance Logs</h2>
      </div>
      <ul className="space-y-3">
        {logs.map((log) => {
          if (!log.attendanceSnapshot) return null

          return (
            <li key={log.id}>
              <div className="group relative space-y-0.5 rounded-md bg-card p-3 text-sm shadow">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="absolute top-0.5 right-0.5"
                >
                  <MoreHorizontalIcon />
                </Button>
                <div className="flex items-center justify-between">
                  <p className="font-medium">
                    {formatDate(log.date, "MMM dd, yyy")}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  {log.timeIn &&
                    log.timeOut &&
                    log.status === AttendanceStatus.CLOCKED_OUT && (
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span>{formatTime(log.timeIn)}</span>
                        <span>-</span>
                        <span>{formatTime(log.timeOut)}</span>
                      </p>
                    )}
                  {!log.timeOut && log.timeIn && !isToday(log.date) && (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>{formatTime(log.timeIn)}</span>
                      <span>-</span>
                      <span className="text-destructive">Not clocked out</span>
                    </p>
                  )}
                  {!log.timeOut && log.timeIn && isToday(log.date) && (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>{formatTime(log.timeIn)}</span>
                      <span>-</span>
                      <span className="text-emerald-500">Working</span>
                    </p>
                  )}
                  <p className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                    Work:
                    <span className="font-mono">
                      {formatDurationFromSeconds(log.totalWorkedSeconds)} /
                    </span>
                    <span className="font-mono font-medium text-emerald-500">
                      {formatPHP(log.regularPay ?? 0)}
                    </span>
                  </p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}
