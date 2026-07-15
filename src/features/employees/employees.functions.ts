import { createServerFn } from "@tanstack/react-start"
import { createEmployees } from "./employees.server"
import { employeeArraySchema } from "./schema"

export const createMany = createServerFn({ method: "POST" })
  .inputValidator(employeeArraySchema)
  .handler(async ({ data }) => {
    return createEmployees(data)
  })

export const employeesApi = { createMany }
