import { createServerFn } from "@tanstack/react-start"
import { getDashboardData } from "./dashboard.server"
import { dashboardDataInputSchema } from "./schema"

export const get = createServerFn({ method: "GET" })
  .validator(dashboardDataInputSchema)
  .handler(async ({ data }) => {
    return getDashboardData(data)
  })

export const dashboardApi = { get }
