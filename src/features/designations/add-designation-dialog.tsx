import { NumberInput } from "@/components/number-input"
import { SubmitButton } from "@/components/submit-button"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { SalaryType } from "@/generated/prisma/enums"
import { authClient } from "@/lib/auth-client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { PlusIcon } from "lucide-react"
import { useState } from "react"
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { designationsApi } from "./designations.functions"
import type { CreateDesignationInput } from "./schema"
import { designationSchema } from "./schema"

export function AddDesignationDialog() {
  const [open, setOpen] = useState(false)

  const store = authClient.useActiveOrganization()

  const close = () => setOpen(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" disabled={store.isPending}>
            <PlusIcon /> Add Designation
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Designation</DialogTitle>
          <DialogDescription>Fill in the form below.</DialogDescription>
        </DialogHeader>
        {store.data?.id && (
          <AddDesignationForm storeId={store.data?.id} onAfterSave={close} />
        )}
      </DialogContent>
    </Dialog>
  )
}

function AddDesignationForm({
  storeId,
  onAfterSave,
}: {
  storeId: string
  onAfterSave: VoidFunction
}) {
  const createFn = useServerFn(designationsApi.create)

  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(designationSchema),
    defaultValues: {
      name: "",
      storeId,
      salaryType: SalaryType.DAILY,
      salaryRate: undefined,
    },
  })

  const onFormError: SubmitErrorHandler<CreateDesignationInput> = (
    formError
  ) => {
    console.error(`Add Designation Form Error: `, formError)
  }

  const onSubmit: SubmitHandler<CreateDesignationInput> = async (inputs) => {
    try {
      const result = await createFn({ data: inputs })

      if (result.error) {
        console.log("Error creating designation: ", result.error)

        toast.error(result.error.message)

        return
      }

      toast.success(`Designation ${result.data?.name} is successfully created!`)

      await router.invalidate()

      onAfterSave()
    } catch (err) {
      console.log("Thrown Error: ", err)
    }
  }

  return (
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
            Save
          </SubmitButton>
        </div>
      </FieldGroup>
    </form>
  )
}
