import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AttendanceRequestStatus } from "@/generated/prisma/enums"
import {
  formatDurationFromSeconds,
  formatTime,
  formatTimeOfDay,
  getInitials,
} from "@/lib/utils"
import { formatDate } from "date-fns"
import { useState } from "react"
import { ApproveRequestMobileSheet } from "./approve-request-mobile-sheet"
import { DeclineRequestMobileSheet } from "./decline-request-mobile-sheet"
import {
  ATTENDANCE_REQUEST_APPROVED_NOTE_LABELS,
  ATTENDANCE_REQUEST_RECORDED_TIME_LABELS,
  ATTENDANCE_REQUEST_STATUS_LABELS,
  ATTENDANCE_REQUEST_TIME_LABELS,
  ATTENDANCE_REQUEST_TYPE_LABELS,
} from "./request-labels"
import { getApprovalPreview } from "./request-approval-preview"
import type { AttendanceRequestWithRelations } from "./request.types"
import {
  formatRequestAge,
  getRecordedTime,
  getRequestedTime,
} from "./request.utils"

type RequestAction = "approve" | "decline"

export function RequestMobileCard({
  request,
}: {
  request: AttendanceRequestWithRelations
}) {
  const [action, setAction] = useState<RequestAction>()

  const initials = getInitials(
    request.employee.firstName,
    request.employee.lastName
  )

  if (request.status !== AttendanceRequestStatus.PENDING) {
    const approvedTime =
      request.status === AttendanceRequestStatus.APPROVED
        ? getRequestedTime(request)
        : null

    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border bg-card p-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">
              {request.employee.lastName}, {request.employee.firstName}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(request.attendance.date, "MMM d")}
              {approvedTime &&
                ` · ${ATTENDANCE_REQUEST_APPROVED_NOTE_LABELS[request.type]} ${formatTimeOfDay(approvedTime)}`}
              {request.status === AttendanceRequestStatus.DECLINED &&
                request.declineReason &&
                ` · ${request.declineReason}`}
            </p>
          </div>
        </div>
        <Badge variant={request.status}>
          {ATTENDANCE_REQUEST_STATUS_LABELS[request.status]}
        </Badge>
      </div>
    )
  }

  const recordedTime = getRecordedTime(request)
  const requestedTime = getRequestedTime(request)
  const preview = getApprovalPreview(request)

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm font-semibold">
            {request.employee.lastName}, {request.employee.firstName}
          </p>
        </div>
        <p className="shrink-0 text-xs text-muted-foreground">
          {formatRequestAge(request.createdAt)}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="outline">
          {ATTENDANCE_REQUEST_TYPE_LABELS[request.type]}
        </Badge>
        <Badge variant={request.status}>
          {ATTENDANCE_REQUEST_STATUS_LABELS[request.status]}
        </Badge>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3 rounded-md bg-muted/40 p-3">
        <div>
          <p className="text-xs text-muted-foreground">
            {ATTENDANCE_REQUEST_RECORDED_TIME_LABELS[request.type]}
          </p>
          <p className="font-mono text-sm font-medium">
            {recordedTime ? formatTime(recordedTime) : "--"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">
            {ATTENDANCE_REQUEST_TIME_LABELS[request.type]}
          </p>
          <p className="font-mono text-sm font-medium text-emerald-500">
            {requestedTime ? formatTimeOfDay(requestedTime) : "--"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Becomes</p>
          <p className="font-mono text-sm font-medium">
            {preview
              ? formatDurationFromSeconds(preview.totalWorkedSeconds)
              : "--"}
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-md bg-muted/50 p-3 text-sm text-muted-foreground italic">
        "{request.reason}"
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1 text-destructive"
          onClick={() => setAction("decline")}
        >
          Decline
        </Button>
        <Button
          type="button"
          className="flex-1"
          onClick={() => setAction("approve")}
        >
          Approve
        </Button>
      </div>

      <ApproveRequestMobileSheet
        request={request}
        open={action === "approve"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setAction(undefined)
        }}
      />
      <DeclineRequestMobileSheet
        request={request}
        open={action === "decline"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setAction(undefined)
        }}
      />
    </div>
  )
}
