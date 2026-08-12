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
import type { Designation } from "@/generated/prisma/browser"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import type { ComponentProps } from "react"
import { useState } from "react"
import { toast } from "sonner"
import { designationsApi } from "./designations.functions"

interface DeleteDesignationDialogProps extends ComponentProps<
  typeof AlertDialog
> {
  designation: Designation
  onAafterSave: VoidFunction
}

export function DeleteDesignationDialog({
  designation,
  onAafterSave,
  ...dialogProps
}: DeleteDesignationDialogProps) {
  const deleteAction = useServerFn(designationsApi.remove)

  const [isPending, setIsPending] = useState(false)

  const router = useRouter()

  async function handleDelete() {
    try {
      setIsPending(true)
      const result = await deleteAction({ data: { id: designation.id } })

      if (result.error) {
        console.log("Error deleting designation: ", result.error)

        toast.error(result.error.message)

        return
      }

      if (result.data?.success) {
        toast.success(`Designation is successfully set as inactive!`)
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
            This action will make the designation{" "}
            <strong className="font-medium text-foreground">
              {designation.name}
            </strong>{" "}
            inactive.
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
