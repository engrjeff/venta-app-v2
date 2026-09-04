import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { format } from "date-fns"
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { NumberInput } from "@/components/number-input"
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
import type { ExpenseEmployeeOption } from "./add-expense-dialog"
import { dailySalesApi } from "./daily-sales.functions"
import type { ExpenseWithEmployee } from "./expense.types"
import type { UpdateExpenseInput } from "./schema"
import { expenseUpdateSchema } from "./schema"

interface UpdateExpenseFormProps {
  expense: ExpenseWithEmployee
  employees: ExpenseEmployeeOption[]
  onAfterSave: VoidFunction
  onCancel: VoidFunction
}

export function UpdateExpenseForm({
  expense,
  employees,
  onAfterSave,
  onCancel,
}: UpdateExpenseFormProps) {
  const updateExpenseFn = useServerFn(dailySalesApi.updateExpenseFn)

  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(expenseUpdateSchema),
    defaultValues: {
      id: expense.id,
      storeId: expense.organizationId,
      branchId: expense.branchId,
      employeeId: expense.employeeId,
      description: expense.description,
      amount: expense.amount,
      date: format(expense.date, "yyyy-MM-dd"),
    },
  })

  const onFormError: SubmitErrorHandler<UpdateExpenseInput> = (formError) => {
    console.error(`Update Expense Form Error: `, formError)
  }

  const onSubmit: SubmitHandler<UpdateExpenseInput> = async (inputs) => {
    try {
      const result = await updateExpenseFn({ data: inputs })

      if (result.error) {
        console.log("Error updating expense: ", result.error)

        toast.error(result.error.message)

        return
      }

      toast.success("Expense successfully updated!")

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
              Save Changes
            </SubmitButton>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}
