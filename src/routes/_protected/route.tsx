import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { onboardingApi } from "@/features/onboarding/onboarding.functions"
import { storeApi } from "@/features/store/store.functions"
import { getSession } from "@/lib/auth.functions"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected")({
  beforeLoad: async ({ location }) => {
    const session = await getSession()

    if (!session) {
      throw redirect({
        to: "/sign-in",
        search: { redirect: location.href },
      })
    }

    // check onboarding status
    const status = await onboardingApi.checkOnboardingStatus({
      data: { id: session.session.activeOrganizationId ?? undefined },
    })

    if (!status.data?.completed && status.data?.nextStep) {
      throw redirect({ to: status.data?.nextStep })
    }

    return {
      user: session.user,
      activeStoreId: session.session.activeOrganizationId,
    }
  },
  loader: async () => {
    const stores = await storeApi.getAll()

    return stores
  },
  component: RouteComponent,
})

function RouteComponent() {
  const loaderData = Route.useLoaderData()

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar stores={loaderData.data} />
      <SidebarInset>
        <AppHeader />
        <main>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
