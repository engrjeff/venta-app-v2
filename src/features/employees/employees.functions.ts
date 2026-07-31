import { createServerFn } from "@tanstack/react-start"
import { storeIdSchema } from "../store/schema"
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
  updateEmployeeStatus,
} from "./employees.server"
import {
  employeeArraySchema,
  employeeIdSchema,
  employeeSchema,
  employeeUsernameSchema,
  updateEmployeeSchema,
  updateEmployeeStatusSchema,
} from "./schema"

export const getAll = createServerFn({ method: "GET" })
  .inputValidator(storeIdSchema)
  .handler(async ({ data }) => {
    return getEmployees({ storeId: data.id })
  })

export const create = createServerFn({ method: "POST" })
  .inputValidator(employeeSchema)
  .handler(async ({ data }) => {
    return createEmployee(data)
  })

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

export const update = createServerFn({ method: "POST" })
  .inputValidator(updateEmployeeSchema)
  .handler(async ({ data }) => {
    return updateEmployee(data)
  })

export const updateStatus = createServerFn({ method: "POST" })
  .inputValidator(updateEmployeeStatusSchema)
  .handler(async ({ data }) => {
    return updateEmployeeStatus(data)
  })

export const remove = createServerFn({ method: "POST" })
  .inputValidator(employeeIdSchema)
  .handler(async ({ data }) => {
    return deleteEmployee(data)
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
}
