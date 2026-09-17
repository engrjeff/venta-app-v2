import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty"
import { ApproveRequestDialog } from "@/features/requests/approve-request-dialog"
import { DeclineRequestDialog } from "@/features/requests/decline-request-dialog"
import { ATTENDANCE_REQUEST_TYPE_LABELS } from "@/features/requests/request-labels"
import type { AttendanceRequestWithRelations } from "@/features/requests/request.types"
import { getRequestedTime } from "@/features/requests/request.utils"
import { formatTimeOfDay } from "@/lib/utils"
import { Link } from "@tanstack/react-router"
import { formatDate } from "date-fns"
import { InboxIcon } from "lucide-react"
import { useState } from "react"

type RequestAction = "approve" | "decline"

function PendingRequestItem({
  request,
}: {
  request: AttendanceRequestWithRelations
}) {
  const [action, setAction] = useState<RequestAction>()

  const requestedTime = getRequestedTime(request)

  return (
    <div className="rounded-md border p-3">
      <p className="text-sm font-semibold">
        {request.employee.lastName}, {request.employee.firstName}
      </p>
      <p className="text-xs text-muted-foreground">
        {ATTENDANCE_REQUEST_TYPE_LABELS[request.type]} &middot;{" "}
        {formatDate(request.attendance.date, "MMM d")}
        {requestedTime && `, wants ${formatTimeOfDay(requestedTime)}`}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          className="flex-1"
          onClick={() => setAction("approve")}
        >
          Approve
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => setAction("decline")}
        >
          Decline
        </Button>
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
    </div>
  )
}

export function PendingRequestsWidget({
  requests,
}: {
  requests: AttendanceRequestWithRelations[]
}) {
  return (
    <Card size="sm" className="h-full rounded-md">
      <CardHeader>
        <CardTitle>Pending Requests</CardTitle>
        <CardAction>
          <Button
            nativeButton={false}
            size="xs"
            variant="link"
            className="text-blue-500"
            render={<Link to="/requests">View all</Link>}
          />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {requests.length === 0 ? (
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="size-4">
                <InboxIcon className="size-4" />
              </EmptyMedia>
              <EmptyDescription>No pending requests</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          requests.map((request) => (
            <PendingRequestItem key={request.id} request={request} />
          ))
        )}
      </CardContent>
    </Card>
  )
}
