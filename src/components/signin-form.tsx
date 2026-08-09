import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient, getAuthErrorMessage } from "@/lib/auth-client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate, useSearch } from "@tanstack/react-router"
import { useState } from "react"
import type { SubmitErrorHandler, SubmitHandler } from "react-hook-form"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { PasswordInput } from "./password-input"
import { SubmitButton } from "./submit-button"

const schema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormInput = z.infer<typeof schema>

export function SigninForm() {
  const { redirect: redirectTo } = useSearch({ from: "/(auth)/sign-in" })
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(schema as any),
  })

  const onFormError: SubmitErrorHandler<LoginFormInput> = async (formError) => {
    console.error(`Login Form Error :`, formError)
  }

  const onSubmit: SubmitHandler<LoginFormInput> = async (
    data: LoginFormInput
  ) => {
    try {
      setLoading(true)

      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      })

      if (error) {
        throw error
      }

      const orgs = await authClient.organization.list()

      if (orgs.error) {
        throw orgs.error
      }

      // if not yet onboarded, redirect to /onboarding
      if (!orgs.data?.length) {
        await navigate({ to: "/onboarding", replace: true })
      } else {
        const orgToSetActive = orgs.data[0]

        const activeOrg = await authClient.organization.setActive({
          organizationId: orgToSetActive.id,
          organizationSlug: orgToSetActive.slug,
        })

        if (activeOrg.data?.id) {
          await navigate({
            to: redirectTo ?? "/dashboard",
            replace: true,
          })
        } else {
          await navigate({
            to: "/onboarding",
            replace: true,
          })
        }
      }
    } catch (error) {
      console.error(`Sign In Error: `, error)
      toast.error(
        getAuthErrorMessage(
          error,
          "An error occurred while signing in. Try again later."
        )
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onFormError)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.email || undefined}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email || undefined}
            {...register("email")}
            autoFocus
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.password || undefined}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <PasswordInput
            id="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            aria-invalid={!!errors.password || undefined}
            {...register("password")}
          />
          {errors.password && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </Field>

        <div className="mt-4">
          <SubmitButton loading={loading} className="w-full" size="lg">
            {loading ? "Signing in…" : "Sign in"}
          </SubmitButton>
        </div>

        <div className="text-sm">
          <p className="text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/sign-up" className="text-blue-500 hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </FieldGroup>
    </form>
  )
}
