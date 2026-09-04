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
import { ATTENDANCE_REQUEST_TYPE_LABELS } from "./request-labels"
import type { AttendanceRequestWithRelations } from "./request.types"
import { requestsApi } from "./requests.functions"

interface DeclineRequestDialogProps {
  request: AttendanceRequestWithRelations
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeclineRequestDialog({
  request,
  open,
  onOpenChange,
}: DeclineRequestDialogProps) {
  const declineFn = useServerFn(requestsApi.declineFn)

  const [isPending, setIsPending] = useState(false)

  const router = useRouter()

  async function handleDecline() {
    try {
      setIsPending(true)
      const result = await declineFn({ data: { id: request.id } })

      if (result.error) {
        console.log("Error declining request: ", result.error)

        toast.error(result.error.message)

        return
      }

      toast.success("Request declined.")

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
          <AlertDialogTitle>Decline this request?</AlertDialogTitle>
          <AlertDialogDescription>
            This will decline the{" "}
            <strong className="font-medium text-foreground">
              {ATTENDANCE_REQUEST_TYPE_LABELS[request.type]}
            </strong>{" "}
            request. The employee&apos;s attendance record will not be changed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <SubmitButton
            variant="destructive"
            type="button"
            onClick={handleDecline}
            loading={isPending}
          >
            Decline
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
