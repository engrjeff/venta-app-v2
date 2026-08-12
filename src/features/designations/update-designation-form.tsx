import { NumberInput } from "@/components/number-input"
import { SubmitButton } from "@/components/submit-button"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Designation } from "@/generated/prisma/browser"
import { SalaryType } from "@/generated/prisma/browser"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { designationsApi } from "./designations.functions"
import type { UpdateDesignationInput } from "./schema"
import { designationUpdateSchema } from "./schema"

export function UpdateDesignationForm({
  designation,
  onAfterSave,
}: {
  designation: Designation
  onAfterSave: VoidFunction
}) {
  const updateDesignation = useServerFn(designationsApi.update)

  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(designationUpdateSchema),
    defaultValues: {
      id: designation.id,
      name: designation.name,
      storeId: designation.organizationId,
      salaryType: designation.salaryType,
      salaryRate: designation.salaryRate,
    },
  })

  const onFormError: SubmitErrorHandler<UpdateDesignationInput> = (
    formError
  ) => {
    console.error(`Update Designation Form Error: `, formError)
  }

  const onSubmit: SubmitHandler<UpdateDesignationInput> = async (inputs) => {
    try {
      const result = await updateDesignation({ data: inputs })

      if (result.error) {
        console.log("Error updating designation: ", result.error)

        toast.error(result.error.message)

        return
      }

      toast.success(`Designation ${result.data?.name} is successfully updated!`)

      await router.invalidate()

      onAfterSave()
    } catch (err) {
      console.log("Thrown Error: ", err)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      <form
        onChange={() => form.clearErrors()}
        onSubmit={form.handleSubmit(onSubmit, onFormError)}
      >
        <FieldGroup>
          {/* designation name */}
          <Controller
            name="name"
            control={form.control}
            render={({ field: controllerField, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor={controllerField.name}>
                    Designation Title
                  </FieldLabel>
                  <Input
                    id={controllerField.name}
                    placeholder="e.g. Staff"
                    aria-invalid={fieldState.invalid}
                    autoFocus
                    {...controllerField}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />
          {/* salary rate */}
          <Controller
            name="salaryRate"
            control={form.control}
            render={({ field: controllerField, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor={controllerField.name}>
                    Salary Rate
                  </FieldLabel>
                  <NumberInput
                    usePeso
                    id={controllerField.name}
                    placeholder="0.0"
                    aria-invalid={fieldState.invalid}
                    {...form.register("salaryRate", {
                      valueAsNumber: true,
                    })}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />
          {/* salary type */}
          <Controller
            name="salaryType"
            control={form.control}
            render={({ field: controllerField, fieldState }) => (
              <FieldSet className="w-full">
                <FieldLegend variant="label">Salary Type</FieldLegend>
                <RadioGroup
                  name={controllerField.name}
                  value={controllerField.value}
                  onValueChange={controllerField.onChange}
                  aria-invalid={fieldState.invalid}
                  className="w-full gap-2"
                >
                  {[SalaryType.DAILY, SalaryType.HOURLY].map((salaryType) => (
                    <FieldLabel
                      key={salaryType}
                      htmlFor={`salary-type-${salaryType}`}
                    >
                      <Field
                        orientation="horizontal"
                        data-invalid={fieldState.invalid}
                      >
                        <FieldContent>
                          <FieldTitle className="capitalize">
                            {salaryType.toLowerCase()}
                          </FieldTitle>
                        </FieldContent>
                        <RadioGroupItem
                          value={salaryType}
                          id={`salary-type-${salaryType}`}
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

          <div className="flex items-center justify-end gap-3 pt-2">
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              }
            />
            <SubmitButton type="submit" loading={form.formState.isSubmitting}>
              Save Changes
            </SubmitButton>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}
