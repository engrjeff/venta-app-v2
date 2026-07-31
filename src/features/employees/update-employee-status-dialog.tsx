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
import type { Employee, EmploymentStatus } from "@/generated/prisma/browser"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import type { ComponentProps } from "react"
import { useState } from "react"
import { toast } from "sonner"
import { employeesApi } from "./employees.functions"

interface DeleteEmployeeDialogProps extends ComponentProps<typeof AlertDialog> {
  employee: Employee
  status: EmploymentStatus
  onAafterSave: VoidFunction
}

export function UpdateEmployeeStatusDialog({
  employee,
  status,
  onAafterSave,
  ...dialogProps
}: DeleteEmployeeDialogProps) {
  const changeStatus = useServerFn(employeesApi.updateStatus)

  const [isPending, setIsPending] = useState(false)

  const router = useRouter()

  async function handleDelete() {
    try {
      setIsPending(true)
      const result = await changeStatus({
        data: { employeeId: employee.id, status },
      })

      if (result.error) {
        console.log("Error updating employee status: ", result.error)

        toast.error(result.error.message)

        return
      }

      if (result.data?.id) {
        toast.success(`Employee status is successfully updated!`)
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
            This will mark{" "}
            <strong className="font-medium text-foreground">
              {employee.firstName} {employee.lastName}
            </strong>{" "}
            as{" "}
            <strong className="font-medium text-primary">
              {status.replaceAll("_", " ")}
            </strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <SubmitButton
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
