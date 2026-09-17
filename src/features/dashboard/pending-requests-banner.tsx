import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AttendanceRequestStatus } from "@/generated/prisma/enums"
import type { AttendanceRequestWithRelations } from "@/features/requests/request.types"
import { Link } from "@tanstack/react-router"
import { formatDistanceToNow } from "date-fns"

export function PendingRequestsBanner({
  requests,
}: {
  requests: AttendanceRequestWithRelations[]
}) {
  if (requests.length === 0) return null

  const oldest = requests.reduce((earliest, request) =>
    request.createdAt < earliest.createdAt ? request : earliest
  )

  return (
    <Card size="sm" className="mx-4 rounded-md">
      <CardContent>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold">
            {requests.length} request{requests.length > 1 ? "s" : ""} need you
          </p>
          <Badge variant={AttendanceRequestStatus.PENDING}>Pending</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Oldest filed{" "}
          {formatDistanceToNow(oldest.createdAt, { addSuffix: true })}
        </p>
        <Button
          nativeButton={false}
          className="w-full"
          render={<Link to="/requests" />}
        >
          Review requests
        </Button>
      </CardContent>
    </Card>
  )
}
