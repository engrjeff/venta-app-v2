import { LockIcon, LogOutIcon, PauseIcon, PlayIcon } from "lucide-react"
import { useAttendanceSession } from "./use-attendance-session"
import { useElapsedWorkTime } from "./use-elapsed-work-time"
import type { Attendance, Branch } from "@/generated/prisma/browser"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { AttendanceStatus } from "@/generated/prisma/enums"


export function WorkHours({
  serverAttendance,
  branch,
}: {
  serverAttendance: Attendance
  branch: Branch
}) {
  const {
    id,
    status,
    timeIn,
    timeOut,
    workStartedAt,
    breakStartedAt,
    totalWorkedSeconds,
    totalBreakSeconds,
  } = serverAttendance

  const attendanceInput = {
    id,
    status,
    timeIn: timeIn ? timeIn.toISOString() : null,
    timeOut: timeOut ? timeOut.toISOString() : null,
    workStartedAt: workStartedAt ? workStartedAt.toISOString() : null,
    breakStartedAt: breakStartedAt ? breakStartedAt.toISOString() : null,
    totalWorkedSeconds,
    totalBreakSeconds,
  }

  const session = useAttendanceSession({
    attendance: attendanceInput,
  })

  const timer = useElapsedWorkTime({
    attendance: attendanceInput,
  })

  return (
    <div className="space-y-4 rounded-md border bg-card p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs text-muted-foreground">Work Hours</span>
          <div className="font-mono text-4xl font-semibold">
            {timer.formatted}
          </div>
          <p className="text-xs text-muted-foreground">
            Clocked In:{" "}
            <span className="font-mono">{session.clockInString}</span>
          </p>
        </div>

        <div>
          {serverAttendance.status === AttendanceStatus.WORKING && (
            <Badge>Working</Badge>
          )}
          {serverAttendance.status === AttendanceStatus.ON_BREAK && (
            <Badge variant="secondary">On Break</Badge>
          )}
          {serverAttendance.status === AttendanceStatus.CLOCKED_OUT && (
            <Badge variant="outline">Clocked Out</Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {serverAttendance.status === AttendanceStatus.WORKING && (
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={session.pause}
            disabled={session.saving}
          >
            {session.saving ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <PauseIcon />
            )}
            Pause
          </Button>
        )}
        {serverAttendance.status === AttendanceStatus.ON_BREAK && (
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="flex-1"
            onClick={session.resume}
            disabled={session.saving}
          >
            {session.saving ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <PlayIcon />
            )}
            Resume
          </Button>
        )}
        {serverAttendance.status === AttendanceStatus.CLOCKED_OUT ? (
          <Button
            type="button"
            size="lg"
            variant="outline"
            disabled
            className="flex-1"
          >
            <LockIcon />
            Shift Ended
          </Button>
        ) : (
          <Button
            type="button"
            size="lg"
            className="flex-1"
            onClick={() =>
              session.clockOut(
                { latitude: branch.latitude, longitude: branch.longitude },
                branch.attendanceRadius
              )
            }
            disabled={session.saving || session.savingClockout}
          >
            {session.savingClockout ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <LogOutIcon />
            )}
            Clock Out
          </Button>
        )}
      </div>
    </div>
  )
}
