import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { SubmitButton } from "@/components/submit-button"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { AttendanceRequestType } from "@/generated/prisma/enums"
import { ATTENDANCE_REQUEST_TYPE_LABELS } from "./request-labels"
import { requestsApi } from "./requests.functions"
import type { CreateAttendanceRequestInput } from "./schema"
import { createAttendanceRequestSchema } from "./schema"

interface CreateRequestFormProps {
  attendanceId: string
  employeeId: string
  onAfterSave: VoidFunction
  onCancel: VoidFunction
}

export function CreateRequestForm({
  attendanceId,
  employeeId,
  onAfterSave,
  onCancel,
}: CreateRequestFormProps) {
  const createRequestFn = useServerFn(requestsApi.createRequestFn)

  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(createAttendanceRequestSchema),
    defaultValues: {
      attendanceId,
      employeeId,
      type: AttendanceRequestType.FORGOT_TO_CLOCK_OUT,
      reason: "",
      clockOutTime: "",
    },
  })

  const type = form.watch("type")

  const onFormError: SubmitErrorHandler<CreateAttendanceRequestInput> = (
    formError
  ) => {
    console.error(`Create Request Form Error: `, formError)
  }

  const onSubmit: SubmitHandler<CreateAttendanceRequestInput> = async (
    inputs
  ) => {
    try {
      const result = await createRequestFn({ data: inputs })

      if (result.error) {
        console.log("Error creating request: ", result.error)

        toast.error(result.error.message)

        return
      }

      toast.success("Request successfully submitted!")

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
          <Controller
            name="type"
            control={form.control}
            render={({ field: controllerField, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor={controllerField.name}>
                    Request Type
                  </FieldLabel>
                  <NativeSelect
                    id={controllerField.name}
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                    {...controllerField}
                  >
                    {Object.values(AttendanceRequestType).map((rtype) => (
                      <NativeSelectOption key={rtype} value={rtype}>
                        {ATTENDANCE_REQUEST_TYPE_LABELS[rtype]}
                      </NativeSelectOption>
                    ))}
                  </NativeSelect>
                  <FieldDescription>
                    Your admin will review and update this day&apos;s attendance
                    once approved.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />

          {type === AttendanceRequestType.FORGOT_TO_CLOCK_OUT && (
            <Controller
              name="clockOutTime"
              control={form.control}
              render={({ field: controllerField, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={controllerField.name}>
                      What time were you supposed to clock out?
                    </FieldLabel>
                    <Input
                      id={controllerField.name}
                      type="time"
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
          )}

          <Controller
            name="reason"
            control={form.control}
            render={({ field: controllerField, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldContent>
                  <FieldLabel htmlFor={controllerField.name}>Reason</FieldLabel>
                  <Textarea
                    id={controllerField.name}
                    placeholder="e.g. Forgot my phone, No signal, etc."
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

          <div className="flex items-center justify-end gap-3 pt-2 pb-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <SubmitButton type="submit" loading={form.formState.isSubmitting}>
              Submit Request
            </SubmitButton>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}
