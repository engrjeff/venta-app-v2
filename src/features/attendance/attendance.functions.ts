import { createServerFn } from "@tanstack/react-start"
import {
  getActiveAttendance,
  getActiveAttendanceByEmployeeId,
  getAttendanceHistoryByEmployee,
  getAttendanceRecordsByEmployee,
  getAttendanceRecordsToday,
  submitAttendanceTransition,
  submitClockInAttendance,
} from "./attendance.server"
import {
  activeAttendanceSchema,
  attendanceByEmployeeSchema,
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

export const getActiveByEmployeeId = createServerFn({ method: "GET" })
  .inputValidator(activeAttendanceSchema.pick({ employeeId: true }))
  .handler(async ({ data }) => {
    return getActiveAttendanceByEmployeeId(data)
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

export const getRecordsByEmployee = createServerFn({ method: "GET" })
  .inputValidator(attendanceByEmployeeSchema)
  .handler(async ({ data }) => {
    return getAttendanceRecordsByEmployee(data)
  })

export const getHistoryByEmployee = createServerFn({ method: "GET" })
  .inputValidator(attendanceByEmployeeSchema)
  .handler(async ({ data }) => {
    return getAttendanceHistoryByEmployee(data)
  })

export const attendanceApi = {
  clockIn,
  getActive,
  getActiveByEmployeeId,
  transition,
  getRecordsToday,
  getRecordsByEmployee,
  getHistoryByEmployee,
}
