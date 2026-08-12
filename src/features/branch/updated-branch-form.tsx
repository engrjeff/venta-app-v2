import { MapEmbed } from "@/components/map-embed"
import { SubmitButton } from "@/components/submit-button"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Branch } from "@/generated/prisma/browser"
import { dateToTimeInputValue } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { MapIcon } from "lucide-react"
import { useState } from "react"
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { branchApi } from "./branch.functions"
import type { UpdateBranchInput } from "./schema"
import { branchUpdateSchema } from "./schema"

export function UpdateBranchForm({
  branch,
  onAfterSave,
}: {
  branch: Branch
  onAfterSave: VoidFunction
}) {
  const updateBranch = useServerFn(branchApi.update)

  const router = useRouter()

  const [viewingInMap, setViewingInMap] = useState(false)

  const form = useForm({
    resolver: zodResolver(branchUpdateSchema),
    defaultValues: {
      id: branch.id,
      name: branch.name,
      address: branch.address,
      storeId: branch.organizationId,
      scheduleStartTime: dateToTimeInputValue(branch.scheduleStartTime),
      scheduleEndTime: dateToTimeInputValue(branch.scheduleEndTime),
    },
  })

  const { errors } = form.formState

  const onFormError: SubmitErrorHandler<UpdateBranchInput> = (formError) => {
    console.error(`Update Branch Form Error: `, formError)
  }

  const onSubmit: SubmitHandler<UpdateBranchInput> = async (branchData) => {
    try {
      const result = await updateBranch({ data: branchData })

      if (result.error) {
        console.log("Error updating branch: ", result.error)

        toast.error(result.error.message)

        return
      }

      toast.success(
        `Store branch ${result.data?.name} is successfully updated!`
      )

      await router.invalidate()

      onAfterSave()
    } catch (err) {
      console.log("Thrown Error: ", err)
    }
  }

  const enteredAddress = form.watch("address")

  return (
    <div className="flex-1 overflow-y-auto px-4">
      <form
        onChange={() => form.clearErrors()}
        onSubmit={form.handleSubmit(onSubmit, onFormError)}
        noValidate
        className="grid h-full"
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">
              What should we call your branch?
            </FieldLabel>
            <Input
              id="name"
              placeholder="e.g. Main Branch"
              autoComplete="branch-name"
              autoFocus
              aria-invalid={!!errors.name || undefined}
              {...form.register("name")}
            />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>
          <FieldSet>
            <FieldLegend variant="label">Work Schedule</FieldLegend>
            <FieldDescription>
              Tell us the work schedule in this branch
            </FieldDescription>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="scheduleStartTime">Start</FieldLabel>
                <Input
                  id="scheduleStartTime"
                  placeholder="e.g. 08:00"
                  autoComplete="branch-scheduleStartTime"
                  type="time"
                  aria-invalid={!!errors.scheduleStartTime || undefined}
                  {...form.register("scheduleStartTime")}
                />
                {errors.scheduleStartTime && (
                  <FieldError>{errors.scheduleStartTime.message}</FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="scheduleEndTime">End</FieldLabel>
                <Input
                  id="scheduleEndTime"
                  placeholder="e.g. 08:00"
                  autoComplete="branch-scheduleEndTime"
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
            <FieldLabel htmlFor="address">
              Where is your branch located?
            </FieldLabel>
            <FieldDescription>
              Tip: Enter the address indicated in Google Maps
            </FieldDescription>

            <Textarea
              id="address"
              placeholder="Enter your branch's address"
              autoComplete="branch-address"
              className="min-h-20"
              aria-invalid={!!errors.address || undefined}
              {...form.register("address")}
            />

            {errors.address && (
              <FieldError>{errors.address.message}</FieldError>
            )}
            <Button
              type="button"
              disabled={!enteredAddress}
              variant="secondary"
              onClick={() => setViewingInMap(true)}
            >
              <MapIcon /> Verify On Map
            </Button>
          </Field>
          {viewingInMap && enteredAddress ? (
            <div className="space-y-3">
              <p className="text-sm leading-none font-medium select-none">
                Does this look right to you?
              </p>
              <MapEmbed location={enteredAddress} />
            </div>
          ) : null}
        </FieldGroup>
        <div className="mt-auto flex justify-end gap-4 py-4">
          <Button type="button" variant="ghost" onClick={onAfterSave}>
            Cancel
          </Button>
          {/* submit button */}
          <SubmitButton loading={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Branch"}
          </SubmitButton>
        </div>
      </form>
    </div>
  )
}
