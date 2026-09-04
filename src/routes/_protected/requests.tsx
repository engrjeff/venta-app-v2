import { createFileRoute } from "@tanstack/react-router"
import { FileTextIcon } from "lucide-react"
import z from "zod"

import { employeesApi } from "@/features/employees/employees.functions"
import { RequestActions } from "@/features/requests/request-actions"
import { RequestStatusSelect } from "@/features/requests/request-status-select"
import { RequestsList } from "@/features/requests/requests-list"
import { RequestsTable } from "@/features/requests/requests-table"
import { requestsApi } from "@/features/requests/requests.functions"
import { AttendanceRequestStatus } from "@/generated/prisma/enums"
import { generatePageTitle } from "@/lib/utils"

const requestsSearchSchema = z.object({
  status: z
    .object({
      operator: z.enum(["is", "is_not"]),
      value: z.array(z.enum(AttendanceRequestStatus)),
    })
    .optional(),
  employees: z
    .object({
      operator: z.enum(["is", "is_not"]),
      value: z.array(z.string()),
    })
    .optional(),
})

export const Route = createFileRoute("/_protected/requests")({
  head: () => ({
    meta: [{ title: generatePageTitle("Requests") }],
  }),
  validateSearch: requestsSearchSchema,
  loaderDeps: ({ search: { status, employees } }) => ({ status, employees }),
  loader: async ({ context, deps: { status, employees } }) => {
    const [requests, employeeList] = await Promise.all([
      requestsApi.getByStoreFn({
        data: { storeId: context.activeStoreId, status, employees },
      }),
      employeesApi.getAll({ data: { storeId: context.activeStoreId } }),
    ])

    return { requests, employees: employeeList.data ?? [] }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const loaderData = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  if (loaderData.requests.error) return <p>An error occured</p>

  const requests = loaderData.requests.data ?? []

  return (
    <div className="flex h-full flex-col space-y-4 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileTextIcon className="size-4" />
          <h1 className="font-semibold">Requests</h1>
        </div>
        <div className="lg:hidden">
          <RequestStatusSelect
            value={search.status?.value[0]}
            onChange={(status) =>
              navigate({
                search: (prev) => ({
                  ...prev,
                  status: status
                    ? { operator: "is", value: [status] }
                    : undefined,
                }),
              })
            }
          />
        </div>
      </div>

      <div className="lg:hidden">
        <RequestsList
          requests={requests}
          showEmployee
          renderActions={(request) => <RequestActions request={request} />}
        />
      </div>

      <RequestsTable requests={requests} employees={loaderData.employees} />
    </div>
  )
}
