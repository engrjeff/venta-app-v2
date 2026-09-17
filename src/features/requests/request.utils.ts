import { AttendanceRequestType } from "@/generated/prisma/enums"
import { intlFormatDistance } from "date-fns"
import type { AttendanceRequestsByStoreInput } from "./schema"

/**
 * Returns the single requested time relevant to a request's type —
 * `requestedTimeIn` for EDIT_TIME_IN, `clockOutTime` otherwise
 * (FORGOT_TO_CLOCK_OUT and EDIT_TIME_OUT both propose a new time-out).
 */
export function getRequestedTime(request: {
  type: AttendanceRequestType
  clockOutTime: Date | null
  requestedTimeIn: Date | null
}): Date | null {
  if (request.type === AttendanceRequestType.EDIT_TIME_IN) {
    return request.requestedTimeIn
  }

  return request.clockOutTime
}

/**
 * Returns the attendance record's already-recorded time relevant to a
 * request's type — `timeOut` for EDIT_TIME_OUT, `timeIn` otherwise
 * (FORGOT_TO_CLOCK_OUT and EDIT_TIME_IN both only have a time-in on record).
 */
export function getRecordedTime(request: {
  type: AttendanceRequestType
  attendance: { timeIn: Date | null; timeOut: Date | null }
}): Date | null {
  return request.type === AttendanceRequestType.EDIT_TIME_OUT
    ? request.attendance.timeOut
    : request.attendance.timeIn
}

/** Compact relative timestamp for mobile cards, e.g. "2 hours ago"/"Yesterday". */
export function formatRequestAge(date: Date): string {
  const distance = intlFormatDistance(date, new Date(), { numeric: "auto" })

  return distance.charAt(0).toUpperCase() + distance.slice(1)
}

export function countActiveRequestFilters(
  search: Pick<AttendanceRequestsByStoreInput, "employees" | "type">
) {
  return [search.employees, search.type].filter(
    (rule) => rule && rule.value.length > 0
  ).length
}
