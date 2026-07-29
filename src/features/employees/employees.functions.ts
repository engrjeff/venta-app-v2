import { createServerFn } from "@tanstack/react-start"
import {
  clearEmployeeSession,
  createEmployees,
  createEmployeeSession,
  getActiveAttendance,
  getEmployee,
  getEmployeeSession,
  submitAttendanceTransition,
  submitClockInAttendance,
} from "./employees.server"
import {
  activeAttendanceSchema,
  attendanceTransitionSchema,
  employeeArraySchema,
  employeeClockInSchema,
  employeeIdSchema,
  employeeUsernameSchema,
} from "./schema"

export const createMany = createServerFn({ method: "POST" })
  .inputValidator(employeeArraySchema)
  .handler(async ({ data }) => {
    return createEmployees(data)
  })

export const getById = createServerFn({ method: "POST" })
  .inputValidator(employeeIdSchema)
  .handler(async ({ data }) => {
    return getEmployee(data.employeeId)
  })

export const createSession = createServerFn({ method: "POST" })
  .inputValidator(employeeUsernameSchema)
  .handler(async ({ data }) => {
    return createEmployeeSession(data)
  })

export const getSession = createServerFn({ method: "GET" }).handler(
  getEmployeeSession
)

export const clearSession = createServerFn({ method: "POST" }).handler(
  clearEmployeeSession
)

export const clockIn = createServerFn({ method: "POST" })
  .inputValidator(employeeClockInSchema)
  .handler(async ({ data }) => {
    return submitClockInAttendance(data)
  })

export const queryActiveAttendance = createServerFn({ method: "GET" })
  .inputValidator(activeAttendanceSchema)
  .handler(async ({ data }) => {
    return getActiveAttendance(data)
  })

export const transitionAttendance = createServerFn({ method: "POST" })
  .inputValidator(attendanceTransitionSchema)
  .handler(async ({ data }) => {
    return submitAttendanceTransition(data)
  })

export const employeesApi = {
  createMany,
  getById,
  createSession,
  getSession,
  clearSession,
  clockIn,
  queryActiveAttendance,
  transitionAttendance,
}
