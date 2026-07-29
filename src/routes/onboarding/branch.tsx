import { createFileRoute } from "@tanstack/react-router"
import { Separator } from "@/components/ui/separator"
import { CreateBranchForm } from "@/features/branch/create-branch-form"
import { StepFormHeading } from "@/features/onboarding/step-form-heading"

export const Route = createFileRoute("/onboarding/branch")({
  component: RouteComponent,
})

function RouteComponent() {
  const { status, organizationId: storeId } = Route.useRouteContext()

  if (!storeId) return null

  const storeData =
    status.data?.nextStep === "/onboarding/branch"
      ? status.data.storeData
      : undefined

  return (
    <>
      <StepFormHeading step={3} storeName={storeData?.name} />
      <Separator />
      <CreateBranchForm storeId={storeId} />
    </>
  )
}
