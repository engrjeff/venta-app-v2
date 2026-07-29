import { createFileRoute } from "@tanstack/react-router"
import { Separator } from "@/components/ui/separator"
import { CreateStoreSettingsForm } from "@/features/onboarding/create-store-settings-form"
import { StepFormHeading } from "@/features/onboarding/step-form-heading"

export const Route = createFileRoute("/onboarding/store-settings")({
  component: RouteComponent,
})

function RouteComponent() {
  const { status, organizationId: storeId } = Route.useRouteContext()

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
