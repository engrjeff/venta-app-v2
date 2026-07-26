import z from "zod"

export const storeSchema = z.object({
  name: z
    .string({ error: "Store name is required" })
    .min(1, "Store name is required"),
  logo: z.url({ error: "Enter a valid URL for the logo" }).optional(),
})

export type CreateStoreInputs = z.infer<typeof storeSchema>

export const storeSettingsSchema = z.object({
  storeId: z.string({ error: "Store is required" }).min(1, "Store is required"),
  businessType: z
    .string({ error: "Business type is required" })
    .min(1, "Business type is required"),
})

export type CreateStoreSettingsInputs = z.infer<typeof storeSettingsSchema>

export const orgIdSchema = z.object({
  id: z
    .string({ error: "Store ID is required" })
    .min(1, "Store ID is required"),
})
