import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { siteConfig } from "@/config/site"
import { authClient } from "@/lib/auth-client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate, useSearch } from "@tanstack/react-router"
import { useState } from "react"
import {
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form"
import z from "zod"
import { PasswordInput } from "./password-input"
import { SubmitButton } from "./submit-button"
import { Alert, AlertDescription } from "./ui/alert"

const schema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormInput = z.infer<typeof schema>

export function SigninForm() {
  const { redirect: redirectTo } = useSearch({ from: "/(auth)/sign-in" })
  const navigate = useNavigate()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(schema as any),
  })

  const onFormError: SubmitErrorHandler<LoginFormInput> = async (formError) => {
    console.error(`Login Form Error :`, formError)
  }

  const onSubmit: SubmitHandler<LoginFormInput> = async (
    data: LoginFormInput
  ) => {
    setServerError(null)

    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setServerError(error.message ?? "Invalid email or password")
      return
    }

    const orgs = await authClient.organization.list()

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
        await navigate({ to: redirectTo ?? "/dashboard", replace: true })
      } else {
        await navigate({ to: "/onboarding", replace: true })
      }
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your {siteConfig.title} account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit, onFormError)} noValidate>
          <FieldGroup>
            {serverError && (
              <Alert variant="destructive">
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

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

            <SubmitButton loading={isSubmitting} className="w-full" size="lg">
              {isSubmitting ? "Signing in…" : "Sign in"}
            </SubmitButton>
          </FieldGroup>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to="/sign-up"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
