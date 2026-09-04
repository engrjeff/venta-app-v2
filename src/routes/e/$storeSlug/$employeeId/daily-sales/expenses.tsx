import { AddExpenseDialog } from "@/features/daily-sales/add-expense-dialog"
import { dailySalesApi } from "@/features/daily-sales/daily-sales.functions"
import { ExpensesList } from "@/features/daily-sales/expenses-list"
import { employeesApi } from "@/features/employees/employees.functions"
import { formatPHP } from "@/lib/utils"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/e/$storeSlug/$employeeId/daily-sales/expenses"
)({
  loader: async ({ context, params }) => {
    const employeeSession = context.employee

    if (
      !employeeSession?.branchId ||
      !employeeSession.storeId ||
      !employeeSession.employeeId
    ) {
      throw redirect({
        to: "/e/$storeSlug",
        params: { storeSlug: params.storeSlug },
      })
    }

    const today = new Date().toISOString().split("T")[0]

    const [expensesResult, employeesResult] = await Promise.all([
      dailySalesApi.getByBranchAndDate({
        data: { branchId: employeeSession.branchId, date: today },
      }),
      employeesApi.getAll({
        data: { storeId: employeeSession.storeId },
      }),
    ])

    return {
      storeId: employeeSession.storeId,
      branchId: employeeSession.branchId,
      employeeId: employeeSession.employeeId,
      expenses: expensesResult.data ?? [],
      employees: employeesResult.data ?? [],
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { storeId, branchId, employeeId, expenses, employees } =
    Route.useLoaderData()

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Total Expenses Today</p>
          <p className="font-mono text-lg font-semibold text-destructive">
            {formatPHP(total)}
          </p>
        </div>
        <AddExpenseDialog
          storeId={storeId}
          branchId={branchId}
          employeeId={employeeId}
          employees={employees}
        />
      </div>
      <ExpensesList expenses={expenses} employees={employees} />
    </div>
  )
}
