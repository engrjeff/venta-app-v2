import { cva } from "class-variance-authority"
import { isSameDay } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { AttendanceStatus } from "@/generated/prisma/enums"
import { cn } from "@/lib/utils"

const attendanceStatusBadgeVariants = cva("border-none capitalize", {
  variants: {
    status: {
      [AttendanceStatus.WORKING]:
        "bg-emerald-900/50 text-emerald-500 dark:bg-emerald-900/40",
      [AttendanceStatus.ON_BREAK]:
        "bg-yellow-900/50 text-yellow-500 dark:bg-yellow-900/40",
      [AttendanceStatus.CLOCKED_OUT]:
        "bg-accent text-gray-400 dark:bg-muted/50",
      [AttendanceStatus.VOID]: "bg-red-900/50 text-red-400 dark:bg-red-900/30",
    },
  },
})

export function AttendanceStatusBadge({
  status,
  date,
  className,
}: {
  /** Undefined means the employee has no attendance record at all yet. */
  status: AttendanceStatus | undefined
  /**
   * The attendance record's business date. When provided, a non-today
   * record that hasn't reached CLOCKED_OUT is flagged as "Not Clocked Out"
   * instead of showing its raw (stale) WORKING/ON_BREAK status.
   */
  date?: Date
  className?: string
}) {
  const isNotClockedOut =
    status !== undefined &&
    date !== undefined &&
    status !== AttendanceStatus.CLOCKED_OUT &&
    !isSameDay(date, new Date())

  const notClockedIn = status === undefined
  const needsAttention = isNotClockedOut

  const label =
    status === undefined
      ? "Not Clocked In"
      : isNotClockedOut
        ? "Not Clocked Out"
        : status.replaceAll("_", " ").toLowerCase()

  return (
    <Badge
      className={cn(
        notClockedIn
          ? attendanceStatusBadgeVariants({
              status: AttendanceStatus.CLOCKED_OUT,
            })
          : needsAttention
            ? attendanceStatusBadgeVariants({ status: AttendanceStatus.VOID })
            : attendanceStatusBadgeVariants({ status }),
        className
      )}
    >
      {label}
    </Badge>
  )
}
