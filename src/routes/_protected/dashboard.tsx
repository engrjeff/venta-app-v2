import { CopyEmployeePortalButton } from "@/components/copy-employee-portal-button"
import { PageHeader } from "@/components/page-header"
import { StatCard } from "@/components/stat-card"
import { Button } from "@/components/ui/button"

import { AttendanceTodayMobileList } from "@/features/dashboard/attendance-today-mobile-list"
import { AttendanceTodayWidget } from "@/features/dashboard/attendance-today-widget"
import { DashboardMobileHeader } from "@/features/dashboard/dashboard-mobile-header"
import { DashboardMobileStats } from "@/features/dashboard/dashboard-mobile-stats"
import { dashboardApi } from "@/features/dashboard/dashboard.functions"
import { PendingRequestsBanner } from "@/features/dashboard/pending-requests-banner"
import { PendingRequestsWidget } from "@/features/dashboard/pending-requests-widget"
import { requestsApi } from "@/features/requests/requests.functions"
import {
  AttendanceRequestStatus,
  AttendanceStatus,
} from "@/generated/prisma/enums"
import { generatePageTitle } from "@/lib/utils"
import {
  createFileRoute,
  useLoaderData,
  useRouteContext,
} from "@tanstack/react-router"
import { BellIcon } from "lucide-react"

export const Route = createFileRoute("/_protected/dashboard")({
  loader: async ({ context }) => {
    if (!context.activeStoreId) return null

    const [dashboardData, pendingRequests] = await Promise.all([
      dashboardApi.get({
        data: { storeId: context.activeStoreId },
      }),
      requestsApi.getByStoreFn({
        data: {
          storeId: context.activeStoreId,
          status: {
            operator: "is",
            value: [AttendanceRequestStatus.PENDING],
          },
        },
      }),
    ])

    return { ...dashboardData, pendingRequests }
  },
  head: () => ({
    meta: [{ title: generatePageTitle("Dashboard") }],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const dashboard = Route.useLoaderData()

  const { activeStoreId } = useRouteContext({ from: "/_protected/dashboard" })
  const stores = useLoaderData({ from: "/_protected" })
  const activeStore = stores.data?.find((store) => store.id === activeStoreId)

  if (dashboard?.error) return <div>Error</div>

  if (!dashboard?.data) return <div>No Data</div>

  const { employees: employeeCount, branches: branchCount } =
    dashboard.data._count

  const working = dashboard.data.attendances.filter(
    (a) => a.status === AttendanceStatus.WORKING
  )

  const onBreak = dashboard.data.attendances.filter(
    (a) => a.status === AttendanceStatus.ON_BREAK
  )

  const workingCount = working.length

  const onBreakCount = onBreak.length

  const pendingRequests = dashboard.pendingRequests.data ?? []

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pt-16 pb-24 md:gap-6 md:pt-0 md:pb-4">
      {/* desktop page header */}
      <PageHeader className="hidden md:flex">
        <PageHeader.Heading>
          <PageHeader.Title>Dashboard</PageHeader.Title>
        </PageHeader.Heading>
        <PageHeader.Actions>
          <Button size="icon-sm" variant="outline">
            <BellIcon />
          </Button>
          <CopyEmployeePortalButton />
        </PageHeader.Actions>
      </PageHeader>

      {/* mobile store header */}
      <div className="md:hidden">
        {activeStore && <DashboardMobileHeader store={activeStore} />}
      </div>

      {/* desktop stat cards  */}
      <div className="hidden grid-cols-4 gap-4 px-4 md:grid md:gap-6 md:px-6">
        <StatCard>
          <StatCard.Label>Total Employees</StatCard.Label>
          <StatCard.Value numeric>{employeeCount}</StatCard.Value>
          <StatCard.Caption>across {branchCount} branches</StatCard.Caption>
        </StatCard>
        <StatCard>
          <StatCard.Label>Working Now</StatCard.Label>
          <StatCard.Value numeric className="text-emerald-500">
            {workingCount}
          </StatCard.Value>
          <StatCard.Caption>{onBreakCount} on break</StatCard.Caption>
        </StatCard>
        {/* TODO: wire up real sales data */}
        <StatCard>
          <StatCard.Label>Sales Today</StatCard.Label>
          <StatCard.Value numeric>₱48,320</StatCard.Value>
          <StatCard.Caption className="text-emerald-500">
            +12.4% vs yesterday
          </StatCard.Caption>
        </StatCard>
        {/* TODO: wire up real cash-on-hand data */}
        <StatCard>
          <StatCard.Label>Cash on Hand</StatCard.Label>
          <StatCard.Value numeric>₱12,050</StatCard.Value>
          <StatCard.Caption>last logged 2:14 PM</StatCard.Caption>
        </StatCard>
      </div>

      <div className="hidden grid-cols-12 gap-6 px-6 md:grid">
        <div className="col-span-8">
          <AttendanceTodayWidget
            employees={dashboard.data.employees}
            attendanceRecords={dashboard.data.attendances}
            scheduledCount={employeeCount}
          />
        </div>
        <div className="col-span-4">
          <PendingRequestsWidget requests={pendingRequests} />
        </div>
      </div>

      {/* mobile screen */}
      <div className="flex flex-col gap-6 md:hidden">
        {/* TODO: wire up real sales data */}
        <DashboardMobileStats
          salesToday="₱48,320"
          salesChangeLabel="+12.4%"
          workingCount={workingCount}
          scheduledCount={employeeCount}
          onBreakCount={onBreakCount}
        />

        <PendingRequestsBanner requests={pendingRequests} />

        <AttendanceTodayMobileList
          employees={dashboard.data.employees}
          attendanceRecords={dashboard.data.attendances}
        />
      </div>
    </div>
  )
}
