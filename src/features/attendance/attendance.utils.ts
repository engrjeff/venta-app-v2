import { SalaryType } from "@/generated/prisma/enums"

export function secondsBetween(start: Date, end: Date) {
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000))
}

/** The app operates in a single fixed timezone (no DST). */
export const MANILA_UTC_OFFSET_HOURS = 8

/**
 * Combines a business date with the time-of-day portion of a UTC
 * time-only `DateTime` field (e.g. a requested clock-out time), producing
 * the real UTC instant that wall-clock time represents in Asia/Manila.
 */
export function combineDateAndTime(date: Date, time: Date): Date {
  const combined = new Date(date)

  combined.setUTCHours(
    time.getUTCHours() - MANILA_UTC_OFFSET_HOURS,
    time.getUTCMinutes(),
    time.getUTCSeconds(),
    0
  )

  return combined
}

export type AttendanceCalculation = {
  regularWorkedSeconds: number
  overtimeSeconds: number
  undertimeSeconds: number

  regularPay: number
  overtimePay: number
  totalPay: number
}

const MAX_REGULAR_WORK_SECONDS = 8 * 60 * 60 // 8 hours

function timeToSeconds(time: Date): number {
  return (
    time.getUTCHours() * 3600 + time.getUTCMinutes() * 60 + time.getUTCSeconds()
  )
}

function getScheduledWorkSeconds(startTime: Date, endTime: Date): number {
  const startSeconds = timeToSeconds(startTime)
  const endSeconds = timeToSeconds(endTime)

  let duration = endSeconds - startSeconds

  // Handle overnight schedules
  if (duration < 0) {
    duration += 24 * 60 * 60
  }

  return Math.min(duration, MAX_REGULAR_WORK_SECONDS)
}

export function calculateAttendancePay({
  totalWorkedSeconds,
  scheduleStartTime,
  scheduleEndTime,
  salaryType,
  salaryRate,
  allowOvertime = false,
}: {
  totalWorkedSeconds: number
  scheduleStartTime: Date
  scheduleEndTime: Date
  salaryType: SalaryType
  salaryRate: number
  allowOvertime?: boolean
}): AttendanceCalculation {
  const scheduledWorkSeconds = getScheduledWorkSeconds(
    scheduleStartTime,
    scheduleEndTime
  )

  const regularWorkedSeconds = Math.min(
    totalWorkedSeconds,
    scheduledWorkSeconds
  )

  const overtimeSeconds = Math.max(0, totalWorkedSeconds - scheduledWorkSeconds)

  const undertimeSeconds = Math.max(
    0,
    scheduledWorkSeconds - totalWorkedSeconds
  )

  const regularHours = regularWorkedSeconds / 3600
  const overtimeHours = overtimeSeconds / 3600

  let regularPay: number
  let overtimePay: number

  if (salaryType === SalaryType.DAILY) {
    const hourlyRate = salaryRate / 8

    regularPay = hourlyRate * regularHours
    overtimePay = allowOvertime ? hourlyRate * overtimeHours : 0
  } else {
    regularPay = salaryRate * regularHours
    overtimePay = allowOvertime ? salaryRate * overtimeHours : 0
  }

  return {
    regularWorkedSeconds,
    overtimeSeconds,
    undertimeSeconds,
    regularPay,
    overtimePay,
    totalPay: regularPay + overtimePay,
  }
}
