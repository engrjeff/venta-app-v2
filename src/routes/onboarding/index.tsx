import { Separator } from "@/components/ui/separator"
import { CreateStoreForm } from "@/features/onboarding/create-store-form"
import { StepFormHeading } from "@/features/onboarding/step-form-heading"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/onboarding/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <StepFormHeading step={1} />
      <Separator />
      <CreateStoreForm />
    </>
  )
}
