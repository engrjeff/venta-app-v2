import type {
  AttendanceRequest,
  Branch,
  Designation,
  Employee,
} from "@/generated/prisma/browser"
import type { AttendanceStatus, SalaryType } from "@/generated/prisma/enums"

export type AttendanceRequestWithRelations = AttendanceRequest & {
  employee: Pick<Employee, "id" | "firstName" | "lastName"> & {
    designation: Pick<Designation, "id" | "name">
  }
  attendance: {
    date: Date
    timeIn: Date | null
    timeOut: Date | null
    status: AttendanceStatus
    totalWorkedSeconds: number
    totalBreakSeconds: number
    totalPay: number | null
    branch: Pick<Branch, "id" | "name">
    attendanceSnapshot: {
      scheduleStartTime: Date
      scheduleEndTime: Date
      salaryType: SalaryType
      salaryRate: number
    } | null
  }
}
