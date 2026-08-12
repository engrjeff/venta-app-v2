import { EmploymentStatus } from "@/generated/prisma/enums"
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

export const addEmployeeSchema = employeeSchema
  .omit({ branchId: true })
  .extend({
    branches: z.array(z.string(), { error: "Assign at least 1 branch" }),
  })

export const updateEmployeeSchema = addEmployeeSchema.extend({
  id: z
    .string({ error: "Employee ID is required" })
    .min(1, "Employee ID is required"),
})

export const updateEmployeeStatusSchema = z.object({
  employeeId: z
    .string({ error: "Employee ID is required" })
    .min(1, "Employee ID is required"),
  status: z.enum(EmploymentStatus),
})

export const updateEmployeeSessionSchema = z.object({
  attendanceId: z
    .string({ error: "Attendance ID is required" })
    .min(1, "Attendance ID is required"),
  branchId: z
    .string({ error: "Branch ID is required" })
    .min(1, "Branch ID is required"),
  branchName: z
    .string({ error: "Branch Name is required" })
    .min(1, "Branch Name is required"),
  timeIn: z.iso.datetime({ local: true, error: "Clock-in time is required" }),
})

export const getEmployeesInputSchema = z.object({
  storeId: z.string({ error: "Store is required" }).min(1, "Store is required"),
  q: z.string().optional(), // search query
})

export type EmployeeIdInput = z.infer<typeof employeeIdSchema>

export type CreateEmployeeInput = z.infer<typeof employeeSchema>

export type CreateManyEmployeeInput = z.infer<typeof employeeArraySchema>

export type VerifyUsernameInput = z.infer<typeof employeeUsernameSchema>

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>

export type UpdateEmployeeStatusInput = z.infer<
  typeof updateEmployeeStatusSchema
>

export type GetEmployeesInput = z.infer<typeof getEmployeesInputSchema>

export type UpdateEmployeeSessionInput = z.infer<
  typeof updateEmployeeSessionSchema
>

export type AddEmployeeInput = z.infer<typeof addEmployeeSchema>
