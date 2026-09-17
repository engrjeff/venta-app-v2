import {
  calculateAttendancePay,
  combineDateAndTime,
  secondsBetween,
} from "../attendance/attendance.utils"
import { AttendanceRequestType } from "@/generated/prisma/enums"
import type { AttendanceRequestWithRelations } from "./request.types"
import { getRequestedTime } from "./request.utils"

export interface ApprovalPreview {
  totalWorkedSeconds: number
  regularWorkedSeconds: number
  overtimeSeconds: number
  totalPay: number
}

/**
 * Approximates what approving this request would do to the day's totals,
 * for display in the approve confirmation dialog. Mirrors the recompute in
 * `approveAttendanceRequest`, but — for a still-open day — assumes no break
 * is currently in progress, since that instant isn't available here.
 */
export function getApprovalPreview(
  request: AttendanceRequestWithRelations
): ApprovalPreview | null {
  const requestedTime = getRequestedTime(request)
  const snapshot = request.attendance.attendanceSnapshot

  if (!requestedTime || !snapshot) return null

  const { date, timeIn, timeOut, totalBreakSeconds } = request.attendance

  let totalWorkedSeconds: number

  if (request.type === AttendanceRequestType.EDIT_TIME_IN) {
    if (!timeOut) return null

    const newTimeIn = combineDateAndTime(date, requestedTime)
    totalWorkedSeconds = Math.max(
      0,
      secondsBetween(newTimeIn, timeOut) - totalBreakSeconds
    )
  } else {
    if (!timeIn) return null

    const newTimeOut = combineDateAndTime(date, requestedTime)
    totalWorkedSeconds = Math.max(
      0,
      secondsBetween(timeIn, newTimeOut) - totalBreakSeconds
    )
  }

  const calculation = calculateAttendancePay({
    totalWorkedSeconds,
    scheduleStartTime: snapshot.scheduleStartTime,
    scheduleEndTime: snapshot.scheduleEndTime,
    salaryType: snapshot.salaryType,
    salaryRate: snapshot.salaryRate,
  })

  return { totalWorkedSeconds, ...calculation }
}
