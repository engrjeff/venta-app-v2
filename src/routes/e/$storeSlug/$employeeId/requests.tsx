import { createFileRoute } from "@tanstack/react-router"
import z from "zod"

import { RequestStatusSelect } from "@/features/requests/request-status-select"
import { RequestsList } from "@/features/requests/requests-list"
import { requestsApi } from "@/features/requests/requests.functions"
import { AttendanceRequestStatus } from "@/generated/prisma/enums"

const requestsSearchSchema = z.object({
  status: z.enum(AttendanceRequestStatus).optional(),
})

export const Route = createFileRoute("/e/$storeSlug/$employeeId/requests")({
  component: RouteComponent,
  validateSearch: requestsSearchSchema,
  loaderDeps: ({ search: { status } }) => ({ status }),
  loader: async ({ params, deps: { status } }) => {
    const requests = await requestsApi.getByEmployeeFn({
      data: { employeeId: params.employeeId, status },
    })

    return requests
  },
})

function RouteComponent() {
  const loaderData = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  if (loaderData.error) return <p>An error occured</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-bold">Requests</h2>
        <RequestStatusSelect
          value={search.status}
          onChange={(status) =>
            navigate({ search: (prev) => ({ ...prev, status }) })
          }
        />
      </div>

      <RequestsList requests={loaderData.data ?? []} />
    </div>
  )
}
