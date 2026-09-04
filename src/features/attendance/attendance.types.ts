import type {
  Attendance,
  AttendanceBreak,
  AttendanceRequest,
  AttendanceSnapshot,
} from "@/generated/prisma/browser"

export type AttendanceHistoryItem = Attendance & {
  attendanceSnapshot: AttendanceSnapshot | null
  breaks: AttendanceBreak[]
  requests: Pick<AttendanceRequest, "id" | "status">[]
}
