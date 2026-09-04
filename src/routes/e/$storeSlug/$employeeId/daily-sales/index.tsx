import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { createFileRoute } from "@tanstack/react-router"
import { ChartNoAxesColumnIcon } from "lucide-react"

export const Route = createFileRoute("/e/$storeSlug/$employeeId/daily-sales/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ChartNoAxesColumnIcon />
        </EmptyMedia>
        <EmptyTitle>Summary coming soon</EmptyTitle>
        <EmptyDescription>
          A daily overview of sales, expenses, and cash-on-hand will appear
          here.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
