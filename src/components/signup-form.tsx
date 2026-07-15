import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "@tanstack/react-router"
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

  const { errors, isSubmitting } = formState

  const onSubmit = async (signupData: SignupFormInput) => {
    const { error } = await authClient.signUp.email({
      email: signupData.email,
      password: signupData.password,
      name: signupData.name,
    })

    if (error) {
      console.log(error)
      toast.error(error.message)
      return
    }

    await navigate({ to: "/onboarding", replace: true })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
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
              <FieldLabel htmlFor="confirmPassword">
                Confirm password
              </FieldLabel>
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
            <FieldGroup>
              <Field>
                <SubmitButton
                  loading={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? "Creating account…" : "Create account"}
                </SubmitButton>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link to="/sign-in">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
