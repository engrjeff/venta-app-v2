import { SigninForm } from "@/components/signin-form"
import { getSession } from "@/lib/auth.functions"
import { generatePageTitle } from "@/lib/utils"
import { createFileRoute, redirect } from "@tanstack/react-router"
import z from "zod"

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
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Welcome to TindaNatin!
        </h1>
        <SigninForm />
      </div>
    </div>
  )
}
