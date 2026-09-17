import { AttendanceRequestStatus } from "@/generated/prisma/enums"
import { useLoaderData, useSearch } from "@tanstack/react-router"
import { useState } from "react"
import { countActiveRequestFilters } from "./request.utils"
import { RequestsMobileFilterSheet } from "./requests-mobile-filter-sheet"
import { RequestsMobileHeader } from "./requests-mobile-header"
import { RequestsMobileList } from "./requests-mobile-list"
import { RequestsMobileTabs } from "./requests-mobile-tabs"

export function RequestsMobileScreen() {
  const loaderData = useLoaderData({ from: "/_protected/requests" })
  const search = useSearch({ from: "/_protected/requests" })

  const [statusFilter, setStatusFilter] = useState<AttendanceRequestStatus>(
    AttendanceRequestStatus.PENDING
  )
  const [filterOpen, setFilterOpen] = useState(false)

  const activeFilterCount = countActiveRequestFilters(search)

  if (loaderData.requests.error) {
    return (
      <p className="px-4 text-sm text-muted-foreground">An error occured</p>
    )
  }

  const allRequests = loaderData.requests.data ?? []

  const pendingCount = allRequests.filter(
    (request) => request.status === AttendanceRequestStatus.PENDING
  ).length
  const approvedCount = allRequests.filter(
    (request) => request.status === AttendanceRequestStatus.APPROVED
  ).length
  const declinedCount = allRequests.filter(
    (request) => request.status === AttendanceRequestStatus.DECLINED
  ).length

  const filteredRequests = allRequests.filter(
    (request) => request.status === statusFilter
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-24">
      <RequestsMobileHeader
        activeFilterCount={activeFilterCount}
        onFilterClick={() => setFilterOpen(true)}
      />

      <RequestsMobileTabs
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        pendingCount={pendingCount}
        approvedCount={approvedCount}
        declinedCount={declinedCount}
      />

      <RequestsMobileList requests={filteredRequests} />

      <RequestsMobileFilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
      />
    </div>
  )
}
