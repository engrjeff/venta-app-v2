import { useLocation } from "@tanstack/react-router"
import {
  Building2Icon,
  CheckCircleIcon,
  NetworkIcon,
  StoreIcon,
  UsersIcon,
} from "lucide-react"

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

export function OnboardingSteps() {
  const location = useLocation()

  const activeStep =
    ONBOARDING_STEPS.find((step) => step.pathname === location.pathname) ??
    ONBOARDING_STEPS[0]

  return (
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
  )
}
