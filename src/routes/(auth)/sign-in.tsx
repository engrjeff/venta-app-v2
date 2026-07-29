import { createFileRoute, redirect } from "@tanstack/react-router"
import z from "zod"
import { AppLogo } from "@/components/app-logo"
import { SigninForm } from "@/components/signin-form"
import { getSession } from "@/lib/auth.functions"
import { generatePageTitle } from "@/lib/utils"

export const Route = createFileRoute("/(auth)/sign-in")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  beforeLoad: async ({ search }) => {
    const session = await getSession()
    if (session) {
      throw redirect({ to: search.redirect ?? "/dashboard" })
    }
  },
  component: RouteComponent,
  head: () => ({
    meta: [{ title: generatePageTitle("Sign In") }],
  }),
})

function RouteComponent() {
  return (
    <>
      <div className="mb-8 space-y-4">
        <AppLogo />
        <h1 className="text-2xl font-medium">Sign in to TindaNatin</h1>
      </div>
      <SigninForm />
    </>
  )
}
