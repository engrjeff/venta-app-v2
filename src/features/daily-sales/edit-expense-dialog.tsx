import { ResponsiveFormSheet } from "@/components/responsive-form-sheet"
import type { ExpenseEmployeeOption } from "./add-expense-dialog"
import type { ExpenseWithEmployee } from "./expense.types"
import { UpdateExpenseForm } from "./update-expense-form"

interface EditExpenseDialogProps {
  expense: ExpenseWithEmployee
  employees: ExpenseEmployeeOption[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditExpenseDialog({
  expense,
  employees,
  open,
  onOpenChange,
}: EditExpenseDialogProps) {
  const close = () => onOpenChange(false)

  return (
    <ResponsiveFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Expense"
      description="Make sure to save your changes."
    >
      <UpdateExpenseForm
        expense={expense}
        employees={employees}
        onAfterSave={close}
        onCancel={close}
      />
    </ResponsiveFormSheet>
  )
}
