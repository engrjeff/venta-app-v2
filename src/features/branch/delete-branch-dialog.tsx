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
import type { Branch } from "@/generated/prisma/browser"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import type { ComponentProps } from "react"
import { useState } from "react"
import { toast } from "sonner"
import { branchApi } from "./branch.functions"

interface DeleteBranchDialogProps extends ComponentProps<typeof AlertDialog> {
  branch: Branch
  onAafterSave: VoidFunction
}

export function DeleteBranchDialog({
  branch,
  onAafterSave,
  ...dialogProps
}: DeleteBranchDialogProps) {
  const deleteAction = useServerFn(branchApi.remove)

  const [isPending, setIsPending] = useState(false)

  const router = useRouter()

  async function handleDelete() {
    try {
      setIsPending(true)
      const result = await deleteAction({ data: { id: branch.id } })

      if (result.error) {
        console.log("Error deleting branch: ", result.error)

        toast.error(result.error.message)

        return
      }

      if (result.data?.success) {
        toast.success(`Branch is successfully set as inactive!`)
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
            This action will make the branch{" "}
            <strong className="font-medium text-foreground">
              {branch.name}
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
