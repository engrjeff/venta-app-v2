import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { createFileRoute } from "@tanstack/react-router"
import { WalletIcon } from "lucide-react"

export const Route = createFileRoute(
  "/e/$storeSlug/$employeeId/daily-sales/cash-on-hand"
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <WalletIcon />
        </EmptyMedia>
        <EmptyTitle>Cash-on-hand coming soon</EmptyTitle>
        <EmptyDescription>
          Cash counting and reconciliation will appear here.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
