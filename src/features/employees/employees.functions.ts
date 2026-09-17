import { createServerFn } from "@tanstack/react-start"
import {
  clearEmployeeSession,
  createEmployee,
  createEmployeeSession,
  createEmployees,
  deleteEmployee,
  getEmployee,
  getEmployeeSession,
  getEmployees,
  updateEmployee,
  updateEmployeeSession,
  updateEmployeeStatus,
} from "./employees.server"
import {
  addEmployeeSchema,
  employeeArraySchema,
  employeeIdSchema,
  employeeUsernameSchema,
  getEmployeesInputSchema,
  updateEmployeeSchema,
  updateEmployeeSessionSchema,
  updateEmployeeStatusSchema,
} from "./schema"

export const getAll = createServerFn({ method: "GET" })
  .validator(getEmployeesInputSchema)
  .handler(async ({ data }) => {
    return getEmployees(data)
  })

export const create = createServerFn({ method: "POST" })
  .validator(addEmployeeSchema)
  .handler(async ({ data }) => {
    return createEmployee(data)
  })

export const createMany = createServerFn({ method: "POST" })
  .validator(employeeArraySchema)
  .handler(async ({ data }) => {
    return createEmployees(data)
  })

export const getById = createServerFn({ method: "POST" })
  .validator(employeeIdSchema)
  .handler(async ({ data }) => {
    return getEmployee(data.employeeId)
  })

export const update = createServerFn({ method: "POST" })
  .validator(updateEmployeeSchema)
  .handler(async ({ data }) => {
    return updateEmployee(data)
  })

export const updateStatus = createServerFn({ method: "POST" })
  .validator(updateEmployeeStatusSchema)
  .handler(async ({ data }) => {
    return updateEmployeeStatus(data)
  })

export const remove = createServerFn({ method: "POST" })
  .validator(employeeIdSchema)
  .handler(async ({ data }) => {
    return deleteEmployee(data)
  })

export const createSession = createServerFn({ method: "POST" })
  .validator(employeeUsernameSchema)
  .handler(async ({ data }) => {
    return createEmployeeSession(data)
  })

export const getSession = createServerFn({ method: "GET" }).handler(
  getEmployeeSession
)

export const clearSession = createServerFn({ method: "POST" }).handler(
  clearEmployeeSession
)
export const updateSession = createServerFn({ method: "POST" })
  .validator(updateEmployeeSessionSchema)
  .handler(async ({ data }) => updateEmployeeSession(data))

export const employeesApi = {
  getAll,
  getById,
  create,
  createMany,
  update,
  remove,
  updateStatus,

  createSession,
  getSession,
  clearSession,
  updateSession,
}
