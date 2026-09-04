import type { AttendanceRequest, Employee } from "@/generated/prisma/browser"

export type AttendanceRequestWithRelations = AttendanceRequest & {
  employee: Pick<Employee, "id" | "firstName" | "lastName">
  attendance: {
    date: Date
    timeIn: Date | null
    timeOut: Date | null
  }
}
