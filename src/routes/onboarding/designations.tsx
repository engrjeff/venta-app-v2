import { createFileRoute } from "@tanstack/react-router"
import { Separator } from "@/components/ui/separator"
import { CreateDesignationsForm } from "@/features/designations/create-designations-form"
import { StepFormHeading } from "@/features/onboarding/step-form-heading"

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
