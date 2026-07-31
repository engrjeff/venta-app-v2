import { MapEmbed } from "@/components/map-embed"
import { AddBranchDialog } from "@/features/branch/add-branch-dialog"
import { branchApi } from "@/features/branch/branch.functions"
import { generatePageTitle } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"
import { Building2Icon } from "lucide-react"

export const Route = createFileRoute("/_protected/branches")({
  head: () => ({
    meta: [{ title: generatePageTitle("Branches") }],
  }),
  loader: async ({ context }) => {
    if (!context.activeStoreId) return null

    const branches = await branchApi.getAll({
      data: { id: context.activeStoreId },
    })

    return branches
  },
  component: RouteComponent,
})

function RouteComponent() {
  const branches = Route.useLoaderData()

  return (
    <div className="space-y-6">
      {/* page header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Building2Icon className="size-4" />{" "}
          <h1 className="font-semibold">Branches</h1>
        </div>
        <div className="flex items-center gap-3">
          <AddBranchDialog />
        </div>
      </div>
      {/* content */}
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {branches?.data?.map((branch) => (
          <li key={branch.id}>
            <div className="flex h-full flex-col overflow-hidden rounded border bg-card/60">
              <div className="p-4">
                <h2 className="text-sm font-semibold">{branch.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {branch.gmFormattedAddress}
                </p>
              </div>
              <div className="mt-auto overflow-hidden">
                <MapEmbed location={branch.address} className="rounded-none" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
