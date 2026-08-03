import { createServerFn } from "@tanstack/react-start"
import { timesheetQueryOptionsSchema } from "./schema"
import { getTimesheet } from "./timesheet.server"

const getMany = createServerFn({ method: "GET" })
  .inputValidator(timesheetQueryOptionsSchema)
  .handler(async ({ data }) => {
    return getTimesheet(data)
  })

export const timesheetApi = { getMany }
