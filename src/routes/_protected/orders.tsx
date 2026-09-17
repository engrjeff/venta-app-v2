import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { generatePageTitle } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"
import { PlusIcon } from "lucide-react"

export const Route = createFileRoute("/_protected/orders")({
  head: () => ({
    meta: [{ title: generatePageTitle("Orders") }],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <PageHeader>
        <PageHeader.Heading>
          <PageHeader.Title>Orders</PageHeader.Title>
        </PageHeader.Heading>
        <PageHeader.Actions>
          <Button size="sm" variant="outline">
            Export
          </Button>
          <Button size="sm">
            <PlusIcon /> New Order
          </Button>
        </PageHeader.Actions>
      </PageHeader>
    </>
  )
}
