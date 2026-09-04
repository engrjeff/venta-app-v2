import {
  AttendanceRequestStatus,
  AttendanceRequestType,
} from "@/generated/prisma/enums"

export const ATTENDANCE_REQUEST_TYPE_LABELS: Record<
  AttendanceRequestType,
  string
> = {
  [AttendanceRequestType.FORGOT_TO_CLOCK_OUT]: "Forgot to Clock Out",
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
