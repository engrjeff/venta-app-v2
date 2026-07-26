import { Separator } from "@/components/ui/separator"
import { AddEmployeesForm } from "@/features/employees/add-employees-form"
import { StepFormHeading } from "@/features/onboarding/step-form-heading"
import { storeApi } from "@/features/store/store.functions"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/onboarding/employees")({
  component: RouteComponent,
  loader: async ({ context }) => {
    if (!context.organizationId) {
      return { data: null, error: null }
    }

    const store = await storeApi.getFieldOptions({
      data: { id: context.organizationId },
    })

    return store
  },
})

function RouteComponent() {
  const loaderData = Route.useLoaderData()

  return (
    <>
      <StepFormHeading step={5} />
      <Separator />
      {!loaderData.data ? null : (
        <AddEmployeesForm
          storeId={loaderData.data.id}
          storeName={loaderData.data.name}
          branches={loaderData.data.branches ?? []}
          designations={loaderData.data.designations}
        />
      )}
    </>
  )
}
