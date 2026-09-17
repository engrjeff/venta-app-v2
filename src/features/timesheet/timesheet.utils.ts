import { AttendanceStatus as PrismaAttendanceStatus } from "@/generated/prisma/enums"
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
import type { TimesheetQueryOptions } from "./schema"
import type { TimesheetRecord } from "./timesheet.types"

export type TimesheetTotals = {
  workHours: number
  breakHours: number
  overtimeHours: number
  earnings: number
}

/**
 * Records that haven't clocked out yet have partial/running snapshot
 * totals, not final numbers — they're excluded from the aggregate.
 */
export function calculateTimesheetTotals(
  records: Pick<
    TimesheetRecord,
    | "status"
    | "totalWorkedSeconds"
    | "totalBreakSeconds"
    | "overtimeSeconds"
    | "totalPay"
  >[]
): TimesheetTotals {
  return records.reduce<TimesheetTotals>(
    (acc, attendance) => {
      if (attendance.status !== PrismaAttendanceStatus.CLOCKED_OUT) return acc

      return {
        workHours: acc.workHours + attendance.totalWorkedSeconds / 3600,
        breakHours: acc.breakHours + attendance.totalBreakSeconds / 3600,
        overtimeHours: acc.overtimeHours + attendance.overtimeSeconds / 3600,
        earnings: acc.earnings + (attendance.totalPay ?? 0),
      }
    },
    { workHours: 0, breakHours: 0, overtimeHours: 0, earnings: 0 }
  )
}

export function countActiveTimesheetFilters(
  search: Pick<TimesheetQueryOptions, "employees" | "branches" | "designations">
) {
  return [search.employees, search.branches, search.designations].filter(
    (rule) => rule && rule.value.length > 0
  ).length
}

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
