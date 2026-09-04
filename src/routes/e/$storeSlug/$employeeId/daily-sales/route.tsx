import { buttonVariants } from "@/components/ui/button"
import { generatePageTitle } from "@/lib/utils"
import {
  Link,
  Outlet,
  createFileRoute,
  useParams,
} from "@tanstack/react-router"

export const Route = createFileRoute("/e/$storeSlug/$employeeId/daily-sales")({
  head: () => ({
    meta: [{ title: generatePageTitle("Daily Sales") }],
  }),
  component: RouteComponent,
})

const tabs = [
  {
    label: "Summary",
    to: "/e/$storeSlug/$employeeId/daily-sales",
    exact: true,
  },
  {
    label: "Expenses",
    to: "/e/$storeSlug/$employeeId/daily-sales/expenses",
    exact: false,
  },
  {
    label: "Cash-on-hand",
    to: "/e/$storeSlug/$employeeId/daily-sales/cash-on-hand",
    exact: false,
  },
  {
    label: "Sales",
    to: "/e/$storeSlug/$employeeId/daily-sales/sales",
    exact: false,
  },
] as const

function RouteComponent() {
  const params = useParams({ from: "/e/$storeSlug/$employeeId" })

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Daily Sales</h2>
        <p className="text-xs text-muted-foreground">
          Track today&apos;s expenses, cash-on-hand, and sales.
        </p>
      </div>

      <nav className="flex items-center gap-1 overflow-x-auto border-b pb-1">
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            params={params}
            activeOptions={{ exact: tab.exact }}
            className={buttonVariants({ variant: "ghost" })}
            activeProps={{
              className: buttonVariants({ variant: "secondary" }),
            }}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      <Outlet />
    </div>
  )
}
