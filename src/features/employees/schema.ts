import z from "zod"

// the storeId is the organizationId
export const employeeSchema = z.object({
  storeId: z.string({ error: "Store is required" }).min(1, "Store is required"),
  designationId: z
    .string({ error: "Designation is required" })
    .min(1, "Designation is required"),
  branchId: z
    .string({ error: "Branch is required" })
    .min(1, "Branch is required"),
  firstName: z
    .string({ error: "First name is required" })
    .min(1, "First name is required"),
  lastName: z
    .string({ error: "Last name is required" })
    .min(1, "Last name is required"),
  username: z
    .string({ error: "Username is required" })
    .min(6, "Username should be at least 6 characters"),
  email: z
    .union([z.undefined(), z.literal(""), z.email({ error: "Invalid email" })])
    .optional(),
  phone: z.string().optional(),
})

export const employeeArraySchema = z.object({
  storeId: z.string({ error: "Store is required" }).min(1, "Store is required"),
  storeName: z
    .string({ error: "Store is required" })
    .min(1, "Store is required"),
  employees: employeeSchema
    .omit({ storeId: true })
    .array()
    .min(1, { error: "Provide at least 1 employee" }),
})

export const employeeUsernameSchema = z.object({
  storeId: z.string({ error: "Store is required" }).min(1, "Store is required"),
  username: z
    .string({ error: "Username is required" })
    .min(1, "Username is required"),
})

export const employeeIdSchema = z.object({
  employeeId: z
    .string({ error: "Employee ID is required" })
    .min(1, "Employee ID is required"),
})

export type CreateEmployeeInput = z.infer<typeof employeeSchema>

export type CreateManyEmployeeInput = z.infer<typeof employeeArraySchema>

export type VerifyUsernameInput = z.infer<typeof employeeUsernameSchema>
