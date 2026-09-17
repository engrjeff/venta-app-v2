import { PageHeader } from "@/components/page-header"
import { generatePageTitle } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/sales")({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: generatePageTitle("Sales") }],
  }),
})

function RouteComponent() {
  return (
    <>
      <PageHeader>
        <PageHeader.Heading>
          <PageHeader.Title>Sales</PageHeader.Title>
        </PageHeader.Heading>
      </PageHeader>
    </>
  )
}
