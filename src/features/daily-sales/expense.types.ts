import type { Employee, Expense } from "@/generated/prisma/browser"

export type ExpenseWithEmployee = Expense & {
  employee: Pick<Employee, "id" | "firstName" | "lastName">
}
