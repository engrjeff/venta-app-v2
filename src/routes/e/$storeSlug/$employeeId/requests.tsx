import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { createFileRoute } from "@tanstack/react-router"
import { InboxIcon } from "lucide-react"

export const Route = createFileRoute("/e/$storeSlug/$employeeId/requests")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <InboxIcon />
          </EmptyMedia>
          <EmptyTitle>No requests yet</EmptyTitle>
          <EmptyDescription>
            Requests to admin will appear here
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button type="button" size="sm">
            Create a Request
          </Button>
        </EmptyContent>
      </Empty>
    </>
  )
}
