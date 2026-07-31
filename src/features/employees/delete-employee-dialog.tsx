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
import type { Employee } from "@/generated/prisma/browser"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import type { ComponentProps } from "react"
import { useState } from "react"
import { toast } from "sonner"
import { employeesApi } from "./employees.functions"

interface DeleteEmployeeDialogProps extends ComponentProps<typeof AlertDialog> {
  employee: Employee
  onAafterSave: VoidFunction
}

export function DeleteEmployeeDialog({
  employee,
  onAafterSave,
  ...dialogProps
}: DeleteEmployeeDialogProps) {
  const deleteAction = useServerFn(employeesApi.remove)

  const [isPending, setIsPending] = useState(false)

  const router = useRouter()

  async function handleDelete() {
    try {
      setIsPending(true)
      const result = await deleteAction({ data: { employeeId: employee.id } })

      if (result.error) {
        console.log("Error deleting employee: ", result.error)

        toast.error(result.error.message)

        return
      }

      if (result.data?.success) {
        toast.success(`Employee is successfully deleted!`)
      }

      await router.invalidate()

      onAafterSave()
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
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <strong className="font-medium text-foreground">
              {employee.firstName} {employee.lastName}
            </strong>{" "}
            from your employee list.
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
