import { AppLogo } from "@/components/app-logo"
import { HeaderUserMenu } from "@/components/header-user-menu"
import { siteConfig } from "@/config/site"
import { onboardingApi } from "@/features/onboarding/onboarding.functions"
import { getSession } from "@/lib/auth.functions"
import { generatePageTitle } from "@/lib/utils"
import { Link, Outlet, createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/onboarding")({
  beforeLoad: async ({ location }) => {
    const session = await getSession()

    if (!session) {
      throw redirect({
        to: "/sign-in",
        search: { redirect: location.href },
      })
    }

    return {
      user: session.user,
      storeId: session.session.activeOrganizationId,
    }
  },
  loader: async ({ context, location }) => {
    // check onboarding status
    const status = await onboardingApi.checkOnboardingStatus({
      data: { id: context.storeId ?? undefined },
    })

    // Only redirect if they're trying to access the wrong onboarding step.
    if (location.pathname !== status.data?.nextStep && status.data?.nextStep) {
      throw redirect({ to: status.data.nextStep })
    }

    return { status }
  },
  component: RouteComponent,
  head: () => ({
    meta: [{ title: generatePageTitle("Onboarding") }],
  }),
})

function RouteComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <header className="container mx-auto flex max-w-5xl items-center justify-between gap-4 border-b py-8">
        <Link to="/" className="inline-flex items-center gap-4">
          <AppLogo size={36} />
          <h1 className="text-lg font-semibold">{siteConfig.title}</h1>
        </Link>
        <div>
          <HeaderUserMenu />
        </div>
      </header>
      <div className="container mx-auto flex max-w-3xl flex-1">
        <main className="flex-1 space-y-6 py-12">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
