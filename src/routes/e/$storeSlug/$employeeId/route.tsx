import { AppLogo } from "@/components/app-logo"
import { siteConfig } from "@/config/site"
import { attendanceApi } from "@/features/attendance/attendance.functions"
import { EmployeeMenu } from "@/features/employees/employee-menu"
import { employeesApi } from "@/features/employees/employees.functions"
import { generatePageTitle } from "@/lib/utils"
import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/e/$storeSlug/$employeeId")({
  beforeLoad: async (context) => {
    const employeeSession = await employeesApi.getSession()

    if (!employeeSession.data?.attendanceId) {
      throw redirect({
        to: "/e/$storeSlug",
        params: {
          storeSlug: context.params.storeSlug,
        },
        replace: true,
      })
    }
  },
  loader: async ({ context, params }) => {
    if (!context.employee?.employeeId) {
      await employeesApi.clearSession()

      throw redirect({
        to: "/e/$storeSlug",
        params: { storeSlug: params.storeSlug },
      })
    }

    if (!context.employee.attendanceId) {
      await employeesApi.clearSession()

      throw redirect({
        to: "/e/$storeSlug",
        params: { storeSlug: params.storeSlug },
      })
    }

    const { employeeId, attendanceId } = context.employee

    const result = await attendanceApi.getActive({
      data: { attendanceId, employeeId },
    })

    if (!result.data?.id) {
      await employeesApi.clearSession()

      throw redirect({
        to: "/e/$storeSlug",
        params: { storeSlug: params.storeSlug },
      })
    }

    return result.data
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? generatePageTitle(
              `${loaderData?.employee?.lastName}, ${loaderData?.employee?.firstName}`
            )
          : "",
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const data = Route.useLoaderData()

  const { organization: store, employee, branch } = data

  return (
    <div className="p-4 pt-20">
      <div className="w-full text-left">
        <h1 className="text-xl font-semibold lg:text-2xl">
          {store.name} Employee Portal
        </h1>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          Powered by{" "}
          <span className="inline-flex items-center gap-1">
            <AppLogo size={16} /> {siteConfig.title}
          </span>
        </p>
      </div>
      <div className="w-full space-y-6 py-6 lg:py-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">
              Hi, {employee.firstName} 👋
            </h2>
            <p className="text-xs text-muted-foreground">
              {employee.designation.name} @ {store.name} {branch.name}
            </p>
          </div>
          <EmployeeMenu />
        </div>
        {/* nav links */}
        <nav className="flex items-center gap-2 border-b">
          <Link
            to="/e/$storeSlug/$employeeId"
            activeOptions={{ exact: true }}
            params={{ storeSlug: store.slug, employeeId: employee.id }}
            activeProps={{ className: "border-white" }}
            className="inline-flex items-center border-b-2 border-transparent px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            Home
          </Link>
          <Link
            to="/e/$storeSlug/$employeeId/logs"
            params={{ storeSlug: store.slug, employeeId: employee.id }}
            activeProps={{ className: "border-white" }}
            className="inline-flex items-center border-b-2 border-transparent px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            Logs
          </Link>
          <Link
            to="/e/$storeSlug/$employeeId/requests"
            params={{ storeSlug: store.slug, employeeId: employee.id }}
            activeProps={{ className: "border-white" }}
            className="inline-flex items-center border-b-2 border-transparent px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            Requests
          </Link>
        </nav>

        <Outlet />
      </div>
    </div>
  )
}
