import { DesignationsTable } from "@/features/designations/designations-table"
import { designationsApi } from "@/features/designations/designations.functions"
import { generatePageTitle } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"
import { NetworkIcon } from "lucide-react"

export const Route = createFileRoute("/_protected/designations")({
  head: () => ({
    meta: [{ title: generatePageTitle("Designations") }],
  }),
  loader: async ({ context }) => {
    if (!context.activeStoreId) return null

    const branches = await designationsApi.getAll({
      data: { id: context.activeStoreId },
    })

    return branches
  },
  component: RouteComponent,
})

function RouteComponent() {
  const destinations = Route.useLoaderData()

  return (
    <div className="space-y-6">
      {/* page header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <NetworkIcon className="size-4" />{" "}
          <h1 className="font-semibold">Designations</h1>
        </div>
        <div className="flex items-center gap-3"></div>
      </div>
      {/* content */}
      <DesignationsTable designations={destinations?.data ?? []} />
    </div>
  )
}
