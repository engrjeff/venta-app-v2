import { SubmitButton } from "@/components/submit-button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { ArrowRightIcon } from "lucide-react"
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { onboardingApi } from "./onboarding.functions"
import type { CreateStoreInputs } from "./schema"
import { storeSchema } from "./schema"

export function CreateStoreForm() {
  const createStore = useServerFn(onboardingApi.create)

  const navigate = useNavigate()
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(storeSchema),
    defaultValues: { name: "" },
  })

  const { errors, isSubmitting } = form.formState

  const onFormError: SubmitErrorHandler<CreateStoreInputs> = (formError) => {
    console.error(`Create Store Form Error: `, formError)
  }

  const onSubmit: SubmitHandler<CreateStoreInputs> = async (storeData) => {
    try {
      const result = await createStore({ data: storeData })

      if (result.error) {
        console.log("Error creating store: ", result.error)

        let errMessage = result.error.message

        if (result.error.code === "ORGANIZATION_ALREADY_EXISTS") {
          errMessage = "The provided store name is already in use."
        }
        toast.error(errMessage)

        return
      }

      await router.invalidate()

      toast.success(`Your store ${result.data?.name} is successfully created!`)

      navigate({
        to: "/onboarding/store-settings",
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
      noValidate
    >
      <FieldGroup>
        <Field className="flex-1">
          <FieldLabel htmlFor="name">Store Name</FieldLabel>
          <FieldDescription>What is your store called?</FieldDescription>
          <Input
            id="name"
            placeholder="e.g. My Store Enterprises"
            autoComplete="store-name"
            aria-invalid={!!errors.name || undefined}
            {...form.register("name")}
            className="h-12"
            autoFocus
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>
        <div className="flex justify-end pt-6">
          <SubmitButton loading={isSubmitting} size="xl">
            {isSubmitting ? (
              "Creating your store…"
            ) : (
              <>
                Next <ArrowRightIcon />
              </>
            )}
          </SubmitButton>
        </div>
      </FieldGroup>
    </form>
  )
}
