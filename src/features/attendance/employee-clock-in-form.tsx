import { MapEmbed } from "@/components/map-embed"
import { SubmitButton } from "@/components/submit-button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Branch } from "@/generated/prisma/browser"
import { performGeofenceCheck, useGeofence } from "@/lib/geo-fencing"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  useLoaderData,
  useNavigate,
  useParams,
  useRouter,
} from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { ArrowRightIcon } from "lucide-react"
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { EmployeeMenu } from "../employees/employee-menu"
import { attendanceApi } from "./attendance.functions"
import type { EmployeeClockInFormInput } from "./schema"
import { employeeClockInFormSchema } from "./schema"

export function EmployeeClockInForm() {
  const employee = useLoaderData({ from: "/e/$storeSlug" })

  if (!employee) return null

  return (
    <div className="w-full space-y-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Hi, {employee.firstName} 👋</h2>
          <p className="text-xs text-muted-foreground">
            {employee.designation.name} @ {employee.organization.name}
          </p>
        </div>
        <EmployeeMenu />
      </div>
      <ClockInForm
        storeId={employee.organizationId}
        employeeId={employee.id}
        branches={employee.branches.map(({ branch }) => branch)}
      />
    </div>
  )
}

type SimpleBranch = Pick<
  Branch,
  | "id"
  | "name"
  | "address"
  | "latitude"
  | "longitude"
  | "attendanceRadius"
  | "gmFormattedAddress"
>

function ClockInForm({
  employeeId,
  storeId,
  branches,
}: {
  storeId: string
  employeeId: string
  branches: SimpleBranch[]
}) {
  const clockInFn = useServerFn(attendanceApi.clockIn)

  const navigate = useNavigate()

  const router = useRouter()

  const params = useParams({ from: "/e/$storeSlug/" })

  const form = useForm({
    resolver: zodResolver(employeeClockInFormSchema),
    defaultValues: { storeId, employeeId, branchId: branches[0].id },
  })

  const selectedBranchId = form.watch("branchId")

  const selectedBranch =
    branches.find((branch) => branch.id === selectedBranchId) ?? branches[0]

  const locationCenter = {
    latitude: selectedBranch.latitude,
    longitude: selectedBranch.longitude,
  }

  const radius = selectedBranch.attendanceRadius

  const geofencing = useGeofence(locationCenter, radius)

  if (geofencing.permission === "denied") {
    return (
      <Alert>
        <AlertTitle>Location access is blocked</AlertTitle>
        <AlertDescription>
          Enable location access for this site in your browser settings, then
          try again.
        </AlertDescription>
      </Alert>
    )
  }

  const onFormError: SubmitErrorHandler<EmployeeClockInFormInput> = (
    formError
  ) => {
    console.error(`Employee Clock In Form Error: `, formError)
  }

  const handleClockIn: SubmitHandler<EmployeeClockInFormInput> = async (
    inputs
  ) => {
    try {
      const geoResult = await performGeofenceCheck(locationCenter, radius)

      if (!geoResult?.canClockIn) {
        toast.error("Cannot clock-in. Make sure you are in the store.")
        return
      }

      const result = await clockInFn({
        data: {
          employeeId: inputs.employeeId,
          storeId: inputs.storeId,
          branchId: inputs.branchId,
          timeIn: new Date().toISOString(),
          timeInLat: geoResult.current.location.latitude,
          timeInLng: geoResult.current.location.longitude,
        },
      })

      if (result.error) {
        console.log("Error clocking in: ", result.error)

        toast.error(result.error.message)

        return
      }

      if (!result.data?.id) {
        console.log("Error clocking in: ", "Error")

        toast.error("Error clocking in")

        return
      }

      toast.success(`Clock in successful`)

      navigate({
        to: "/e/$storeSlug/$employeeId",
        params: {
          storeSlug: params.storeSlug,
          employeeId: result.data.employeeId,
        },
        replace: true,
      })

      await router.invalidate()
    } catch (err) {
      console.log("Thrown Error: ", err)
    }
  }

  return (
    <>
      <MapEmbed location={selectedBranch.address} />
      <form onSubmit={form.handleSubmit(handleClockIn, onFormError)}>
        <FieldGroup>
          <Controller
            name="branchId"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldSet data-invalid={fieldState.invalid}>
                <FieldLegend className="sr-only">Branch</FieldLegend>
                <FieldDescription>
                  Select the branch where you will be working in.
                </FieldDescription>
                <RadioGroup
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                >
                  {branches.map((branch) => (
                    <FieldLabel
                      key={branch.id}
                      htmlFor={`clockin-form-branch-${branch.id}`}
                    >
                      <Field
                        orientation="horizontal"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldContent>
                          <FieldTitle>{branch.name}</FieldTitle>
                          <FieldDescription>{branch.address}</FieldDescription>
                        </FieldContent>
                        <RadioGroupItem
                          value={branch.id}
                          id={`clockin-form-branch-${branch.id}`}
                          aria-invalid={fieldState.invalid}
                        />
                      </Field>
                    </FieldLabel>
                  ))}
                </RadioGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldSet>
            )}
          />
        </FieldGroup>
        <div className="flex justify-end gap-4 pt-6">
          {/* submit button */}
          <SubmitButton
            loading={form.formState.isSubmitting || geofencing.loading}
            size="xl"
            className="w-full"
          >
            {form.formState.isSubmitting ? (
              "Clocking In..."
            ) : (
              <>
                <span>Clock In</span>
                <ArrowRightIcon />
              </>
            )}
          </SubmitButton>
        </div>
      </form>
    </>
  )
}
