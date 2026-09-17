import { createServerFn } from "@tanstack/react-start"
import {
  createExpense,
  deleteExpense,
  getExpensesByBranchAndDate,
  updateExpense,
} from "./daily-sales.server"
import {
  expenseIdSchema,
  expenseSchema,
  expenseUpdateSchema,
  expensesByBranchAndDateSchema,
} from "./schema"

export const createExpenseFn = createServerFn({ method: "POST" })
  .validator(expenseSchema)
  .handler(async ({ data }) => {
    return createExpense(data)
  })

export const getByBranchAndDate = createServerFn({ method: "GET" })
  .validator(expensesByBranchAndDateSchema)
  .handler(async ({ data }) => {
    return getExpensesByBranchAndDate(data)
  })

export const updateExpenseFn = createServerFn({ method: "POST" })
  .validator(expenseUpdateSchema)
  .handler(async ({ data }) => {
    return updateExpense(data)
  })

export const deleteExpenseFn = createServerFn({ method: "POST" })
  .validator(expenseIdSchema)
  .handler(async ({ data }) => {
    return deleteExpense(data)
  })

export const dailySalesApi = {
  createExpenseFn,
  getByBranchAndDate,
  updateExpenseFn,
  deleteExpenseFn,
}
