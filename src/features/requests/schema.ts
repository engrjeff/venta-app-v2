import {
  AttendanceRequestStatus,
  AttendanceRequestType,
} from "@/generated/prisma/enums"
import z from "zod"

const baseAttendanceRequestSchema = z.object({
  attendanceId: z
    .string({ error: "Attendance is required" })
    .min(1, "Attendance is required"),
  employeeId: z
    .string({ error: "Employee is required" })
    .min(1, "Employee is required"),
  reason: z
    .string({ error: "Reason is required" })
    .min(1, "Reason is required"),
})

export const createAttendanceRequestSchema = z.discriminatedUnion("type", [
  baseAttendanceRequestSchema.extend({
    type: z.literal(AttendanceRequestType.FORGOT_TO_CLOCK_OUT),
    clockOutTime: z.iso.time({ error: "Requested time-out is required" }),
  }),
  baseAttendanceRequestSchema.extend({
    type: z.literal(AttendanceRequestType.EDIT_TIME_IN),
    requestedTimeIn: z.iso.time({ error: "Requested time-in is required" }),
  }),
  baseAttendanceRequestSchema.extend({
    type: z.literal(AttendanceRequestType.EDIT_TIME_OUT),
    clockOutTime: z.iso.time({ error: "Requested time-out is required" }),
  }),
])

export const attendanceRequestIdSchema = z.object({
  id: z
    .string({ error: "Request ID is required" })
    .min(1, "Request ID is required"),
})

export const declineAttendanceRequestSchema = z.object({
  id: z
    .string({ error: "Request ID is required" })
    .min(1, "Request ID is required"),
  declineReason: z
    .string({ error: "A reason is required" })
    .min(1, "A reason is required"),
})

export const attendanceRequestsByEmployeeSchema = z.object({
  employeeId: z
    .string({ error: "Employee is required" })
    .min(1, "Employee is required"),
  status: z.enum(AttendanceRequestStatus).optional(),
})

export const attendanceRequestsByStoreSchema = z.object({
  storeId: z.string({ error: "Store is required" }).min(1, "Store is required"),
  status: z
    .object({
      operator: z.enum(["is", "is_not"]),
      value: z.array(z.enum(AttendanceRequestStatus)),
    })
    .optional(),
  employees: z
    .object({
      operator: z.enum(["is", "is_not"]),
      value: z.array(z.string()),
    })
    .optional(),
  branches: z
    .object({
      operator: z.enum(["is", "is_not"]),
      value: z.array(z.string()),
    })
    .optional(),
  type: z
    .object({
      operator: z.enum(["is", "is_not"]),
      value: z.array(z.enum(AttendanceRequestType)),
    })
    .optional(),
  // date range filter, applied to the linked attendance's business date
  start: z.iso.date().optional(),
  end: z.iso.date().optional(),
})

export type CreateAttendanceRequestInput = z.infer<
  typeof createAttendanceRequestSchema
>

export type AttendanceRequestIdInput = z.infer<typeof attendanceRequestIdSchema>

export type DeclineAttendanceRequestInput = z.infer<
  typeof declineAttendanceRequestSchema
>

export type AttendanceRequestsByEmployeeInput = z.infer<
  typeof attendanceRequestsByEmployeeSchema
>

export type AttendanceRequestsByStoreInput = z.infer<
  typeof attendanceRequestsByStoreSchema
>
