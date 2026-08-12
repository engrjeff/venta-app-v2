import { SubmitButton } from "@/components/submit-button"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Separator } from "@/components/ui/separator"
import { useStoreFieldOptions } from "@/hooks/use-store-field-options"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import type { ExtendedEmployee } from "./employee.types"
import { employeesApi } from "./employees.functions"
import type { UpdateEmployeeInput } from "./schema"
import { updateEmployeeSchema } from "./schema"

interface UpdateEmployeeFormProps {
  employee: ExtendedEmployee
  onAfterSave: VoidFunction
}

export function UpdateEmployeeForm({
  employee,
  onAfterSave,
}: UpdateEmployeeFormProps) {
  const updateEmployee = useServerFn(employeesApi.update)

  const storeOptions = useStoreFieldOptions()

  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(updateEmployeeSchema),
    defaultValues: {
      id: employee.id,
      storeId: employee.organizationId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email ?? "",
      phone: employee.phone ?? "",
      username: employee.username ?? "",
      branches: employee.branches.map((branch) => branch.branch.id),
      designationId: employee.designationId,
    },
  })

  const onFormError: SubmitErrorHandler<UpdateEmployeeInput> = (formError) => {
    console.error(`Update Employee Form Error: `, formError)
  }

  const onSubmit: SubmitHandler<UpdateEmployeeInput> = async (employeeData) => {
    try {
      const result = await updateEmployee({ data: employeeData })

      if (result.error) {
        console.log("Error updating employee: ", result.error)

        toast.error(result.error.message)

        return
      }

      toast.success(`Employee is successfully saved!`)

      await router.invalidate()

      onAfterSave()
    } catch (err) {
      console.log("Thrown Error: ", err)

      if (err instanceof Error) {
        toast.error(err.message)
      }
    }
  }

  return (
    <div className="flex-1 px-4">
      <form
        onChange={() => form.clearErrors()}
        onSubmit={form.handleSubmit(onSubmit, onFormError)}
        className="grid h-full"
      >
        <FieldGroup className="gap-4">
          <Controller
            name="firstName"
            control={form.control}
            render={({ field: controllerField, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor={controllerField.name}>
                    First Name
                  </FieldLabel>
                  <Input
                    id={controllerField.name}
                    placeholder="First name"
                    aria-invalid={fieldState.invalid}
                    {...controllerField}
                    autoFocus
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />
          <Controller
            name="lastName"
            control={form.control}
            render={({ field: controllerField, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor={controllerField.name}>
                    Last Name
                  </FieldLabel>
                  <Input
                    id={controllerField.name}
                    placeholder="Last name"
                    aria-invalid={fieldState.invalid}
                    {...controllerField}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />
          <Controller
            name="username"
            control={form.control}
            render={({ field: controllerField, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor={controllerField.name}>
                    Username
                  </FieldLabel>
                  <Input
                    id={controllerField.name}
                    placeholder="Username"
                    aria-invalid={fieldState.invalid}
                    {...controllerField}
                  />
                  <FieldDescription>Used in attendance</FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field: controllerField, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor={controllerField.name}>
                    Email{" "}
                    <span className="text-xs text-muted-foreground">
                      (Optional)
                    </span>
                  </FieldLabel>
                  <Input
                    id={controllerField.name}
                    placeholder="Email"
                    type="email"
                    aria-invalid={fieldState.invalid}
                    {...controllerField}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />
          <Controller
            name="phone"
            control={form.control}
            render={({ field: controllerField, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor={controllerField.name}>
                    Phone{" "}
                    <span className="text-xs text-muted-foreground">
                      (Optional)
                    </span>
                  </FieldLabel>
                  <Input
                    id={controllerField.name}
                    placeholder="+639XXXXXXXXX"
                    type="tel"
                    className="w-1/2"
                    aria-invalid={fieldState.invalid}
                    {...controllerField}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Separator />

          <div className="grid grid-cols-1 gap-4">
            <Controller
              name="designationId"
              control={form.control}
              render={({ field: controllerField, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={controllerField.name}>
                      Designation
                    </FieldLabel>
                    <NativeSelect
                      id={controllerField.name}
                      aria-invalid={fieldState.invalid}
                      className="w-full"
                      disabled={storeOptions.loading}
                      {...controllerField}
                    >
                      <NativeSelectOption value="">
                        Select designation
                      </NativeSelectOption>
                      {storeOptions.designations.map((designation) => (
                        <NativeSelectOption
                          key={designation.id}
                          value={designation.id}
                        >
                          {designation.name}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </FieldContent>
                </Field>
              )}
            />
            <Controller
              name="branches"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldGroup>
                  <FieldSet data-invalid={fieldState.invalid}>
                    <FieldLegend variant="label">Assigned Branches</FieldLegend>
                    <FieldDescription>
                      Select the branches where this employee is assigned
                    </FieldDescription>
                    <FieldGroup
                      data-slot="checkbox-group"
                      className="data-[slot=checkbox-group]:gap-1.5"
                    >
                      {storeOptions.branches.map((branch) => (
                        <Field
                          key={branch.id}
                          orientation="horizontal"
                          data-invalid={fieldState.invalid}
                          className="cursor-pointer rounded-md border p-2 text-sm hover:bg-accent"
                        >
                          <Checkbox
                            id={branch.id}
                            name={field.name}
                            aria-invalid={fieldState.invalid}
                            checked={field.value.includes(branch.id)}
                            onCheckedChange={(checked) => {
                              const newValue = checked
                                ? [...field.value, branch.id]
                                : field.value.filter(
                                    (value) => value !== branch.id
                                  )
                              field.onChange(newValue)
                            }}
                          />
                          <FieldLabel
                            htmlFor={branch.id}
                            className="font-normal"
                          >
                            {branch.name}
                          </FieldLabel>
                        </Field>
                      ))}
                    </FieldGroup>
                  </FieldSet>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldGroup>
              )}
            />
          </div>
        </FieldGroup>

        <div className="mt-auto flex justify-end gap-4 py-4">
          <Button type="button" variant="ghost" onClick={onAfterSave}>
            Cancel
          </Button>
          {/* submit button */}
          <SubmitButton loading={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </SubmitButton>
        </div>
      </form>
    </div>
  )
}
