import z from "zod"

export const timesheetQueryOptionsSchema = z.object({
  storeId: z
    .string({ error: "Store ID is required" })
    .min(1, "Store ID is required"),
  employees: z
    .object({
      operator: z.enum(["is", "is_not"]),
      value: z.array(z.string()),
    })
    .optional(),
  branches: z
    .object({
      operator: z.enum(["is", "is_not"]),
      value: z.array(z.string()),
    })
    .optional(),
  designations: z
    .object({
      operator: z.enum(["is", "is_not"]),
      value: z.array(z.string()),
    })
    .optional(),
  // date range filter
  start: z.iso.date().optional(),
  end: z.iso.date().optional(),
})

export type TimesheetQueryOptions = z.infer<typeof timesheetQueryOptionsSchema>
