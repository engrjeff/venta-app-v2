import { Badge } from "@/components/ui/badge"
import type { AttendanceRequest } from "@/generated/prisma/browser"
import {
  AttendanceRequestStatus,
  AttendanceStatus,
} from "@/generated/prisma/enums"
import { isToday } from "date-fns"

const REGULAR_WORKDAY_SECONDS = 8 * 60 * 60

export interface AttendanceShiftRecord {
  date: Date
  timeIn: Date | null
  timeOut: Date | null
  status: AttendanceStatus
  totalWorkedSeconds: number
  regularWorkedSeconds: number
  overtimeSeconds: number
  requests: Pick<AttendanceRequest, "id" | "status">[]
}

function formatOvertimeLabel(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  return minutes > 0 ? `OT ${hours}h ${minutes}m` : `OT ${hours}h`
}

/** A shift that's still open *today* is still in progress, not overdue. */
export function isAttendanceOpenToday(attendance: AttendanceShiftRecord) {
  return !attendance.timeOut && isToday(attendance.date)
}

/** A past shift with no clock-out — forgot to clock out. */
export function isAttendanceUnresolved(attendance: AttendanceShiftRecord) {
  return !attendance.timeOut && !isAttendanceOpenToday(attendance)
}

export function AttendanceShiftBar({
  attendance,
}: {
  attendance: AttendanceShiftRecord
}) {
  if (isAttendanceUnresolved(attendance)) {
    return (
      <div className="h-1.5 flex-1 rounded-full border border-dashed border-muted-foreground/40" />
    )
  }

  if (isAttendanceOpenToday(attendance)) {
    const pct = Math.min(
      (attendance.totalWorkedSeconds / REGULAR_WORKDAY_SECONDS) * 100,
      100
    )

    return (
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
    )
  }

  const total = attendance.totalWorkedSeconds
  const regularPct =
    total > 0 ? (attendance.regularWorkedSeconds / total) * 100 : 100
  const overtimePct = total > 0 ? (attendance.overtimeSeconds / total) * 100 : 0

  return (
    <div className="flex h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
      <div className="h-full bg-primary" style={{ width: `${regularPct}%` }} />
      <div
        className="h-full bg-amber-500"
        style={{ width: `${overtimePct}%` }}
      />
    </div>
  )
}

export function AttendanceShiftBadge({
  attendance,
}: {
  attendance: AttendanceShiftRecord
}) {
  const latestRequest = attendance.requests[0]

  if (latestRequest?.status === AttendanceRequestStatus.PENDING) {
    return <Badge variant="PENDING">Pending request</Badge>
  }

  if (isAttendanceOpenToday(attendance)) {
    return (
      <Badge variant={attendance.status}>
        {attendance.status === AttendanceStatus.ON_BREAK ? "Break" : "Working"}
      </Badge>
    )
  }

  if (isAttendanceUnresolved(attendance)) {
    return <Badge variant="VOID">Not clocked out</Badge>
  }

  if (attendance.overtimeSeconds > 0) {
    return (
      <Badge variant="PENDING">
        {formatOvertimeLabel(attendance.overtimeSeconds)}
      </Badge>
    )
  }

  return null
}
