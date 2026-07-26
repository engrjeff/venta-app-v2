import { NumberInput } from "@/components/number-input"
import { SubmitButton } from "@/components/submit-button"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { SalaryType } from "@/generated/prisma/enums"
import { authClient } from "@/lib/auth-client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { PlusIcon, XIcon } from "lucide-react"
import {
  Controller,
  useFieldArray,
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form"
import { toast } from "sonner"
import { designationsApi } from "./designations.functions"
import {
  designationArraySchema,
  type CreateManyDesignationInput,
} from "./schema"

export function CreateDesignationsForm() {
  const navigate = useNavigate()
  const router = useRouter()

  const createManyDesignations = useServerFn(designationsApi.createMany)
  const store = authClient.useActiveOrganization()

  const form = useForm({
    resolver: zodResolver(designationArraySchema),
    defaultValues: {
      designations: [
        { name: "", salaryType: SalaryType.DAILY, salaryRate: undefined },
      ],
    },
    values: {
      storeId: store.data?.id ?? "",
      designations: [
        { name: "", salaryType: SalaryType.DAILY, salaryRate: 0.0 },
      ],
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  })

  const designations = useFieldArray({
    control: form.control,
    name: "designations",
  })

  const { isSubmitting } = form.formState

  async function handleAdd() {
    const hasErrors = await form.trigger("designations")

    if (!hasErrors) return

    designations.append({
      name: "",
      salaryType: SalaryType.DAILY,
      salaryRate: 0,
    })
  }

  function handleRemove(index: number) {
    designations.remove(index)
  }

  const onFormError: SubmitErrorHandler<CreateManyDesignationInput> = (
    formError
  ) => {
    console.error(`Create Many Designations Form Error: `, formError)
  }

  const onSubmit: SubmitHandler<CreateManyDesignationInput> = async (
    designationsData
  ) => {
    try {
      if (!store?.data?.id) return

      const result = await createManyDesignations({
        data: {
          storeId: store.data?.id,
          designations: designationsData.designations,
        },
      })

      if (result.error) {
        console.log("Error creating designations: ", result.error)

        toast.error(result.error.message)

        return
      }

      toast.success(`Designations are successfully created!`)

      await router.invalidate()

      navigate({
        to: "/onboarding/employees",
        replace: true,
      })
    } catch (err) {
      console.log("Thrown Error: ", err)
    }
  }

  return (
    <form
      onChange={() => form.clearErrors()}
      onSubmit={form.handleSubmit(onSubmit, onFormError)}
    >
      <FieldSet className="gap-0">
        <div className="grid grid-cols-[1fr_120px_120px_48px] gap-4">
          <FieldLegend variant="label">Designation</FieldLegend>
          <FieldLegend variant="label">Salary Type</FieldLegend>
          <FieldLegend variant="label">Salary Rate</FieldLegend>
        </div>
        <FieldGroup className="gap-4">
          {designations.fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-[1fr_120px_120px_auto] items-start gap-4"
            >
              {/* designation name */}
              <Controller
                name={`designations.${index}.name`}
                control={form.control}
                render={({ field: controllerField, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel
                        className="sr-only"
                        htmlFor={controllerField.name}
                      >
                        Designation
                      </FieldLabel>
                      <Input
                        id={controllerField.name}
                        placeholder="Designation"
                        className="h-12"
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
              {/* salary type */}
              <Controller
                name={`designations.${index}.salaryType`}
                control={form.control}
                render={({ field: controllerField, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      className="sr-only"
                      htmlFor={controllerField.name}
                    >
                      Salary Type
                    </FieldLabel>
                    <FieldContent>
                      <NativeSelect
                        id={controllerField.name}
                        aria-invalid={fieldState.invalid}
                        className="h-12 w-full"
                        {...controllerField}
                      >
                        <NativeSelectOption value={SalaryType.DAILY}>
                          Daily
                        </NativeSelectOption>
                        <NativeSelectOption value={SalaryType.HOURLY}>
                          Hourly
                        </NativeSelectOption>
                      </NativeSelect>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </FieldContent>
                  </Field>
                )}
              />
              {/* salary rate */}
              <Controller
                name={`designations.${index}.salaryRate`}
                control={form.control}
                render={({ field: controllerField, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldLabel
                        className="sr-only"
                        htmlFor={controllerField.name}
                      >
                        Salary Rate
                      </FieldLabel>
                      <NumberInput
                        usePeso
                        id={controllerField.name}
                        placeholder="0.0"
                        className="h-12"
                        aria-invalid={fieldState.invalid}
                        {...form.register(`designations.${index}.salaryRate`, {
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

              {/* remove button */}
              <Button
                type="button"
                variant="destructive"
                size="icon-lg"
                className="size-12"
                aria-label="Remove"
                disabled={designations.fields.length === 1}
                onClick={() => handleRemove(index)}
              >
                <XIcon />
              </Button>
            </div>
          ))}
          {/* add button */}
          <div className="flex justify-start">
            <Button
              type="button"
              variant="secondary"
              size="xl"
              className="w-auto"
              onClick={handleAdd}
            >
              <PlusIcon /> Add Designation
            </Button>
          </div>
          <div className="flex justify-end pt-6">
            <SubmitButton loading={isSubmitting} size="xl">
              {isSubmitting ? "Saving..." : "Save Designations"}
            </SubmitButton>
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
