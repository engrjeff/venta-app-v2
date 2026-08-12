import { SalaryType } from "@/generated/prisma/enums"
import z from "zod"

// the storeId is the organizationId
export const designationSchema = z.object({
  storeId: z.string({ error: "Store is required" }).min(1, "Store is required"),
  name: z
    .string({ error: "Designation is required" })
    .min(1, "Designation is required"),
  salaryType: z.enum(SalaryType, { error: "Invalid salary type" }),
  salaryRate: z
    .number({ error: "Invalid salary rate" })
    .gt(0, { error: "Invalid salary rate" }),
})

export const designationArraySchema = z.object({
  storeId: z.string({ error: "Store is required" }).min(1, "Store is required"),
  designations: designationSchema
    .omit({ storeId: true })
    .array()
    .min(1, { error: "Provide at least 1 designation" }),
})

export const designationIdSchema = z.object({
  id: z
    .string({ error: "Designation ID is required" })
    .min(1, "Designation ID is required"),
})

export const designationUpdateSchema = designationSchema.extend({
  id: z
    .string({ error: "Designation ID is required" })
    .min(1, "Designation ID is required"),
})

export type CreateDesignationInput = z.infer<typeof designationSchema>

export type CreateManyDesignationInput = z.infer<typeof designationArraySchema>

export type DesignationIdInput = z.infer<typeof designationIdSchema>

export type UpdateDesignationInput = z.infer<typeof designationUpdateSchema>
