import { CopyEmployeePortalButton } from "@/components/copy-employee-portal-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { dashboardApi } from "@/features/dashboard/dashboard.functions"
import { AttendanceStatus } from "@/generated/prisma/enums"
import { formatTime, generatePageTitle } from "@/lib/utils"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { CheckIcon, HomeIcon, PlusIcon, RefreshCwIcon } from "lucide-react"

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

  const onBreak = dashboard.data.attendances.filter(
    (a) => a.status === AttendanceStatus.ON_BREAK
  )

  const clockedOut = dashboard.data.attendances.filter(
    (a) => a.status === AttendanceStatus.CLOCKED_OUT
  )

  const notClockedInCount = employeeCount - dashboard.data.attendances.length

  const workingCount = working.length
  const onBreakCount = onBreak.length
  const clockedOutCount = clockedOut.length

  return (
    <div className="space-y-6">
      {/* page header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <HomeIcon className="size-4" />{" "}
          <h1 className="font-semibold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm">
            <PlusIcon /> Add Employee
          </Button>
          <CopyEmployeePortalButton />

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
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        <div className="space-y-4 border bg-card/60 p-3">
          <h2 className="text-sm font-semibold underline decoration-dotted underline-offset-4">
            Employees
          </h2>
          <p className="text-xl font-semibold">{employeeCount}</p>
        </div>
        <div className="space-y-4 border bg-card/60 p-3">
          <h2 className="text-sm font-semibold underline decoration-dotted underline-offset-4">
            Working Now
          </h2>
          <p className="text-xl font-semibold">{workingCount}</p>
        </div>
        <div className="space-y-4 border bg-card/60 p-3">
          <h2 className="text-sm font-semibold underline decoration-dotted underline-offset-4">
            Not Clocked In
          </h2>
          <p className="text-xl font-semibold">{notClockedInCount}</p>
        </div>
        <div className="space-y-4 border bg-card/60 p-3">
          <h2 className="text-sm font-semibold underline decoration-dotted underline-offset-4">
            Branches
          </h2>
          <p className="text-xl font-semibold">{branchCount}</p>
        </div>
      </div>

      {/* today's attendance */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          <div className="flex flex-col border bg-card/30">
            <div className="space-y-1 p-3">
              <p className="text-sm font-semibold">Employees' working status</p>
              <div className="flex items-center gap-4 text-xs">
                <p className="flex items-center">
                  <span className="mr-1 inline-block size-2 rounded-full bg-green-500" />{" "}
                  Working ({workingCount})
                </p>
                <p className="flex items-center">
                  <span className="mr-1 inline-block size-2 rounded-full bg-amber-500" />{" "}
                  On Break ({onBreakCount})
                </p>
                <p className="flex items-center">
                  <span className="mr-1 inline-block size-2 rounded-full bg-blue-500" />{" "}
                  Clocked Out ({clockedOutCount})
                </p>
              </div>
            </div>

            <div className="flex-1 p-1">
              <ul className="h-full divide-y bg-card">
                {/* STATUS = WORKING */}
                {working.map(({ employee, branch, timeIn }) => (
                  <li key={`working-${employee.id}`}>
                    <div className="flex items-start justify-between p-3">
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-xs">
                          {employee.designation.name} &bull; {branch.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="mr-1 inline-block size-1.5 rounded-full bg-green-500" />{" "}
                          {timeIn && <p>Since {formatTime(timeIn)}</p>}
                        </div>
                      </div>
                      <Badge className="bg-green-600">Working</Badge>
                    </div>
                  </li>
                ))}
                {/* STATUS = ON_BREAK */}
                {onBreak.map(({ employee, branch, breakStartedAt }) => (
                  <li key={`on-break-${employee.id}`}>
                    <div className="flex items-start justify-between p-3">
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-xs">
                          {employee.designation.name} &bull; {branch.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="mr-1 inline-block size-1.5 rounded-full bg-amber-500" />{" "}
                          {breakStartedAt && (
                            <p>Since {formatTime(breakStartedAt)}</p>
                          )}
                        </div>
                      </div>
                      <Badge className="bg-amber-600">On Break</Badge>
                    </div>
                  </li>
                ))}
                {/* STATUS = CLOCKED_OUT */}
                {clockedOut.map(({ employee, branch, timeOut }) => (
                  <li key={`clocked-out-${employee.id}`}>
                    <div className="flex items-start justify-between p-3">
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold">
                          {employee.firstName} {employee.lastName}
                        </p>
                        <p className="text-xs">
                          {employee.designation.name} &bull; {branch.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="mr-1 inline-block text-blue-500">
                            <CheckIcon className="size-3" />
                          </span>{" "}
                          {timeOut && <p>Since {formatTime(timeOut)}</p>}
                        </div>
                      </div>
                      <Badge className="bg-blue-600">Clocked Out</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
