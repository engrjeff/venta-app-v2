import { formatDate } from "date-fns"
import { InboxIcon } from "lucide-react"
import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { AttendanceRequestType } from "@/generated/prisma/enums"
import { formatTimeOfDay } from "@/lib/utils"
import {
  ATTENDANCE_REQUEST_STATUS_LABELS,
  ATTENDANCE_REQUEST_TYPE_LABELS,
} from "./request-labels"
import type { AttendanceRequestWithRelations } from "./request.types"

interface RequestsListProps {
  requests: AttendanceRequestWithRelations[]
  showEmployee?: boolean
  renderActions?: (request: AttendanceRequestWithRelations) => ReactNode
}

export function RequestsList({
  requests,
  showEmployee,
  renderActions,
}: RequestsListProps) {
  if (!requests.length)
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <InboxIcon />
          </EmptyMedia>
          <EmptyTitle>No requests yet</EmptyTitle>
          <EmptyDescription>
            {showEmployee
              ? "Employee requests will appear here."
              : "Requests to admin will appear here."}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )

  return (
    <ul className="space-y-3">
      {requests.map((request) => (
        <li key={request.id}>
          <div className="relative space-y-2 rounded-md bg-card p-3 text-sm shadow">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <p className="font-medium">
                    {ATTENDANCE_REQUEST_TYPE_LABELS[request.type]}
                  </p>
                  {renderActions && (
                    <Badge className="p-1.5" variant={request.status}>
                      {ATTENDANCE_REQUEST_STATUS_LABELS[request.status]}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {showEmployee &&
                    `${request.employee.firstName} ${request.employee.lastName} · `}
                  For {formatDate(request.attendance.date, "MMM dd, yyy")}{" "}
                </p>
              </div>
              {renderActions ? (
                <div className="absolute top-0.5 right-0.5">
                  {renderActions(request)}
                </div>
              ) : (
                <Badge className="p-1.5" variant={request.status}>
                  {ATTENDANCE_REQUEST_STATUS_LABELS[request.status]}
                </Badge>
              )}
            </div>
            {request.type === AttendanceRequestType.FORGOT_TO_CLOCK_OUT &&
              request.clockOutTime && (
                <p className="text-muted-foreground">
                  Requested clock-out:{" "}
                  <span className="font-medium text-foreground">
                    {formatTimeOfDay(request.clockOutTime)}
                  </span>
                </p>
              )}
            <p className="text-muted-foreground">Reason: {request.reason}</p>
            <p className="text-xs text-muted-foreground">
              Submitted{" "}
              {formatDate(request.createdAt, "MMM dd, yyy 'at' hh:mm a")}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
