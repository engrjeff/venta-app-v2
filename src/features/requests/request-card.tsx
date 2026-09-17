import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AttendanceDetailsSheet } from "@/features/attendance/attendance-details-sheet"
import { AttendanceRequestStatus } from "@/generated/prisma/enums"
import { formatTime, formatTimeOfDay, getInitials } from "@/lib/utils"
import { formatDate } from "date-fns"
import { useState } from "react"
import { ApproveRequestDialog } from "./approve-request-dialog"
import { DeclineRequestDialog } from "./decline-request-dialog"
import {
  ATTENDANCE_REQUEST_APPROVED_NOTE_LABELS,
  ATTENDANCE_REQUEST_RECORDED_TIME_LABELS,
  ATTENDANCE_REQUEST_STATUS_LABELS,
  ATTENDANCE_REQUEST_TIME_LABELS,
  ATTENDANCE_REQUEST_TYPE_LABELS,
} from "./request-labels"
import type { AttendanceRequestWithRelations } from "./request.types"
import { getRecordedTime, getRequestedTime } from "./request.utils"

type RequestAction = "approve" | "decline"

export function RequestCard({
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
      <li className="flex items-center justify-between gap-4 rounded-md border bg-card p-4 text-sm">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold">
                {request.employee.lastName}, {request.employee.firstName}
              </p>
              <Badge variant={request.status}>
                {ATTENDANCE_REQUEST_STATUS_LABELS[request.status]}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDate(request.attendance.date, "MMM dd, yyyy")} &middot;{" "}
              {request.attendance.branch.name}
              {approvedTime &&
                ` · ${ATTENDANCE_REQUEST_APPROVED_NOTE_LABELS[request.type]} ${formatTimeOfDay(approvedTime)}`}
            </p>
          </div>
        </div>
        {request.reviewedAt && (
          <p className="text-xs text-muted-foreground">
            Reviewed {formatDate(request.reviewedAt, "MMM d")}
          </p>
        )}
      </li>
    )
  }

  const recordedTime = getRecordedTime(request)
  const requestedTime = getRequestedTime(request)

  return (
    <li className="rounded-md border bg-card p-4 text-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback className="font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold">
                {request.employee.lastName}, {request.employee.firstName}
              </p>
              <Badge variant="outline">
                {ATTENDANCE_REQUEST_TYPE_LABELS[request.type]}
              </Badge>
              <Badge variant={request.status}>
                {ATTENDANCE_REQUEST_STATUS_LABELS[request.status]}
              </Badge>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Attendance date</p>
                <p className="font-medium">
                  {formatDate(request.attendance.date, "EEE, MMM dd yyyy")}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Branch</p>
                <p className="font-medium">{request.attendance.branch.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {ATTENDANCE_REQUEST_RECORDED_TIME_LABELS[request.type]}
                </p>
                <p className="font-mono font-medium">
                  {recordedTime ? formatTime(recordedTime) : "--"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {ATTENDANCE_REQUEST_TIME_LABELS[request.type]}
                </p>
                <p className="font-mono font-medium text-emerald-500">
                  {requestedTime ? formatTimeOfDay(requestedTime) : "--"}
                </p>
              </div>
            </div>

            <div className="mt-3 rounded-md bg-muted/50 p-3 text-muted-foreground italic">
              "{request.reason}"
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <p className="text-xs whitespace-nowrap text-muted-foreground">
            filed {formatDate(request.createdAt, "MMM d, h:mm a")}
          </p>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              size="sm"
              onClick={() => setAction("approve")}
            >
              Approve
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="text-destructive"
              onClick={() => setAction("decline")}
            >
              Decline
            </Button>
            <AttendanceDetailsSheet
              employee={request.employee}
              attendance={request.attendance}
            />
          </div>
        </div>
      </div>

      <ApproveRequestDialog
        request={request}
        open={action === "approve"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setAction(undefined)
        }}
      />
      <DeclineRequestDialog
        request={request}
        open={action === "decline"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setAction(undefined)
        }}
      />
    </li>
  )
}
