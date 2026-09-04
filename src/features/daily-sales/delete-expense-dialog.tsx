import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { useState } from "react"
import { toast } from "sonner"

import { SubmitButton } from "@/components/submit-button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { formatPHP } from "@/lib/utils"
import { dailySalesApi } from "./daily-sales.functions"
import type { ExpenseWithEmployee } from "./expense.types"

interface DeleteExpenseDialogProps {
  expense: ExpenseWithEmployee
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteExpenseDialog({
  expense,
  open,
  onOpenChange,
}: DeleteExpenseDialogProps) {
  const deleteExpenseFn = useServerFn(dailySalesApi.deleteExpenseFn)

  const [isPending, setIsPending] = useState(false)

  const router = useRouter()

  async function handleDelete() {
    try {
      setIsPending(true)
      const result = await deleteExpenseFn({ data: { id: expense.id } })

      if (result.error) {
        console.log("Error deleting expense: ", result.error)

        toast.error(result.error.message)

        return
      }

      if (result.data?.success) {
        toast.success("Expense successfully deleted!")
      }

      await router.invalidate()

      onOpenChange(false)
    } catch (error) {
      console.log("Thrown Error: ", error)

      if (error instanceof Error) {
        toast.error(error.message)
        return
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the{" "}
            <strong className="font-medium text-foreground">
              {formatPHP(expense.amount)}
            </strong>{" "}
            expense for &quot;{expense.description}&quot;.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <SubmitButton
            variant="destructive"
            type="button"
            onClick={handleDelete}
            loading={isPending}
          >
            Continue
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
