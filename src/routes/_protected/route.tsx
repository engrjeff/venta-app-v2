import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { onboardingApi } from "@/features/onboarding/onboarding.functions"
import { storeApi } from "@/features/store/store.functions"
import { getSession } from "@/lib/auth.functions"
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_protected")({
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
      activeStoreId: session.session.activeOrganizationId as string,
    }
  },
  loader: async ({ context }) => {
    // check onboarding status
    const status = await onboardingApi.checkOnboardingStatus({
      data: { id: context.activeStoreId ?? undefined },
    })

    if (!status.data?.completed && status.data?.nextStep) {
      throw redirect({ to: status.data.nextStep })
    }

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
      <SidebarInset className="flex max-h-screen flex-col overflow-hidden">
        <AppHeader />
        <div className="h-[calc(100%-48px)] max-h-[calc(100%-48px)] flex-1 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
