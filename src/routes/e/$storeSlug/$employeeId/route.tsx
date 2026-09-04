import { AppLogo } from "@/components/app-logo"
import { siteConfig } from "@/config/site"
import { attendanceApi } from "@/features/attendance/attendance.functions"
import { EmployeePortalBottomNav } from "@/features/employees/employee-portal-bottom-nav"
import { employeesApi } from "@/features/employees/employees.functions"
import { generatePageTitle } from "@/lib/utils"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

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

  const { organization: store } = data

  return (
    <div className="py-20">
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
        <Outlet />
      </div>

      <EmployeePortalBottomNav />
    </div>
  )
}
