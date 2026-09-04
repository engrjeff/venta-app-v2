import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { createFileRoute } from "@tanstack/react-router"
import { BanknoteIcon } from "lucide-react"

export const Route = createFileRoute(
  "/e/$storeSlug/$employeeId/daily-sales/sales"
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BanknoteIcon />
        </EmptyMedia>
        <EmptyTitle>Sales coming soon</EmptyTitle>
        <EmptyDescription>Sales recording will appear here.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
