import { Separator } from "@/components/ui/separator"
import { CreateStoreSettingsForm } from "@/features/onboarding/create-store-settings-form"
import { StepFormHeading } from "@/features/onboarding/step-form-heading"
import { createFileRoute, useLoaderData } from "@tanstack/react-router"

export const Route = createFileRoute("/onboarding/store-settings")({
  component: RouteComponent,
})

function RouteComponent() {
  const { status } = useLoaderData({ from: "/onboarding" })
  const { storeId } = Route.useRouteContext()

  if (!storeId) return null

  const storeData =
    status.data?.nextStep === "/onboarding/store-settings"
      ? status.data.storeData
      : undefined

  return (
    <>
      <StepFormHeading step={2} storeName={storeData?.name} />
      <Separator />
      <CreateStoreSettingsForm storeId={storeId} />
    </>
  )
}
