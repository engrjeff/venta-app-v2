import { Badge } from "@/components/ui/badge"
import { WorkHours } from "@/features/attendance/work-hours"
import { employeesApi } from "@/features/employees/employees.functions"
import {
  formatDurationFromSeconds,
  formatScheduleTimeRange,
  formatTime,
} from "@/lib/utils"
import {
  createFileRoute,
  redirect,
  useLoaderData,
} from "@tanstack/react-router"
import { CircleStopIcon, ClockIcon, MapPinIcon } from "lucide-react"

export const Route = createFileRoute("/e/$storeSlug/$employeeId/")({
  beforeLoad: async (context) => {
    const employeeSession = await employeesApi.getSession()

    if (!employeeSession.data?.attendanceId) {
      throw redirect({
        to: "/e/$storeSlug",
        params: {
          storeSlug: context.params.storeSlug,
        },
        replace: true,
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const data = useLoaderData({ from: "/e/$storeSlug/$employeeId" })

  const { organization: store, employee, branch, ...serverAttendance } = data

  const { formatted: branchSchedule } = formatScheduleTimeRange(
    branch.scheduleStartTime,
    branch.scheduleEndTime
  )

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {/* Branch name */}
        <Badge variant="secondary" className="px-1.5">
          <MapPinIcon className="size-3" />
          {branch.name}
        </Badge>
        {/* Branch - Schedule */}
        <Badge variant="secondary" className="px-1.5">
          <ClockIcon className="size-3" />
          {branchSchedule}
        </Badge>
      </div>

      {/* work hours */}
      <WorkHours branch={branch} serverAttendance={serverAttendance} />

      {/* breaks */}
      {serverAttendance.breaks.length > 0 ? (
        <div className="divide-y rounded-md bg-card text-sm shadow">
          <div className="flex items-center justify-between p-3">
            <p className="font-semibold">Breaks</p>
            <p>
              Total Break Hours:{" "}
              <span className="font-semibold text-yellow-400">
                {formatDurationFromSeconds(serverAttendance.totalBreakSeconds)}
              </span>{" "}
            </p>
          </div>
          <ul className="divide-y">
            {serverAttendance.breaks.map((breakItem) => (
              <li key={breakItem.id}>
                <div className="flex items-center gap-4 p-3">
                  <CircleStopIcon
                    data-active={Boolean(breakItem.durationSeconds)}
                    className="size-5 text-yellow-400 data-active:text-muted-foreground"
                  />
                  <p className="text-sm">
                    <span className="text-muted-foreground">Started at</span>{" "}
                    {formatTime(breakItem.startedAt)}
                  </p>
                  <p className="ml-auto text-sm">
                    {breakItem.durationSeconds ? (
                      <>
                        <span className="text-muted-foreground">
                          Duration:{" "}
                        </span>
                        {formatDurationFromSeconds(breakItem.durationSeconds)}
                      </>
                    ) : (
                      <span className="text-sm text-yellow-400">On Going</span>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  )
}
