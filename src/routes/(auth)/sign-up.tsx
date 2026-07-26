import { AppLogo } from "@/components/app-logo"
import { SignupForm } from "@/components/signup-form"
import { getSession } from "@/lib/auth.functions"
import { generatePageTitle } from "@/lib/utils"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/(auth)/sign-up")({
  component: SignUpPage,
  head: () => ({
    meta: [{ title: generatePageTitle("Sign Up") }],
  }),
  beforeLoad: async () => {
    const session = await getSession()
    if (session) {
      throw redirect({ to: "/dashboard" })
    }
  },
})

function SignUpPage() {
  return (
    <>
      <div className="mb-8 space-y-4">
        <AppLogo />
        <h1 className="text-2xl font-medium">Sign up for TindaNatin</h1>
      </div>
      <SignupForm />
    </>
  )
}
