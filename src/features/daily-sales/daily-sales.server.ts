import { prisma } from "@/lib/db"
import type {
  CreateExpenseInput,
  ExpenseIdInput,
  ExpensesByBranchAndDateInput,
  UpdateExpenseInput,
} from "./schema"

export async function createExpense(input: CreateExpenseInput) {
  try {
    const expense = await prisma.expense.create({
      data: {
        organizationId: input.storeId,
        branchId: input.branchId,
        employeeId: input.employeeId,
        description: input.description,
        amount: input.amount,
        date: new Date(input.date),
      },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true } },
      },
    })

    return { data: expense, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}

export async function getExpensesByBranchAndDate(
  input: ExpensesByBranchAndDateInput
) {
  try {
    const expenses = await prisma.expense.findMany({
      where: { branchId: input.branchId, date: new Date(input.date) },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return { data: expenses, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}

export async function updateExpense(input: UpdateExpenseInput) {
  try {
    const expense = await prisma.expense.update({
      where: { id: input.id },
      data: {
        branchId: input.branchId,
        employeeId: input.employeeId,
        description: input.description,
        amount: input.amount,
        date: new Date(input.date),
      },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true } },
      },
    })

    return { data: expense, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}

export async function deleteExpense(input: ExpenseIdInput) {
  try {
    await prisma.expense.delete({ where: { id: input.id } })

    return { data: { success: true }, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}
