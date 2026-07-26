import { AppLogo } from "@/components/app-logo"
import { siteConfig } from "@/config/site"
import { EmployeeClockInForm } from "@/features/employees/employee-clock-in-form"
import { EmployeePortalForm } from "@/features/employees/employee-portal-form"
import { employeesApi } from "@/features/employees/employees.functions"
import { storeApi } from "@/features/store/store.functions"
import { generatePageTitle } from "@/lib/utils"
import {
  createFileRoute,
  notFound,
  redirect,
  useRouteContext,
} from "@tanstack/react-router"

export const Route = createFileRoute("/e/$storeSlug/")({
  component: RouteComponent,
  notFoundComponent: () => <div>Store not found</div>,
  beforeLoad: async (context) => {
    const employeeSession = await employeesApi.getSession()

    if (
      employeeSession.data?.attendanceId &&
      employeeSession.data?.employeeId
    ) {
      throw redirect({
        to: "/e/$storeSlug/$employeeId",
        params: {
          storeSlug: context.params.storeSlug,
          employeeId: employeeSession.data.employeeId,
        },
        replace: true,
      })
    }
  },
  loader: async ({ params }) => {
    const store = await storeApi.getBySlug({
      data: { slug: params.storeSlug },
    })

    if (!store.data) throw notFound()

    return store.data
  },
  head: ({ loaderData }) => ({
    meta: [{ title: generatePageTitle(loaderData?.name ?? "") }],
  }),
})

function RouteComponent() {
  const store = Route.useLoaderData()

  const { employee: employeeSession } = useRouteContext({
    from: "/e/$storeSlug/",
  })

  return (
    <>
      <div className="w-full text-left">
        <h1 className="text-2xl font-semibold">{store.name} Employee Portal</h1>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          Powered by{" "}
          <span className="inline-flex items-center gap-1">
            <AppLogo size={16} /> {siteConfig.title}
          </span>
        </p>
      </div>
      {employeeSession ? (
        <EmployeeClockInForm />
      ) : (
        <EmployeePortalForm storeId={store.id} />
      )}
    </>
  )
}
