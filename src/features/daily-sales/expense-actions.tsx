import { useState } from "react"
import { EditIcon, MoreHorizontalIcon, TrashIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ExpenseEmployeeOption } from "./add-expense-dialog"
import { DeleteExpenseDialog } from "./delete-expense-dialog"
import { EditExpenseDialog } from "./edit-expense-dialog"
import type { ExpenseWithEmployee } from "./expense.types"

type ExpenseAction = "edit" | "delete"

export function ExpenseActions({
  expense,
  employees,
}: {
  expense: ExpenseWithEmployee
  employees: ExpenseEmployeeOption[]
}) {
  const [action, setAction] = useState<ExpenseAction>()

  function resetAction() {
    setAction(undefined)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              aria-label="Expense actions"
              variant="ghost"
              size="icon-sm"
            >
              <MoreHorizontalIcon />
            </Button>
          }
        />
        <DropdownMenuContent className="min-w-max" side="left">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setAction("edit")}>
              <EditIcon /> Edit
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setAction("delete")}
            >
              <TrashIcon /> Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditExpenseDialog
        expense={expense}
        employees={employees}
        open={action === "edit"}
        onOpenChange={(isOpen) => {
          if (!isOpen) resetAction()
        }}
      />

      <DeleteExpenseDialog
        expense={expense}
        open={action === "delete"}
        onOpenChange={(isOpen) => {
          if (!isOpen) resetAction()
        }}
      />
    </>
  )
}
