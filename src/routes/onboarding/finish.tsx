import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import {
  ArrowRightIcon,
  Building2Icon,
  NetworkIcon,
  StoreIcon,
  UsersIcon,
} from "lucide-react"
import {  useState } from "react"
import { toast } from "sonner"
import type {SubmitEventHandler} from "react";
import { onboardingApi } from "@/features/onboarding/onboarding.functions"
import { SubmitButton } from "@/components/submit-button"

export const Route = createFileRoute("/onboarding/finish")({
  component: RouteComponent,
})

function RouteComponent() {
  const { status, organizationId } = Route.useRouteContext()

  const storeData =
    status.data?.nextStep === "/onboarding/finish"
      ? status.data.storeData
      : undefined

  return (
    <>
      <div className="text-center">
        <h2 className="text-2xl font-bold">You&apos;re all set! 🎉</h2>
        <p className="text-muted-foreground">Your store is now ready to use.</p>
      </div>
      <div className="space-y-6 border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="relative flex size-11 items-center justify-center rounded-full bg-primary text-white">
            <StoreIcon size={20} />
          </div>
          <h3>Store</h3>
          <span className="ml-auto inline-block">{storeData?.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex size-11 items-center justify-center rounded-full bg-primary text-white">
            <Building2Icon size={20} />
          </div>
          <h3>Branch</h3>
          <span className="ml-auto inline-block">
            {storeData?.branchCount} branch added
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex size-11 items-center justify-center rounded-full bg-primary text-white">
            <NetworkIcon size={20} />
          </div>
          <h3>Designations</h3>
          <span className="ml-auto inline-block">
            {storeData?.designationCount} designations added
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex size-11 items-center justify-center rounded-full bg-primary text-white">
            <UsersIcon size={20} />
          </div>
          <h3>Employees</h3>
          <span className="ml-auto inline-block">
            {storeData?.employeeCount} employees added
          </span>
        </div>
      </div>
      <FinishOnboardingForm organizationId={organizationId} />
    </>
  )
}

function FinishOnboardingForm({
  organizationId,
}: {
  organizationId: string | null | undefined
}) {
  const finishOnboarding = useServerFn(onboardingApi.finish)

  const navigate = useNavigate()

  const [pending, setPending] = useState(false)

  const handleFinishOnboarding: SubmitEventHandler<HTMLFormElement> = async (
    e
  ) => {
    try {
      e.preventDefault()
      if (!organizationId) return toast.error("Store is required.")

      setPending(true)

      const result = await finishOnboarding({ data: { id: organizationId } })

      if (result.error) {
        console.log("Error finishing onboarding: ", result.error)

        toast.error(result.error.message)

        return
      }

      toast.success(`Onboarding finished!`)

      navigate({ to: "/dashboard", replace: true })
    } catch (err) {
      console.log("Thrown Error: ", err)
    } finally {
      setPending(false)
    }
  }

  return (
    <form className="flex justify-end" onSubmit={handleFinishOnboarding}>
      <SubmitButton type="submit" size="xl" loading={pending}>
        Go to Dashboard <ArrowRightIcon />
      </SubmitButton>
    </form>
  )
}
