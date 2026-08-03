import type { SalaryType } from "@/generated/prisma/enums"
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns"

export type DateRange =
  | {
      type: "range"
      preset: "this_week" | "last_week" | "this_month" | "last_month"
    }
  | {
      type: "custom"
      start: string // e.g. "2026-07-01"
      end: string // e.g. "2026-07-31"
    }

export function getDateRange(
  range: DateRange = {
    type: "range",
    preset: "this_week",
  }
) {
  if (range.type === "custom") {
    return {
      start: startOfDay(new Date(range.start)),
      end: endOfDay(new Date(range.end)),
    }
  }

  const now = new Date()

  switch (range.preset) {
    case "last_week": {
      const lastWeek = subWeeks(now, 1)
      return {
        start: startOfWeek(lastWeek, { weekStartsOn: 1 }),
        end: endOfWeek(lastWeek, { weekStartsOn: 1 }),
      }
    }

    case "this_month":
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      }

    case "last_month": {
      const lastMonth = subMonths(now, 1)
      return {
        start: startOfMonth(lastMonth),
        end: endOfMonth(lastMonth),
      }
    }

    case "this_week":
    default:
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
      }
  }
}
type AttendanceStatus = "UNDERTIME" | "REGULAR" | "OVERTIME"

const REGULAR_WORKDAY_HOURS = 8

export function calculatePay(
  totalWorkedSeconds: number,
  rate: number,
  type: SalaryType
) {
  const workedHours = totalWorkedSeconds / 3600

  const regularHours = Math.min(workedHours, REGULAR_WORKDAY_HOURS)
  const overtimeHours = Math.max(workedHours - REGULAR_WORKDAY_HOURS, 0)
  const undertimeHours = Math.max(REGULAR_WORKDAY_HOURS - workedHours, 0)

  const regularPay =
    type === "HOURLY"
      ? regularHours * rate
      : (regularHours / REGULAR_WORKDAY_HOURS) * rate

  const overtimePay =
    type === "HOURLY"
      ? overtimeHours * rate
      : (overtimeHours / REGULAR_WORKDAY_HOURS) * rate

  const status: AttendanceStatus =
    overtimeHours > 0
      ? "OVERTIME"
      : undertimeHours > 0
        ? "UNDERTIME"
        : "REGULAR"

  return {
    status,

    time: {
      workedSeconds: totalWorkedSeconds,
      workedHours,
      regularHours,
      overtimeHours,
      undertimeHours,
    },

    pay: {
      regular: regularPay,
      overtime: overtimePay,
      total: regularPay + overtimePay,
    },
  }
}

export type AttendanceRemark = "EARLY" | "ON_TIME" | "LATE"

export function getAttendanceRemark(
  timeIn: Date,
  scheduleStart: Date
): AttendanceRemark {
  if (timeIn < scheduleStart) {
    return "EARLY"
  }

  if (timeIn > scheduleStart) {
    return "LATE"
  }

  return "ON_TIME"
}
