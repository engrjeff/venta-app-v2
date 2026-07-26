import z from "zod"

export const storeIdSchema = z.object({
  id: z
    .string({ error: "Store ID is required" })
    .min(1, "Store ID is required"),
})

export const storeSlugSchema = z.object({
  slug: z
    .string({ error: "Store slug is required" })
    .min(1, "Store slug is required"),
})
