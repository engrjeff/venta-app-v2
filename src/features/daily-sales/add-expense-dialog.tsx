import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { PlusIcon } from "lucide-react"
import { useState } from "react"
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { NumberInput } from "@/components/number-input"
import { ResponsiveFormSheet } from "@/components/responsive-form-sheet"
import { SubmitButton } from "@/components/submit-button"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { dailySalesApi } from "./daily-sales.functions"
import type { CreateExpenseInput } from "./schema"
import { expenseSchema } from "./schema"

export interface ExpenseEmployeeOption {
  id: string
  firstName: string
  lastName: string
}

interface AddExpenseDialogProps {
  storeId: string
  branchId: string
  employeeId: string
  employees: ExpenseEmployeeOption[]
}

export function AddExpenseDialog({
  storeId,
  branchId,
  employeeId,
  employees,
}: AddExpenseDialogProps) {
  const [open, setOpen] = useState(false)

  const close = () => setOpen(false)

  return (
    <>
      <Button type="button" size="sm" onClick={() => setOpen(true)}>
        <PlusIcon /> Add Expense
      </Button>

      <ResponsiveFormSheet
        open={open}
        onOpenChange={setOpen}
        title="Add Expense"
        description="Fill in the form below."
      >
        <AddExpenseForm
          storeId={storeId}
          branchId={branchId}
          employeeId={employeeId}
          employees={employees}
          onAfterSave={close}
          onCancel={close}
        />
      </ResponsiveFormSheet>
    </>
  )
}

function AddExpenseForm({
  storeId,
  branchId,
  employeeId,
  employees,
  onAfterSave,
  onCancel,
}: AddExpenseDialogProps & {
  onAfterSave: VoidFunction
  onCancel: VoidFunction
}) {
  const createExpenseFn = useServerFn(dailySalesApi.createExpenseFn)

  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      storeId,
      branchId,
      employeeId,
      description: "",
      amount: undefined,
      date: new Date().toISOString().split("T")[0],
    },
  })

  const onFormError: SubmitErrorHandler<CreateExpenseInput> = (formError) => {
    console.error(`Add Expense Form Error: `, formError)
  }

  const onSubmit: SubmitHandler<CreateExpenseInput> = async (inputs) => {
    try {
      const result = await createExpenseFn({ data: inputs })

      if (result.error) {
        console.log("Error creating expense: ", result.error)

        toast.error(result.error.message)

        return
      }

      toast.success("Expense successfully added!")

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
          {/* description */}
          <Controller
            name="description"
            control={form.control}
            render={({ field: controllerField, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor={controllerField.name}>
                    What&apos;s this expense for?
                  </FieldLabel>
                  <Textarea
                    id={controllerField.name}
                    placeholder="e.g. Bought cleaning supplies"
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
          {/* amount */}
          <Controller
            name="amount"
            control={form.control}
            render={({ field: controllerField, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor={controllerField.name}>Amount</FieldLabel>
                  <NumberInput
                    usePeso
                    id={controllerField.name}
                    placeholder="0.0"
                    aria-invalid={fieldState.invalid}
                    {...form.register("amount", {
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
          {/* responsible employee */}
          <Controller
            name="employeeId"
            control={form.control}
            render={({ field: controllerField, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor={controllerField.name}>
                    Handled By
                  </FieldLabel>
                  <NativeSelect
                    id={controllerField.name}
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                    disabled
                    {...controllerField}
                  >
                    <NativeSelectOption value="">
                      Select employee
                    </NativeSelectOption>
                    {employees.map((employee) => (
                      <NativeSelectOption key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
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
          {/* date */}
          <Controller
            name="date"
            control={form.control}
            render={({ field: controllerField, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor={controllerField.name}>Date</FieldLabel>
                  <Input
                    id={controllerField.name}
                    type="date"
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

          <div className="flex items-center justify-end gap-3 pt-2 pb-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <SubmitButton type="submit" loading={form.formState.isSubmitting}>
              Save
            </SubmitButton>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}
