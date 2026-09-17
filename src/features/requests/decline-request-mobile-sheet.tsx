import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { useState } from "react"
import { toast } from "sonner"

import { SubmitButton } from "@/components/submit-button"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { AttendanceRequestType } from "@/generated/prisma/enums"
import { formatDate } from "date-fns"
import type { AttendanceRequestWithRelations } from "./request.types"
import { requestsApi } from "./requests.functions"

const QUICK_DECLINE_REASONS = [
  "No duty that day",
  "Time doesn't match records",
  "Filed too late",
]

function getDeclineDescription(request: AttendanceRequestWithRelations) {
  const name = request.employee.firstName
  const dateLabel = formatDate(request.attendance.date, "MMM d")

  if (!request.attendance.timeOut) {
    return `${name}'s ${dateLabel} shift stays without a clock-out, so that day earns nothing. They'll see your reason in their portal.`
  }

  if (request.type === AttendanceRequestType.EDIT_TIME_IN) {
    return `${name}'s ${dateLabel} shift keeps its current clock-in time. They'll see your reason in their portal.`
  }

  return `${name}'s ${dateLabel} shift keeps its current clock-out time. They'll see your reason in their portal.`
}

interface DeclineRequestMobileSheetProps {
  request: AttendanceRequestWithRelations
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeclineRequestMobileSheet({
  request,
  open,
  onOpenChange,
}: DeclineRequestMobileSheetProps) {
  const declineFn = useServerFn(requestsApi.declineFn)

  const [declineReason, setDeclineReason] = useState("")
  const [isPending, setIsPending] = useState(false)

  const router = useRouter()

  async function handleDecline() {
    if (!declineReason.trim()) return

    try {
      setIsPending(true)
      const result = await declineFn({
        data: { id: request.id, declineReason: declineReason.trim() },
      })

      if (result.error) {
        toast.error(result.error.message)

        return
      }

      toast.success("Request declined.")

      await router.invalidate()

      onOpenChange(false)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
        return
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) setDeclineReason("")
        onOpenChange(isOpen)
      }}
    >
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="gap-0 rounded-t-2xl p-0"
      >
        <div className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-muted" />

        <SheetHeader>
          <SheetTitle>Decline this request?</SheetTitle>
          <p className="text-sm text-muted-foreground">
            {getDeclineDescription(request)}
          </p>
        </SheetHeader>

        <div className="space-y-2 px-4">
          <div className="flex items-center gap-1.5 text-sm font-medium">
            Reason <span className="text-destructive">required</span>
          </div>
          <Textarea
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            placeholder="Tell them why, so they can correct it next time..."
            aria-invalid={!declineReason.trim()}
          />
          <div className="flex flex-wrap gap-2">
            {QUICK_DECLINE_REASONS.map((reason) => (
              <Button
                key={reason}
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => setDeclineReason(reason)}
              >
                {reason}
              </Button>
            ))}
          </div>
        </div>

        <SheetFooter className="flex-row">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Keep pending
          </Button>
          <SubmitButton
            variant="outline"
            className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
            type="button"
            onClick={handleDecline}
            loading={isPending}
            disabled={!declineReason.trim()}
          >
            Decline
          </SubmitButton>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
