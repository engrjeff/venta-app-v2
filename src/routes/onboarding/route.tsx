import { HeaderUserMenu } from "@/components/header-user-menu"
import { onboardingApi } from "@/features/onboarding/onboarding.functions"
import { getSession } from "@/lib/auth.functions"
import { generatePageTitle } from "@/lib/utils"
import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router"
import {
  Building2Icon,
  CheckCircleIcon,
  NetworkIcon,
  StoreIcon,
  UsersIcon,
} from "lucide-react"

export const Route = createFileRoute("/onboarding")({
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

    // if (status.data?.completed) {
    //   throw redirect({ to: "/dashboard" })
    // }

    // Only redirect if they're trying to access the wrong onboarding step.
    if (location.pathname !== status.data?.nextStep && status.data?.nextStep) {
      throw redirect({ to: status.data?.nextStep })
    }

    return {
      user: session.user,
      organizationId: session.session.activeOrganizationId,
      status,
    }
  },
  component: RouteComponent,
  head: () => ({
    meta: [{ title: generatePageTitle("Onboarding") }],
  }),
})

const ONBOARDING_STEPS = [
  {
    id: "store",
    title: "Store",
    subtitle: "Create your store",
    Icon: StoreIcon,
    pathname: "/onboarding",
    step: 1,
  },
  {
    id: "branch",
    title: "Branch",
    subtitle: "Add your first branch",
    Icon: Building2Icon,
    pathname: "/onboarding/branch",
    step: 2,
  },
  {
    id: "designations",
    title: "Designations",
    subtitle: "List designations",
    Icon: NetworkIcon,
    pathname: "/onboarding/designations",
    step: 3,
  },
  {
    id: "employees",
    title: "Employees",
    subtitle: "Build your team",
    Icon: UsersIcon,
    pathname: "/onboarding/employees",
    step: 4,
  },
  {
    id: "finish",
    title: "Finish",
    subtitle: "You're all set",
    Icon: CheckCircleIcon,
    pathname: "/onboarding/finish",
    step: 5,
  },
]

function RouteComponent() {
  const location = useLocation()

  const activeStep =
    ONBOARDING_STEPS.find((step) => step.pathname === location.pathname) ??
    ONBOARDING_STEPS[0]

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <header className="container mx-auto flex max-w-5xl items-center justify-between gap-4 border-b py-8">
        <div>
          <h1 className="text-2xl font-bold">TindaNatin</h1>
        </div>
        <div>
          <HeaderUserMenu />
        </div>
      </header>
      <div className="container mx-auto flex max-w-5xl flex-1">
        <aside className="flex shrink-0 flex-col items-center border-r p-8">
          <ul className="space-y-8">
            {ONBOARDING_STEPS.map((step) => (
              <li
                key={step.id}
                data-active={
                  step.pathname === activeStep.pathname ||
                  step.step <= activeStep.step
                }
                className="group relative after:absolute after:top-[calc(100%-16px)] after:right-9 after:h-full after:w-0.5 after:-translate-x-px after:bg-muted last:after:hidden"
              >
                <div className="flex items-center justify-between gap-8 p-4">
                  <div className="flex-1">
                    <h2 className="text-right font-semibold text-muted-foreground group-data-active:text-foreground">
                      {step.title}
                    </h2>
                    <p className="text-right text-sm text-muted-foreground">
                      {step.subtitle}
                    </p>
                  </div>
                  <div className="relative flex size-11 items-center justify-center rounded-full bg-primary/30 text-white group-data-active:bg-primary dark:bg-muted dark:group-data-active:bg-primary">
                    <step.Icon size={20} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </aside>
        <main className="flex-1 space-y-6 p-12">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
