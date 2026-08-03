import { SubmitButton } from "@/components/submit-button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BUSINESS_TYPES } from "@/lib/constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { ArrowRightIcon } from "lucide-react"
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { onboardingApi } from "./onboarding.functions"
import type { CreateStoreSettingsInputs } from "./schema"
import { storeSettingsSchema } from "./schema"

export function CreateStoreSettingsForm({ storeId }: { storeId: string }) {
  const createStoreSettings = useServerFn(onboardingApi.createSettings)

  const navigate = useNavigate()
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: { storeId, businessType: "" },
  })

  const { isSubmitting } = form.formState

  const onFormError: SubmitErrorHandler<CreateStoreSettingsInputs> = (
    formError
  ) => {
    console.error(`Create Store Settings Form Error: `, formError)
  }

  const onSubmit: SubmitHandler<CreateStoreSettingsInputs> = async (
    settingsData
  ) => {
    try {
      const result = await createStoreSettings({ data: settingsData })

      if (result.error) {
        console.log("Error creating store settings: ", result.error)

        toast.error(result.error.message)

        return
      }
      await router.invalidate()

      toast.success(`Saved successfully!`)

      navigate({
        to: "/onboarding/branch",
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
        <Controller
          name="businessType"
          control={form.control}
          render={({ field, fieldState }) => (
            <FieldSet data-invalid={fieldState.invalid}>
              <FieldLegend className="sr-only">Business Type</FieldLegend>
              <FieldDescription className="sr-only">
                Select a business type for your business.
              </FieldDescription>
              <RadioGroup
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                aria-invalid={fieldState.invalid}
                className="grid grid-cols-1 lg:grid-cols-2"
              >
                {BUSINESS_TYPES.map((businessType) => (
                  <FieldLabel
                    key={businessType.value}
                    htmlFor={`business-type-${businessType.value}`}
                  >
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldContent>
                        <FieldTitle>
                          {businessType.emoji} {businessType.value}
                        </FieldTitle>
                        <FieldDescription>
                          {businessType.description}
                        </FieldDescription>
                      </FieldContent>
                      <RadioGroupItem
                        value={businessType.value}
                        id={`business-type-${businessType.value}`}
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
        <div className="flex justify-end pt-6">
          <SubmitButton loading={isSubmitting} size="xl">
            {isSubmitting ? (
              "Saving…"
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
