import z from "zod"

// the storeId is the organizationId
export const expenseSchema = z.object({
  storeId: z.string({ error: "Store is required" }).min(1, "Store is required"),
  branchId: z
    .string({ error: "Branch is required" })
    .min(1, "Branch is required"),
  employeeId: z
    .string({ error: "Responsible employee is required" })
    .min(1, "Responsible employee is required"),
  description: z
    .string({ error: "Description is required" })
    .min(1, "Description is required"),
  amount: z
    .number({ error: "Invalid amount" })
    .gt(0, { error: "Amount must be greater than 0" }),
  date: z.iso.date({ error: "Date is required" }),
})

export const expenseIdSchema = z.object({
  id: z
    .string({ error: "Expense ID is required" })
    .min(1, "Expense ID is required"),
})

export const expenseUpdateSchema = expenseSchema.extend({
  id: z
    .string({ error: "Expense ID is required" })
    .min(1, "Expense ID is required"),
})

export const expensesByBranchAndDateSchema = z.object({
  branchId: z
    .string({ error: "Branch is required" })
    .min(1, "Branch is required"),
  date: z.iso.date({ error: "Date is required" }),
})

export type CreateExpenseInput = z.infer<typeof expenseSchema>

export type ExpenseIdInput = z.infer<typeof expenseIdSchema>

export type UpdateExpenseInput = z.infer<typeof expenseUpdateSchema>

export type ExpensesByBranchAndDateInput = z.infer<
  typeof expensesByBranchAndDateSchema
>
