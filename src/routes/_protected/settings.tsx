import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AddBranchDialog } from "@/features/branch/add-branch-dialog"
import { AddDesignationDialog } from "@/features/designations/add-designation-dialog"
import { storeApi } from "@/features/store/store.functions"
import { formatPHP, generatePageTitle } from "@/lib/utils"
import { createFileRoute, notFound } from "@tanstack/react-router"
import {
  EditIcon,
  MapPinIcon,
  MoreHorizontalIcon,
  NetworkIcon,
  PhoneIcon,
  SettingsIcon,
  StoreIcon,
} from "lucide-react"

export const Route = createFileRoute("/_protected/settings")({
  head: () => ({
    meta: [{ title: generatePageTitle("Store Settings") }],
  }),
  loader: async ({ context }) => {
    const store = await storeApi.getById({
      data: { id: context.activeStoreId },
    })

    if (!store?.data) throw notFound({ data: { message: "Store Not Found" } })

    return store.data
  },
  component: RouteComponent,
})

function RouteComponent() {
  const store = Route.useLoaderData()

  const { organizationSettings, branches, designations } = store

  return (
    <div className="grid h-full flex-1 grid-cols-1 grid-rows-[1fr] py-4">
      <div className="flex min-h-0 flex-col overflow-y-auto">
        <div className="container mx-auto max-w-3xl space-y-4">
          {/* page header */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <SettingsIcon className="size-4" />{" "}
              <h1 className="font-semibold">
                Store Settings for {store?.name}
              </h1>
            </div>
          </div>
          {/* general info */}
          <Card size="sm" className="rounded-md">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <StoreIcon className="size-4" /> General Info
              </CardTitle>
              <Button type="button" size="sm" variant="secondary">
                <EditIcon /> Edit
              </Button>
            </CardHeader>
            <CardContent className="px-4">
              <div className="divide-y rounded-md border bg-card">
                <div className="p-3">
                  <p className="text-sm font-semibold">
                    {organizationSettings?.businessType}
                  </p>
                  <p className="text-xs text-muted-foreground">Business Type</p>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold">
                    {organizationSettings?.timezone}
                  </p>
                  <p className="text-xs text-muted-foreground">Time Zone</p>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold">
                    {organizationSettings?.currency}
                  </p>
                  <p className="text-xs text-muted-foreground">Currency</p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* contact info */}
          <Card size="sm" className="rounded-md">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <PhoneIcon className="size-4" /> Contact Info
              </CardTitle>

              <Button type="button" size="sm" variant="secondary">
                <EditIcon /> Edit
              </Button>
            </CardHeader>
            <CardContent className="px-4">
              <div className="divide-y rounded-md border bg-card">
                <div className="p-3">
                  <p className="text-sm font-semibold">
                    {organizationSettings?.phone ?? "No phone provided"}
                  </p>
                  <p className="text-xs text-muted-foreground">Phone</p>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold">
                    {organizationSettings?.email ?? "No email provided"}
                  </p>
                  <p className="text-xs text-muted-foreground">Email</p>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold">
                    {organizationSettings?.website ?? "No website provided"}
                  </p>
                  <p className="text-xs text-muted-foreground">Website</p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* branches */}
          <Card size="sm" className="rounded-md pb-0">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPinIcon className="size-4" /> Branches
              </CardTitle>
              <AddBranchDialog />
            </CardHeader>
            <CardContent className="px-4">
              <div className="divide-y rounded-md border bg-card">
                {branches.map((branch) => (
                  <div
                    key={branch.id}
                    className="flex items-center justify-between gap-4 p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold">{branch.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {branch.gmFormattedAddress}
                      </p>
                    </div>
                    <div>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        aria-label="Actions"
                      >
                        <MoreHorizontalIcon />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="rounded-none border-t bg-accent pb-4">
              <p className="text-xs text-muted-foreground">
                Your store branches are used to determine the eligibility of
                your employees' attendance.
              </p>
            </CardFooter>
          </Card>

          {/* designations */}
          <Card size="sm" className="rounded-md">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <NetworkIcon className="size-4" /> Designations
              </CardTitle>
              <AddDesignationDialog />
            </CardHeader>
            <CardContent className="px-4">
              <div className="divide-y rounded-md border bg-card">
                {designations.map((designation) => (
                  <div
                    key={designation.id}
                    className="flex items-center justify-between gap-4 p-3"
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        {designation.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatPHP(designation.salaryRate)}{" "}
                        {designation.salaryType.toLowerCase()}
                      </p>
                    </div>
                    <div>
                      <Button
                        type="button"
                        size="icon-sm"
                        variant="ghost"
                        aria-label="Actions"
                      >
                        <MoreHorizontalIcon />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
