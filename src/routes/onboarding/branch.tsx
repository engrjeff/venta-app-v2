import { Separator } from "@/components/ui/separator"
import { CreateBranchForm } from "@/features/branch/create-branch-form"
import { StepFormHeading } from "@/features/onboarding/step-form-heading"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/onboarding/branch")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <StepFormHeading step={2} />
      <Separator />
      <CreateBranchForm />
    </>
  )
}
