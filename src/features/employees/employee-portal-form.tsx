import { SubmitButton } from "@/components/submit-button"
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { ArrowRightIcon } from "lucide-react"
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { employeesApi } from "./employees.functions"
import type { VerifyUsernameInput } from "./schema"
import { employeeUsernameSchema } from "./schema"

export function EmployeePortalForm({ storeId }: { storeId: string }) {
  return <EmployeeUsernameForm storeId={storeId} />
}

function EmployeeUsernameForm({ storeId }: { storeId: string }) {
  const createEmployeeSession = useServerFn(employeesApi.createSession)

  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(employeeUsernameSchema),
    defaultValues: { storeId, username: "" },
  })

  const onFormError: SubmitErrorHandler<VerifyUsernameInput> = (formError) => {
    console.error(`Verify Employee Username Form Error: `, formError)
  }

  const onSubmit: SubmitHandler<VerifyUsernameInput> = async (data) => {
    try {
      const result = await createEmployeeSession({ data })

      if (result.error) {
        console.log("Error verifying employee: ", result.error)

        toast.error(result.error.message)

        return
      }

      if (!result.data?.success) {
        console.log("Error verifying employee: ", "Error")

        toast.error("Error verifying employee")

        return
      }

      await router.invalidate()

      toast.success(`Employee verified!`)

      window.location.reload()
    } catch (err) {
      console.log("Thrown Error: ", err)
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, onFormError)}
      className="w-full py-10"
    >
      <Controller
        name="username"
        control={form.control}
        render={({ field: controllerField, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor={controllerField.name} className="text-base">
                Enter your username
              </FieldLabel>
              <Input
                id={controllerField.name}
                placeholder="Username"
                className="h-12"
                aria-invalid={fieldState.invalid}
                autoFocus
                {...controllerField}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </FieldContent>
          </Field>
        )}
      />
      <div className="flex justify-end gap-4 pt-6">
        {/* submit button */}
        <SubmitButton
          loading={form.formState.isSubmitting}
          size="xl"
          className="w-full"
        >
          {form.formState.isSubmitting ? (
            "Verifying..."
          ) : (
            <>
              <span>Submit</span>
              <ArrowRightIcon />
            </>
          )}
        </SubmitButton>
      </div>
    </form>
  )
}
