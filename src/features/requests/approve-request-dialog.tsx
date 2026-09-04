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
import { AttendanceRequestType } from "@/generated/prisma/enums"
import { formatTimeOfDay } from "@/lib/utils"
import { ATTENDANCE_REQUEST_TYPE_LABELS } from "./request-labels"
import type { AttendanceRequestWithRelations } from "./request.types"
import { requestsApi } from "./requests.functions"

interface ApproveRequestDialogProps {
  request: AttendanceRequestWithRelations
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApproveRequestDialog({
  request,
  open,
  onOpenChange,
}: ApproveRequestDialogProps) {
  const approveFn = useServerFn(requestsApi.approveFn)

  const [isPending, setIsPending] = useState(false)

  const router = useRouter()

  async function handleApprove() {
    try {
      setIsPending(true)
      const result = await approveFn({ data: { id: request.id } })

      if (result.error) {
        console.log("Error approving request: ", result.error)

        toast.error(result.error.message)

        return
      }

      toast.success("Request approved. Attendance has been updated.")

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
          <AlertDialogTitle>Approve this request?</AlertDialogTitle>
          <AlertDialogDescription>
            This will approve the{" "}
            <strong className="font-medium text-foreground">
              {ATTENDANCE_REQUEST_TYPE_LABELS[request.type]}
            </strong>{" "}
            request and update the attendance record as though the employee
            clocked out at{" "}
            {request.type === AttendanceRequestType.FORGOT_TO_CLOCK_OUT &&
            request.clockOutTime ? (
              <strong className="font-medium text-foreground">
                {formatTimeOfDay(request.clockOutTime)}
              </strong>
            ) : (
              "the requested time"
            )}
            .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <SubmitButton
            type="button"
            onClick={handleApprove}
            loading={isPending}
          >
            Approve
          </SubmitButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
