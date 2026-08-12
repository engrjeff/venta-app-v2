import { Button } from "@/components/ui/button"
import { AttendanceTodayWidget } from "@/features/dashboard/attendance-today-widget"

import { dashboardApi } from "@/features/dashboard/dashboard.functions"
import { AttendanceStatus } from "@/generated/prisma/enums"
import { generatePageTitle } from "@/lib/utils"
import { createFileRoute, Link, useRouter } from "@tanstack/react-router"
import { HomeIcon, RefreshCwIcon } from "lucide-react"

export const Route = createFileRoute("/_protected/dashboard")({
  loader: async ({ context }) => {
    if (!context.activeStoreId) return null

    const dashboardData = await dashboardApi.get({
      data: { storeId: context.activeStoreId },
    })

    return dashboardData
  },
  head: () => ({
    meta: [{ title: generatePageTitle("Dashboard") }],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const dashboard = Route.useLoaderData()

  const router = useRouter()

  if (dashboard?.error) return <div>Error</div>

  if (!dashboard?.data) return <div>No Data</div>

  const { employees: employeeCount, branches: branchCount } =
    dashboard.data._count

  const working = dashboard.data.attendances.filter(
    (a) => a.status === AttendanceStatus.WORKING
  )

  const notClockedInCount = employeeCount - dashboard.data.attendances.length

  const workingCount = working.length

  return (
    <div className="space-y-4 p-4">
      {/* page header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <HomeIcon className="size-4" />{" "}
          <h1 className="font-semibold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            aria-label="Refresh"
            size="icon-sm"
            variant="outline"
            onClick={() => router.invalidate()}
          >
            <RefreshCwIcon />
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Link to="/employees" className="group">
          <div className="space-y-4 rounded-md border bg-card p-4">
            <h2 className="text-sm font-semibold underline decoration-dotted underline-offset-4 group-hover:text-blue-500">
              Employees
            </h2>
            <p className="text-2xl font-semibold">{employeeCount}</p>
          </div>
        </Link>
        <div className="space-y-4 rounded-md border bg-card p-4">
          <h2 className="text-sm font-semibold underline decoration-dotted underline-offset-4">
            Working Now
          </h2>
          <p
            data-active={workingCount > 0}
            className="text-2xl font-semibold data-active:text-green-500"
          >
            {workingCount}
          </p>
        </div>
        <div className="space-y-4 rounded-md border bg-card p-4">
          <h2 className="text-sm font-semibold underline decoration-dotted underline-offset-4">
            Not Clocked In
          </h2>
          <p className="text-2xl font-semibold">{notClockedInCount}</p>
        </div>
        <div className="group space-y-4 rounded-md border bg-card p-4">
          <h2 className="text-sm font-semibold underline decoration-dotted underline-offset-4 group-hover:text-blue-500">
            Branches
          </h2>
          <p className="text-2xl font-semibold">{branchCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2">
          <AttendanceTodayWidget
            attendanceRecords={dashboard.data.attendances}
          />
        </div>
      </div>
    </div>
  )
}
