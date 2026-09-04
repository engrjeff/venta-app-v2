import {
  AttendanceRequestStatus,
  AttendanceRequestType,
} from "@/generated/prisma/enums"
import z from "zod"

export const createAttendanceRequestSchema = z
  .object({
    attendanceId: z
      .string({ error: "Attendance is required" })
      .min(1, "Attendance is required"),
    employeeId: z
      .string({ error: "Employee is required" })
      .min(1, "Employee is required"),
    type: z.enum(AttendanceRequestType, { error: "Request type is required" }),
    reason: z
      .string({ error: "Reason is required" })
      .min(1, "Reason is required"),
    clockOutTime: z.iso
      .time({ error: "Clock-out time is required" })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.type === AttendanceRequestType.FORGOT_TO_CLOCK_OUT &&
      !data.clockOutTime
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Clock-out time is required",
        path: ["clockOutTime"],
      })
    }
  })

export const attendanceRequestIdSchema = z.object({
  id: z
    .string({ error: "Request ID is required" })
    .min(1, "Request ID is required"),
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
})

export type CreateAttendanceRequestInput = z.infer<
  typeof createAttendanceRequestSchema
>

export type AttendanceRequestIdInput = z.infer<typeof attendanceRequestIdSchema>

export type AttendanceRequestsByEmployeeInput = z.infer<
  typeof attendanceRequestsByEmployeeSchema
>

export type AttendanceRequestsByStoreInput = z.infer<
  typeof attendanceRequestsByStoreSchema
>
