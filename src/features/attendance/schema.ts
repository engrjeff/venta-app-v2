import z from "zod"

export const employeeClockInSchema = z.object({
  storeId: z.string({ error: "Store is required" }).min(1, "Store is required"),
  employeeId: z
    .string({ error: "Employee ID is required" })
    .min(1, "Employee ID is required"),
  branchId: z
    .string({ error: "Branch is required" })
    .min(1, "Branch is required"),
  timeIn: z.iso.datetime({ local: true, error: "Clock-in time is required" }),
  timeInLat: z.number({ error: "Clock-in location is required" }),
  timeInLng: z.number({ error: "Clock-in location is required" }),
})

export const employeeClockInFormSchema = employeeClockInSchema.partial({
  timeIn: true,
  timeInLat: true,
  timeInLng: true,
})

export const activeAttendanceSchema = z.object({
  attendanceId: z
    .string({ error: "Attendance ID is required" })
    .min(1, "Attendance ID is required"),
  employeeId: z
    .string({ error: "Employee ID is required" })
    .min(1, "Employee ID is required"),
})

export const attendanceTransitionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("pause"),
    attendanceId: z.string({ error: "No active attendance record provided" }),
    at: z.iso.datetime({ local: true, error: "Pause time is required" }),
  }),

  z.object({
    action: z.literal("resume"),
    attendanceId: z.string({ error: "No active attendance record provided" }),
    at: z.iso.datetime({ local: true, error: "Resume time is required" }),
  }),

  z.object({
    action: z.literal("clockOut"),
    attendanceId: z.string({ error: "No active attendance record provided" }),
    at: z.iso.datetime({ local: true, error: "Clock-out time is required" }),

    timeOutLatitude: z.number({ error: "Clock-out location is required" }),
    timeOutLongitude: z.number({ error: "Clock-out location is required" }),
  }),
])

export const attendanceTodaySchema = z.object({
  storeId: z.string({ error: "Store is required" }).min(1, "Store is required"),
})

export const attendanceByEmployeeSchema = z.object({
  employeeId: z
    .string({ error: "Employee ID is required" })
    .min(1, "Employee ID is required"),
  // date range filter
  start: z.iso.date().optional(),
  end: z.iso.date().optional(),
})

export type AttendanceTransitionInput = z.infer<
  typeof attendanceTransitionSchema
>

export type EmployeeClockInInput = z.infer<typeof employeeClockInSchema>

export type EmployeeClockInFormInput = z.infer<typeof employeeClockInFormSchema>

export type ActiveAttendanceQueryInput = z.infer<typeof activeAttendanceSchema>

export type AttendanceTodayInput = z.infer<typeof attendanceTodaySchema>

export type AttendanceByEmployeeInput = z.infer<
  typeof attendanceByEmployeeSchema
>
