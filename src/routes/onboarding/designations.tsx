import { Separator } from "@/components/ui/separator"
import { CreateDesignationsForm } from "@/features/designations/create-designations-form"
import { StepFormHeading } from "@/features/onboarding/step-form-heading"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/onboarding/designations")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <StepFormHeading step={4} />
      <Separator />
      <CreateDesignationsForm />
    </>
  )
}
