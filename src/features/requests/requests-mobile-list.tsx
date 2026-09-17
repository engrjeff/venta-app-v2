import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty"
import { InboxIcon } from "lucide-react"
import { RequestMobileCard } from "./request-mobile-card"
import type { AttendanceRequestWithRelations } from "./request.types"

export function RequestsMobileList({
  requests,
}: {
  requests: AttendanceRequestWithRelations[]
}) {
  if (requests.length === 0) {
    return (
      <Empty className="mx-4 border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="size-4">
            <InboxIcon className="size-4" />
          </EmptyMedia>
          <EmptyDescription>No requests to show</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-3 px-4">
      {requests.map((request) => (
        <RequestMobileCard key={request.id} request={request} />
      ))}
    </div>
  )
}
