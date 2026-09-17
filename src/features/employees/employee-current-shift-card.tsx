import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AttendanceShiftBar } from "@/features/attendance/attendance-shift"
import { useElapsedWorkTime } from "@/features/attendance/use-elapsed-work-time"
import type { Attendance, Branch } from "@/generated/prisma/browser"
import { AttendanceStatus } from "@/generated/prisma/enums"
import { cn, formatDurationFromSeconds, formatTime } from "@/lib/utils"

export function EmployeeCurrentShiftCard({
  attendance,
}: {
  attendance: (Attendance & { branch: Branch }) | null
}) {
  if (!attendance) return <EmployeeNotClockedInCard />

  return <EmployeeActiveShiftCard attendance={attendance} />
}

function EmployeeNotClockedInCard() {
  return (
    <div className="rounded-md bg-card p-4 shadow-xs ring-1 ring-foreground/10">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Today's shift</p>
        <Badge variant="CLOCKED_OUT">Not clocked in</Badge>
      </div>

      <p className="mt-2 font-mono text-4xl font-semibold text-muted-foreground/50 tabular-nums">
        00:00:00
      </p>

      <div className="mt-3 flex items-center gap-2">
        <span className="font-mono text-xs text-muted-foreground">--</span>
        <div className="h-1.5 flex-1 rounded-full bg-muted" />
        <span className="font-mono text-xs text-muted-foreground">--</span>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        No attendance recorded for today yet.
      </p>
    </div>
  )
}

function EmployeeActiveShiftCard({
  attendance,
}: {
  attendance: Attendance & { branch: Branch }
}) {
  const timer = useElapsedWorkTime({
    attendance: {
      id: attendance.id,
      status: attendance.status,
      timeIn: attendance.timeIn ? attendance.timeIn.toISOString() : null,
      timeOut: attendance.timeOut ? attendance.timeOut.toISOString() : null,
      workStartedAt: attendance.workStartedAt
        ? attendance.workStartedAt.toISOString()
        : null,
      breakStartedAt: attendance.breakStartedAt
        ? attendance.breakStartedAt.toISOString()
        : null,
      totalWorkedSeconds: attendance.totalWorkedSeconds,
      totalBreakSeconds: attendance.totalBreakSeconds,
    },
  })

  const isOnBreak = attendance.status === AttendanceStatus.ON_BREAK
  const isClockedOut = attendance.status === AttendanceStatus.CLOCKED_OUT

  const statusLabel = isClockedOut
    ? "Shift ended"
    : isOnBreak
      ? "On break"
      : "Working"

  return (
    <div
      className={cn(
        "rounded-md bg-card p-4 shadow-xs ring-1",
        isClockedOut ? "ring-foreground/10" : "ring-emerald-500/30"
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isClockedOut ? "Today's shift" : "Current shift"}
        </p>
        <span
          className={cn(
            "flex items-center gap-1.5 text-xs font-medium",
            isClockedOut ? "text-muted-foreground" : "text-emerald-500"
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              isClockedOut ? "bg-muted-foreground" : "bg-emerald-500"
            )}
          />
          {statusLabel}
        </span>
      </div>

      <p className="mt-2 font-mono text-4xl font-semibold tabular-nums">
        {timer.formatted}
      </p>

      <div className="mt-3 flex items-center gap-2">
        <span className="font-mono text-xs text-muted-foreground">
          {attendance.timeIn ? formatTime(attendance.timeIn) : "--"}
        </span>
        <AttendanceShiftBar attendance={{ ...attendance, requests: [] }} />
        <span className="font-mono text-xs text-muted-foreground">
          {attendance.timeOut ? formatTime(attendance.timeOut) : "—"}
        </span>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        {attendance.branch.name}
        {attendance.totalBreakSeconds > 0 &&
          ` · break ${formatDurationFromSeconds(attendance.totalBreakSeconds)}`}
      </p>

      {/* TODO: wire up edit-times / force-clock-out once those mutations exist */}
      <div className="mt-4 hidden gap-2">
        <Button type="button" variant="outline" className="flex-1">
          Edit times
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1 text-destructive"
        >
          Force clock out
        </Button>
      </div>
    </div>
  )
}
