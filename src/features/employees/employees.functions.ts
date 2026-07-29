import { createServerFn } from "@tanstack/react-start"
import {
  clearEmployeeSession,
  createEmployeeSession,
  createEmployees,
  getEmployee,
  getEmployeeSession,
} from "./employees.server"
import {
  employeeArraySchema,
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

export const employeesApi = {
  createMany,
  getById,
  createSession,
  getSession,
  clearSession,
}
