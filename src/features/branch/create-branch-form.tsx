import { MapEmbed } from "@/components/map-embed"
import { SubmitButton } from "@/components/submit-button"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { ArrowRightIcon, MapIcon } from "lucide-react"
import { useState } from "react"
import {
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form"
import { toast } from "sonner"
import { branchApi } from "./branch.functions"
import { branchSchema, type CreateBranchInput } from "./schema"

export function CreateBranchForm({ storeId }: { storeId: string }) {
  const createBranch = useServerFn(branchApi.create)

  const navigate = useNavigate()
  const router = useRouter()

  const [viewingInMap, setViewingInMap] = useState(false)

  const form = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: { name: "", address: "", storeId },
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

      toast.success(`Store branch ${result.data?.name} is successfully saved!`)

      await router.invalidate()

      navigate({
        to: "/onboarding/designations",
        replace: true,
      })
    } catch (err) {
      console.log("Thrown Error: ", err)
    }
  }

  const enteredAddress = form.watch("address")

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
            placeholder="e.g. Main Branch"
            autoComplete="branch-name"
            className="h-12"
            autoFocus
            aria-invalid={!!errors.name || undefined}
            {...form.register("name")}
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>
        <Field className="flex-1">
          <div className="flex items-center justify-between gap-4">
            <div>
              <FieldLabel htmlFor="address">
                Where is your branch located?
              </FieldLabel>
              <FieldDescription>
                Tip: Enter the address indicated in Google Maps
              </FieldDescription>
            </div>
            <Button
              type="button"
              disabled={!enteredAddress}
              variant="secondary"
              onClick={() => setViewingInMap(true)}
            >
              <MapIcon /> Verify On Map
            </Button>
          </div>
          <Textarea
            id="address"
            placeholder="Enter your branch's address"
            autoComplete="branch-address"
            className="min-h-20"
            aria-invalid={!!errors.address || undefined}
            {...form.register("address")}
          />

          {errors.address && <FieldError>{errors.address.message}</FieldError>}
        </Field>
        {viewingInMap && enteredAddress ? (
          <div className="space-y-3">
            <p className="text-sm leading-none font-medium select-none">
              Does this look right to you?
            </p>
            <MapEmbed location={enteredAddress} />
          </div>
        ) : null}
        <div className="flex justify-end pt-6">
          <SubmitButton loading={isSubmitting} size="xl">
            {isSubmitting ? (
              "Saving Branch…"
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
