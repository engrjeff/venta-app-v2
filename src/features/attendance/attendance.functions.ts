import { createServerFn } from "@tanstack/react-start"
import {
  getActiveAttendance,
  getAttendanceRecordsToday,
  submitAttendanceTransition,
  submitClockInAttendance,
} from "./attendance.server"
import {
  activeAttendanceSchema,
  attendanceTodaySchema,
  attendanceTransitionSchema,
  employeeClockInSchema,
} from "./schema"

export const clockIn = createServerFn({ method: "POST" })
  .inputValidator(employeeClockInSchema)
  .handler(async ({ data }) => {
    return submitClockInAttendance(data)
  })

export const getActive = createServerFn({ method: "GET" })
  .inputValidator(activeAttendanceSchema)
  .handler(async ({ data }) => {
    return getActiveAttendance(data)
  })

export const transition = createServerFn({ method: "POST" })
  .inputValidator(attendanceTransitionSchema)
  .handler(async ({ data }) => {
    return submitAttendanceTransition(data)
  })

export const getRecordsToday = createServerFn({ method: "GET" })
  .inputValidator(attendanceTodaySchema)
  .handler(async ({ data }) => {
    return getAttendanceRecordsToday(data)
  })

export const attendanceApi = { clockIn, getActive, transition, getRecordsToday }
