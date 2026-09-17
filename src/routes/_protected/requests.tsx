import { createFileRoute } from "@tanstack/react-router"
import { InboxIcon } from "lucide-react"
import { useState } from "react"

import { FilterTabs } from "@/components/filter-tabs"
import { PageHeader } from "@/components/page-header"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty"
import { employeesApi } from "@/features/employees/employees.functions"
import { RequestCard } from "@/features/requests/request-card"
import { RequestsFilters } from "@/features/requests/requests-filters"
import { RequestsMobileScreen } from "@/features/requests/requests-mobile-screen"
import { attendanceRequestsByStoreSchema } from "@/features/requests/schema"
import { requestsApi } from "@/features/requests/requests.functions"
import { storeApi } from "@/features/store/store.functions"
import { AttendanceRequestStatus } from "@/generated/prisma/enums"
import { generatePageTitle } from "@/lib/utils"

export const Route = createFileRoute("/_protected/requests")({
  head: () => ({
    meta: [{ title: generatePageTitle("Requests") }],
  }),
  validateSearch: attendanceRequestsByStoreSchema.omit({
    storeId: true,
    status: true,
  }),
  loaderDeps: ({ search: { employees, branches, type, start, end } }) => ({
    employees,
    branches,
    type,
    start,
    end,
  }),
  loader: async ({
    context,
    deps: { employees, branches, type, start, end },
  }) => {
    const [requests, employeeList, storeOptions] = await Promise.all([
      requestsApi.getByStoreFn({
        data: {
          storeId: context.activeStoreId,
          employees,
          branches,
          type,
          start,
          end,
        },
      }),
      employeesApi.getAll({ data: { storeId: context.activeStoreId } }),
      storeApi.getFieldOptions({ data: { id: context.activeStoreId } }),
    ])

    return {
      requests,
      employees: employeeList.data ?? [],
      branches: storeOptions.data?.branches ?? [],
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const loaderData = Route.useLoaderData()

  const [statusFilter, setStatusFilter] = useState<
    AttendanceRequestStatus | undefined
  >(AttendanceRequestStatus.PENDING)

  if (loaderData.requests.error) return <p>An error occured</p>

  const allRequests = loaderData.requests.data ?? []

  const pendingCount = allRequests.filter(
    (request) => request.status === AttendanceRequestStatus.PENDING
  ).length

  const filteredRequests = allRequests.filter(
    (request) => !statusFilter || request.status === statusFilter
  )

  return (
    <>
      {/* desktop page header */}
      <PageHeader className="hidden md:flex">
        <PageHeader.Heading>
          <PageHeader.Title>Requests</PageHeader.Title>
        </PageHeader.Heading>
        <PageHeader.Actions>
          <FilterTabs>
            <FilterTabs.Link
              active={statusFilter === AttendanceRequestStatus.PENDING}
              onClick={() => setStatusFilter(AttendanceRequestStatus.PENDING)}
            >
              Pending <FilterTabs.Badge>{pendingCount}</FilterTabs.Badge>
            </FilterTabs.Link>
            <FilterTabs.Link
              active={statusFilter === AttendanceRequestStatus.APPROVED}
              onClick={() => setStatusFilter(AttendanceRequestStatus.APPROVED)}
            >
              Approved
            </FilterTabs.Link>
            <FilterTabs.Link
              active={statusFilter === AttendanceRequestStatus.DECLINED}
              onClick={() => setStatusFilter(AttendanceRequestStatus.DECLINED)}
            >
              Declined
            </FilterTabs.Link>
            <FilterTabs.Link
              active={statusFilter === undefined}
              onClick={() => setStatusFilter(undefined)}
            >
              All
            </FilterTabs.Link>
          </FilterTabs>
        </PageHeader.Actions>
      </PageHeader>
      <div className="hidden min-h-0 flex-1 flex-col gap-4 pb-4 md:flex">
        {/* requests filters */}
        <RequestsFilters />
        {/* requests list */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6">
          {filteredRequests.length === 0 ? (
            <Empty className="h-full flex-1 border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <InboxIcon />
                </EmptyMedia>
                <EmptyDescription>No requests to show</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="space-y-3">
              {filteredRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* mobile screen */}
      <div className="min-h-0 flex-1 overflow-y-auto md:hidden">
        <RequestsMobileScreen />
      </div>
    </>
  )
}
