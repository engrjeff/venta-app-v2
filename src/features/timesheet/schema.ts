import z from "zod"

export const timesheetQueryOptionsSchema = z.object({
  storeId: z
    .string({ error: "Store ID is required" })
    .min(1, "Store ID is required"),
})

export type TimesheetQueryOptions = z.infer<typeof timesheetQueryOptionsSchema>
