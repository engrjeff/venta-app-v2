import {
  AttendanceRequestStatus,
  AttendanceRequestType,
} from "@/generated/prisma/enums"

export const ATTENDANCE_REQUEST_TYPE_LABELS: Record<
  AttendanceRequestType,
  string
> = {
  [AttendanceRequestType.FORGOT_TO_CLOCK_OUT]: "Forgot to Clock Out",
  [AttendanceRequestType.EDIT_TIME_IN]: "Edit Time In",
  [AttendanceRequestType.EDIT_TIME_OUT]: "Edit Time Out",
}

/** Label for the requested-time field, contextual to the request type. */
export const ATTENDANCE_REQUEST_TIME_LABELS: Record<
  AttendanceRequestType,
  string
> = {
  [AttendanceRequestType.FORGOT_TO_CLOCK_OUT]: "Requested Clock Out",
  [AttendanceRequestType.EDIT_TIME_IN]: "Requested Time In",
  [AttendanceRequestType.EDIT_TIME_OUT]: "Requested Time Out",
}

export const ATTENDANCE_REQUEST_STATUS_LABELS: Record<
  AttendanceRequestStatus,
  string
> = {
  [AttendanceRequestStatus.PENDING]: "Pending",
  [AttendanceRequestStatus.APPROVED]: "Approved",
  [AttendanceRequestStatus.DECLINED]: "Declined",
  [AttendanceRequestStatus.CANCELLED]: "Cancelled",
}

/** Label for the field showing the attendance record's already-recorded time, contextual to the request type. */
export const ATTENDANCE_REQUEST_RECORDED_TIME_LABELS: Record<
  AttendanceRequestType,
  string
> = {
  [AttendanceRequestType.FORGOT_TO_CLOCK_OUT]: "Recorded Time In",
  [AttendanceRequestType.EDIT_TIME_IN]: "Recorded Time In",
  [AttendanceRequestType.EDIT_TIME_OUT]: "Recorded Time Out",
}

/** Note describing what an approved request changed, contextual to the request type. */
export const ATTENDANCE_REQUEST_APPROVED_NOTE_LABELS: Record<
  AttendanceRequestType,
  string
> = {
  [AttendanceRequestType.FORGOT_TO_CLOCK_OUT]: "clock out set to",
  [AttendanceRequestType.EDIT_TIME_IN]: "time in corrected to",
  [AttendanceRequestType.EDIT_TIME_OUT]: "time out corrected to",
}
