import { ReceiptIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { formatPHP, formatTime, getInitials } from "@/lib/utils"
import type { ExpenseEmployeeOption } from "./add-expense-dialog"
import { ExpenseActions } from "./expense-actions"
import type { ExpenseWithEmployee } from "./expense.types"

interface ExpensesListProps {
  expenses: ExpenseWithEmployee[]
  employees: ExpenseEmployeeOption[]
}

export function ExpensesList({ expenses, employees }: ExpensesListProps) {
  if (!expenses.length)
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ReceiptIcon />
          </EmptyMedia>
          <EmptyTitle>No expenses recorded yet</EmptyTitle>
          <EmptyDescription>
            Expenses logged for today will appear here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )

  return (
    <ul className="space-y-3">
      {expenses.map((expense) => (
        <li key={expense.id}>
          <div className="flex items-start gap-3 rounded-md bg-card p-3 shadow">
            <Avatar size="sm" className="mt-0.5">
              <AvatarFallback>
                {getInitials(
                  expense.employee.firstName,
                  expense.employee.lastName
                )}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium wrap-break-word">
                {expense.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {expense.employee.firstName} {expense.employee.lastName}
                {" · "}
                {formatTime(expense.createdAt)}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <span className="font-mono text-sm font-semibold text-destructive">
                {formatPHP(expense.amount)}
              </span>
              <ExpenseActions expense={expense} employees={employees} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
