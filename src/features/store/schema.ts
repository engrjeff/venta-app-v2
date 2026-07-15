import z from "zod"

export const storeIdSchema = z.object({
  id: z
    .string({ error: "Store ID is required" })
    .min(1, "Store ID is required"),
})
