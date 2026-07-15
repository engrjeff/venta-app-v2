import { SubmitButton } from "@/components/submit-button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { authClient } from "@/lib/auth-client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { CheckIcon } from "lucide-react"
import {
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form"
import { toast } from "sonner"
import { branchApi } from "./branch.functions"
import { branchSchema, type CreateBranchInput } from "./schema"

export function CreateBranchForm() {
  const createBranch = useServerFn(branchApi.create)
  const store = authClient.useActiveOrganization()
  const navigate = useNavigate()

  const form = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: { name: "", address: "", storeId: "" },
    values: { name: "", address: "", storeId: store.data?.id ?? "" },
  })

  const { errors, isSubmitting } = form.formState

  const onFormError: SubmitErrorHandler<CreateBranchInput> = (formError) => {
    console.error(`Create Branch Form Error: `, formError)
  }

  const onSubmit: SubmitHandler<CreateBranchInput> = async (branchData) => {
    try {
      const result = await createBranch({ data: branchData })

      if (result.error) {
        console.log("Error creating branch: ", result.error)

        toast.error(result.error.message)

        return
      }

      toast.success(
        `Store branch ${result.data?.name} is successfully created!`
      )

      navigate({ to: "/onboarding/designations", replace: true })
    } catch (err) {
      console.log("Thrown Error: ", err)
    }
  }

  return (
    <form
      onChange={() => form.clearErrors()}
      onSubmit={form.handleSubmit(onSubmit, onFormError)}
      noValidate
    >
      <FieldGroup>
        <Field className="flex-1">
          <FieldLabel htmlFor="name">
            What should we call your branch?
          </FieldLabel>
          <Input
            id="name"
            placeholder="Enter your branch's name"
            autoComplete="branch-name"
            className="h-12"
            autoFocus
            aria-invalid={!!errors.name || undefined}
            {...form.register("name")}
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>
        <Field className="flex-1">
          <FieldLabel htmlFor="address">
            Where is your branch located?
          </FieldLabel>
          <Textarea
            id="address"
            placeholder="Enter your branch's address"
            autoComplete="branch-address"
            className="min-h-20"
            aria-invalid={!!errors.name || undefined}
            {...form.register("address")}
          />
          {errors.address && <FieldError>{errors.address.message}</FieldError>}
        </Field>
        <div className="flex justify-end pt-6">
          <SubmitButton loading={isSubmitting} size="xl">
            Create Branch <CheckIcon />
          </SubmitButton>
        </div>
      </FieldGroup>
    </form>
  )
}
