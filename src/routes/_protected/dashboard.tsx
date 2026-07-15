import { generatePageTitle } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected/dashboard")({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: generatePageTitle("Dashboard") }],
  }),
})

function RouteComponent() {
  return <div>Hello "/_protected/dashboard"!</div>
}
