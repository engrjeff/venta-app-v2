import type {
  Attendance,
  Branch,
  Designation,
  Employee,
} from "@/generated/prisma/browser"
import type { AttendanceStatus } from "@/generated/prisma/enums"

export interface AttendanceRecord extends Attendance {
  branch: Pick<Branch, "id" | "name">
  employee: Pick<Employee, "id" | "firstName" | "lastName" | "username"> & {
    designation: Pick<Designation, "id" | "name">
  }
}

export interface EmployeeRosterEntry {
  id: string
  firstName: string
  lastName: string
  designation: Pick<Designation, "id" | "name">
  branches: Array<{
    isPrimary: boolean
    branch: Pick<Branch, "id" | "name">
  }>
}

export interface AttendanceRow {
  key: string
  employeeId: string
  employee: Pick<Employee, "firstName" | "lastName"> & {
    designation: Pick<Designation, "id" | "name">
  }
  branch: Pick<Branch, "id" | "name"> | undefined
  status: AttendanceStatus | undefined
  timeIn: Date | null
  timeOut: Date | null
}

export type AttendanceStatusFilter =
  | AttendanceStatus
  | "NOT_CLOCKED_IN"
  | undefined
