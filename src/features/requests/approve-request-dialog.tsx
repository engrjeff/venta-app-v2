import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { CheckIcon } from "lucide-react"
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
import {
  formatDurationFromSeconds,
  formatPHP,
  formatTimeOfDay,
} from "@/lib/utils"
import { formatDate } from "date-fns"
import { getApprovalPreview } from "./request-approval-preview"
import type { AttendanceRequestWithRelations } from "./request.types"
import { getRequestedTime } from "./request.utils"
import { requestsApi } from "./requests.functions"

const APPROVE_TIME_VERBS: Record<AttendanceRequestType, string> = {
  [AttendanceRequestType.FORGOT_TO_CLOCK_OUT]: "clock out",
  [AttendanceRequestType.EDIT_TIME_OUT]: "clock out",
  [AttendanceRequestType.EDIT_TIME_IN]: "clock in",
}

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

  const requestedTime = getRequestedTime(request)
  const preview = getApprovalPreview(request)

  const title = requestedTime
    ? `Approve and set ${APPROVE_TIME_VERBS[request.type]} to ${formatTimeOfDay(requestedTime)}?`
    : "Approve this request?"

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
          <div className="flex items-center gap-2">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
              <CheckIcon className="size-3.5" />
            </span>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            {preview ? (
              <>
                {formatDate(request.attendance.date, "MMM d")} becomes a{" "}
                <strong className="font-medium text-foreground">
                  {formatDurationFromSeconds(preview.totalWorkedSeconds)}
                </strong>{" "}
                shift for {request.employee.firstName}
                {preview.overtimeSeconds > 0 && (
                  <>
                    {" — "}
                    {formatDurationFromSeconds(
                      preview.regularWorkedSeconds
                    )}{" "}
                    regular plus{" "}
                    {formatDurationFromSeconds(preview.overtimeSeconds)}{" "}
                    overtime
                  </>
                )}
                .
              </>
            ) : (
              "This will approve the request and update the attendance record."
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {preview && (
          <div className="space-y-2 rounded-md border p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Earnings for that day
              </span>
              <span className="font-mono font-medium">
                {formatPHP(request.attendance.totalPay ?? 0)} →{" "}
                {formatPHP(preview.totalPay)}
              </span>
            </div>
            {preview.overtimeSeconds > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Overtime added</span>
                <span className="font-mono font-medium text-amber-500">
                  {formatDurationFromSeconds(preview.overtimeSeconds)}
                </span>
              </div>
            )}
          </div>
        )}

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
