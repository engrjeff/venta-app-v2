import { SubmitButton } from "@/components/submit-button"
import { Button } from "@/components/ui/button"
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
import type { Branch, Designation } from "@/generated/prisma/client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { PlusIcon, SaveIcon, XIcon } from "lucide-react"
import {
  Controller,
  useFieldArray,
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form"
import { toast } from "sonner"
import { employeesApi } from "./employees.functions"
import {
  employeeArraySchema,
  employeeSchema,
  type CreateEmployeeInput,
  type CreateManyEmployeeInput,
} from "./schema"

interface AddEmployeesFormProps {
  branches: Pick<Branch, "id" | "name">[]
  designations: Pick<Designation, "id" | "name">[]
  storeId: string
  storeName: string
}

export function AddEmployeesForm({
  branches,
  designations,
  storeId,
  storeName,
}: AddEmployeesFormProps) {
  const createManyEmployees = useServerFn(employeesApi.createMany)

  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(employeeArraySchema),
    defaultValues: {
      storeId,
      storeName,
      employees: [
        {
          firstName: "Willana",
          lastName: "Castello",
          username: "yanacastello",
          branchId: branches[0].id,
          designationId: designations[1].id,
        },
        {
          firstName: "Wryx",
          lastName: "Castello",
          username: "wryxcastello",
          branchId: branches[0].id,
          designationId: designations[1].id,
        },
        {
          firstName: "Rosenel",
          lastName: "Magday",
          username: "rosenelmagday",
          branchId: branches[0].id,
          designationId: designations[0].id,
        },
      ],
    },
  })

  const employees = useFieldArray({ control: form.control, name: "employees" })

  const { isSubmitting } = form.formState

  const currentEmployees = form.watch("employees")

  function handleRemove(index: number) {
    employees.remove(index)
  }

  const onFormError: SubmitErrorHandler<CreateManyEmployeeInput> = (
    formError
  ) => {
    console.error(`Create Many Employees Form Error: `, formError)
  }

  const onSubmit: SubmitHandler<CreateManyEmployeeInput> = async (
    employeesData
  ) => {
    try {
      const result = await createManyEmployees({ data: employeesData })

      if (result.error) {
        console.log("Error saving employees: ", result.error)

        toast.error(result.error.message)

        return
      }

      toast.success(`Employees are successfully saved!`)

      navigate({ to: "/onboarding/finish", replace: true })
    } catch (err) {
      console.log("Thrown Error: ", err)
    }
  }

  function getDesignation(designationId: string) {
    return designations.find((d) => d.id === designationId)?.name
  }

  function getBranch(branchId: string) {
    return branches.find((b) => b.id === branchId)?.name
  }

  return (
    <>
      <form
        onChange={() => form.clearErrors()}
        onSubmit={form.handleSubmit(onSubmit, onFormError)}
      >
        <FieldSet>
          <FieldLegend variant="label">Employees</FieldLegend>
          {currentEmployees.length > 0 ? (
            <>
              <ul className="divide-y border bg-muted/30">
                {currentEmployees.map((employee, employeeIndex) => (
                  <li key={`employee-${employeeIndex}`}>
                    <div className="flex items-center justify-between gap-4 p-3">
                      <div>
                        <p className="text-sm font-semibold">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getDesignation(employee.designationId)}{" "}
                          {getBranch(employee.branchId)}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleRemove(employeeIndex)}
                      >
                        <XIcon />{" "}
                        <span className="sr-only">Remove employee</span>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex justify-end">
                <SubmitButton loading={isSubmitting} size="xl">
                  <SaveIcon /> {isSubmitting ? "Saving..." : "Save Employees"}
                </SubmitButton>
              </div>
            </>
          ) : (
            <div className="border border-dashed p-4">
              <p className="text-sm text-muted-foreground">
                Employees you add will appear here.
              </p>
            </div>
          )}
        </FieldSet>
      </form>
      <Separator />
      <EmployeeForm
        designations={designations}
        branches={branches}
        onAdd={employees.append}
      />
    </>
  )
}

function EmployeeForm({
  branches,
  designations,
  onAdd,
}: Pick<AddEmployeesFormProps, "branches" | "designations"> & {
  onAdd: (data: Omit<CreateEmployeeInput, "storeId">) => void
}) {
  const form = useForm({
    resolver: zodResolver(employeeSchema.omit({ storeId: true })),
    defaultValues: {
      branchId: "",
      designationId: "",
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
    },
  })

  const onFormError: SubmitErrorHandler<
    Omit<CreateEmployeeInput, "storeId">
  > = (formError) => {
    console.error(`Create Employee Form Error: `, formError)
  }

  const onSubmit: SubmitHandler<Omit<CreateEmployeeInput, "storeId">> = async (
    employeeData
  ) => {
    try {
      onAdd(employeeData)

      form.reset()
    } catch (error) {}
  }

  return (
    <form
      onChange={() => form.clearErrors()}
      onSubmit={form.handleSubmit(onSubmit, onFormError)}
    >
      <FieldGroup className="gap-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
                    className="h-12"
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
                    className="h-12"
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
                    className="h-12"
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
                    className="h-12"
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
                    className="h-12"
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
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
                    className="h-12 w-full"
                    {...controllerField}
                  >
                    <NativeSelectOption value="">
                      Select designation
                    </NativeSelectOption>
                    {designations.map((designation) => (
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
            name="branchId"
            control={form.control}
            render={({ field: controllerField, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor={controllerField.name}>Branch</FieldLabel>
                  <NativeSelect
                    id={controllerField.name}
                    aria-invalid={fieldState.invalid}
                    className="h-12 w-full"
                    {...controllerField}
                  >
                    <NativeSelectOption value="">
                      Select branch
                    </NativeSelectOption>
                    {branches.map((branch) => (
                      <NativeSelectOption key={branch.id} value={branch.id}>
                        {branch.name}
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
        </div>

        <div className="flex justify-end gap-4 pt-6">
          {/* submit button */}
          <SubmitButton
            variant="secondary"
            loading={form.formState.isSubmitting}
            size="xl"
          >
            <PlusIcon />{" "}
            {form.formState.isSubmitting ? "Adding..." : "Add to list"}
          </SubmitButton>
        </div>
      </FieldGroup>
    </form>
  )
}
