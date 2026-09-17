import type {
  Attendance,
  AttendanceRequest,
  AttendanceSnapshot,
} from "@/generated/prisma/browser"

export type TimesheetRecord = Attendance & {
  attendanceSnapshot: AttendanceSnapshot | null
  requests: Pick<AttendanceRequest, "id" | "status">[]
}
