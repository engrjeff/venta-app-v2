import {
  AttendanceShiftBadge,
  AttendanceShiftBar,
  isAttendanceOpenToday,
  isAttendanceUnresolved,
} from "@/features/attendance/attendance-shift"
import { formatDurationFromSeconds, formatPHP, formatTime } from "@/lib/utils"
import { formatDate } from "date-fns"
import type { TimesheetRecord } from "./timesheet.types"

export function TimesheetShiftCard({
  attendance,
}: {
  attendance: TimesheetRecord
}) {
  const isOpenToday = isAttendanceOpenToday(attendance)
  const isUnresolved = isAttendanceUnresolved(attendance)

  const endLabel = attendance.timeOut
    ? formatTime(attendance.timeOut)
    : isOpenToday
      ? "—"
      : "?"

  const subtitle = isUnresolved
    ? "no clock out"
    : attendance.totalBreakSeconds > 0
      ? `break ${formatDurationFromSeconds(attendance.totalBreakSeconds)}`
      : null

  return (
    <div className="flex flex-col gap-2 rounded-md bg-card p-3 text-sm shadow">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className="font-semibold">
            {formatDate(attendance.date, "EEE, MMM d")}
          </p>
          <AttendanceShiftBadge attendance={attendance} />
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          {formatDurationFromSeconds(attendance.totalWorkedSeconds)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          {attendance.timeIn ? formatTime(attendance.timeIn) : "--"}
        </span>
        <AttendanceShiftBar attendance={attendance} />
        <span className="font-mono text-xs text-muted-foreground">
          {endLabel}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <p>
          {attendance.attendanceSnapshot?.branchName}
          {subtitle ? ` · ${subtitle}` : null}
        </p>
        {attendance.totalPay != null && (
          <span className="font-semibold text-emerald-500">
            {formatPHP(attendance.totalPay)}
          </span>
        )}
      </div>
    </div>
  )
}
