import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty"
import { RequestCard } from "@/features/requests/request-card"
import type { AttendanceRequestWithRelations } from "@/features/requests/request.types"
import { InboxIcon } from "lucide-react"

export function EmployeeRequestsTab({
  requests,
}: {
  requests: AttendanceRequestWithRelations[]
}) {
  if (requests.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="size-4">
            <InboxIcon className="size-4" />
          </EmptyMedia>
          <EmptyDescription>No requests yet</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {requests.map((request) => (
        <RequestCard key={request.id} request={request} />
      ))}
    </ul>
  )
}
