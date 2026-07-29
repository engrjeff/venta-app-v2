import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { ArrowRightIcon, MapIcon } from "lucide-react"
import { useState } from "react"
import {
  
  
  useForm
} from "react-hook-form"
import { toast } from "sonner"
import { branchApi } from "./branch.functions"
import {  branchSchema } from "./schema"
import type {SubmitErrorHandler, SubmitHandler} from "react-hook-form";
import type {CreateBranchInput} from "./schema";
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { SubmitButton } from "@/components/submit-button"
import { MapEmbed } from "@/components/map-embed"

export function CreateBranchForm({ storeId }: { storeId: string }) {
  const createBranch = useServerFn(branchApi.create)

  const navigate = useNavigate()
  const router = useRouter()

  const [viewingInMap, setViewingInMap] = useState(false)

  const form = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: "San Juan Branch",
      address:
        "Block 2 Lot 10 Casas Carlina, Barangay Tatala, Binangonan, Rizal (Segovia Residence)",
      storeId,
      scheduleStartTime: "08:00",
      scheduleEndTime: "17:00",
    },
  })

  const { errors, isSubmitting } = form.formState

  const onFormError: SubmitErrorHandler<CreateBranchInput> = (formError) => {
    console.error(`Create Branch Form Error: `, formError)
  }

  const onSubmit: SubmitHandler<CreateBranchInput> = async (branchData) => {
    try {
      console.log(branchData)
      const result = await createBranch({ data: branchData })

      if (result.error) {
        console.log("Error creating branch: ", result.error)

        toast.error(result.error.message)

        return
      }

      toast.success(`Store branch ${result.data?.name} is successfully saved!`)

      await router.invalidate()

      navigate({
        to: "/onboarding/designations",
        replace: true,
      })
    } catch (err) {
      console.log("Thrown Error: ", err)
    }
  }

  const enteredAddress = form.watch("address")

  return (
    <form
      onChange={() => form.clearErrors()}
      onSubmit={form.handleSubmit(onSubmit, onFormError)}
      noValidate
    >
      <FieldGroup>
        <Field className="flex-1">
          <FieldLabel htmlFor="name">
            What should we call your branch?
          </FieldLabel>
          <Input
            id="name"
            placeholder="e.g. Main Branch"
            autoComplete="branch-name"
            className="h-12"
            autoFocus
            aria-invalid={!!errors.name || undefined}
            {...form.register("name")}
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>
        <FieldSet>
          <FieldLegend>Work Schedule</FieldLegend>
          <FieldDescription>
            Tell us the work schedule in this branch
          </FieldDescription>

          <div className="grid grid-cols-2 gap-4">
            <Field className="flex-1">
              <FieldLabel htmlFor="scheduleStartTime">Start</FieldLabel>
              <Input
                id="scheduleStartTime"
                placeholder="e.g. 08:00"
                autoComplete="branch-scheduleStartTime"
                className="h-12"
                type="time"
                aria-invalid={!!errors.scheduleStartTime || undefined}
                {...form.register("scheduleStartTime")}
              />
              {errors.scheduleStartTime && (
                <FieldError>{errors.scheduleStartTime.message}</FieldError>
              )}
            </Field>
            <Field className="flex-1">
              <FieldLabel htmlFor="name">End</FieldLabel>
              <Input
                id="scheduleEndTime"
                placeholder="e.g. 08:00"
                autoComplete="branch-scheduleEndTime"
                className="h-12"
                type="time"
                aria-invalid={!!errors.scheduleEndTime || undefined}
                {...form.register("scheduleEndTime")}
              />
              {errors.scheduleEndTime && (
                <FieldError>{errors.scheduleEndTime.message}</FieldError>
              )}
            </Field>
          </div>
        </FieldSet>

        <Field className="flex-1">
          <div className="flex items-center justify-between gap-4">
            <div>
              <FieldLabel htmlFor="address">
                Where is your branch located?
              </FieldLabel>
              <FieldDescription>
                Tip: Enter the address indicated in Google Maps
              </FieldDescription>
            </div>
            <Button
              type="button"
              disabled={!enteredAddress}
              variant="secondary"
              onClick={() => setViewingInMap(true)}
            >
              <MapIcon /> Verify On Map
            </Button>
          </div>
          <Textarea
            id="address"
            placeholder="Enter your branch's address"
            autoComplete="branch-address"
            className="min-h-20"
            aria-invalid={!!errors.address || undefined}
            {...form.register("address")}
          />

          {errors.address && <FieldError>{errors.address.message}</FieldError>}
        </Field>
        {viewingInMap && enteredAddress ? (
          <div className="space-y-3">
            <p className="text-sm leading-none font-medium select-none">
              Does this look right to you?
            </p>
            <MapEmbed location={enteredAddress} />
          </div>
        ) : null}
        <div className="flex justify-end pt-6">
          <SubmitButton loading={isSubmitting} size="xl">
            {isSubmitting ? (
              "Saving Branch…"
            ) : (
              <>
                Next <ArrowRightIcon />
              </>
            )}
          </SubmitButton>
        </div>
      </FieldGroup>
    </form>
  )
}
