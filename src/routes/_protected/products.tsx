import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { generatePageTitle } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"
import { PlusIcon } from "lucide-react"

export const Route = createFileRoute("/_protected/products")({
  head: () => ({
    meta: [{ title: generatePageTitle("Products") }],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <PageHeader>
        <PageHeader.Heading>
          <PageHeader.Title>Products</PageHeader.Title>
        </PageHeader.Heading>
        <PageHeader.Actions>
          <Button size="sm">
            <PlusIcon /> New Product
          </Button>
        </PageHeader.Actions>
      </PageHeader>
    </>
  )
}
