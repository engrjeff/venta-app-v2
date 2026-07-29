import { useEffect, useMemo, useState } from "react"
import { AttendanceStatus } from "@/generated/prisma/enums"

interface Attendance {
  id: string

  timeIn: string | null
  timeOut: string | null

  status: AttendanceStatus

  workStartedAt: string | null
  breakStartedAt: string | null

  totalWorkedSeconds: number
  totalBreakSeconds: number
}

interface UseElapsedWorkTimeOptions {
  attendance: Attendance
}

export function useElapsedWorkTime({ attendance }: UseElapsedWorkTimeOptions) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const shouldTick =
      attendance.status === AttendanceStatus.WORKING && attendance.workStartedAt

    if (!shouldTick) return

    const interval = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [attendance.status, attendance.workStartedAt])

  return useMemo(() => {
    let totalSeconds = attendance.totalWorkedSeconds

    if (
      attendance.status === AttendanceStatus.WORKING &&
      attendance.workStartedAt
    ) {
      const workStartedAt = new Date(attendance.workStartedAt)

      // Hard stop at end of business day
      const endOfDay = new Date(workStartedAt)
      endOfDay.setHours(23, 59, 59, 999)

      const currentTime = Math.min(now, endOfDay.getTime())

      totalSeconds += Math.max(
        0,
        Math.floor((currentTime - workStartedAt.getTime()) / 1000)
      )
    }

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return {
      totalSeconds,
      formatted: [
        String(hours).padStart(2, "0"),
        String(minutes).padStart(2, "0"),
        String(seconds).padStart(2, "0"),
      ].join(":"),
    }
  }, [
    attendance.status,
    attendance.workStartedAt,
    attendance.totalWorkedSeconds,
    now,
  ])
}
