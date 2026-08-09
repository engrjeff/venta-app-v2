import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { PasswordInput } from "./password-input"
import { SubmitButton } from "./submit-button"

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type SignupFormInput = z.infer<typeof schema>

export function SignupForm() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState } = useForm<SignupFormInput>({
    resolver: zodResolver(schema),
  })

  const [loading, setLoading] = useState(false)

  const { errors } = formState

  const onSubmit = async (signupData: SignupFormInput) => {
    try {
      setLoading(true)
      const { error } = await authClient.signUp.email({
        email: signupData.email,
        password: signupData.password,
        name: signupData.name,
      })

      if (error) {
        throw error
      }

      await navigate({ to: "/onboarding", replace: true })
    } catch (error) {
      let msg =
        "An error occurred while creating your account. Try again later."

      if (error instanceof Error) {
        msg = error.message
      }

      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.name || undefined} className="flex-1">
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input
            id="name"
            placeholder="Enter your full name"
            autoComplete="given-name"
            aria-invalid={!!errors.name || undefined}
            {...register("name")}
            autoFocus
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>
        <Field data-invalid={!!errors.email || undefined}>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email || undefined}
            {...register("email")}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>

        <Field data-invalid={!!errors.password || undefined}>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <PasswordInput
            id="password"
            placeholder="Set your password"
            autoComplete="new-password"
            aria-invalid={!!errors.password || undefined}
            {...register("password")}
          />
          {errors.password && (
            <FieldError>{errors.password.message}</FieldError>
          )}
        </Field>

        <Field data-invalid={!!errors.confirmPassword || undefined}>
          <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
          <PasswordInput
            id="confirmPassword"
            placeholder="Confirm your password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword || undefined}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <FieldError>{errors.confirmPassword.message}</FieldError>
          )}
        </Field>
        <div className="mt-4">
          <SubmitButton loading={loading} className="w-full" size="lg">
            {loading ? "Creating account…" : "Continue"}
          </SubmitButton>
        </div>

        <div className="text-sm">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-blue-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </FieldGroup>
    </form>
  )
}
