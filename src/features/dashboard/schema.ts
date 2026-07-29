import z from "zod"

export const dashboardDataInputSchema = z.object({
  storeId: z
    .string({ error: "Store ID is required" })
    .min(1, "Store ID is required"),
})

export type DashboardDataInput = z.infer<typeof dashboardDataInputSchema>
