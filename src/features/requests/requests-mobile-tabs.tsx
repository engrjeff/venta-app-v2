import { FilterTabs } from "@/components/filter-tabs"
import { AttendanceRequestStatus } from "@/generated/prisma/enums"

export function RequestsMobileTabs({
  statusFilter,
  onStatusFilterChange,
  pendingCount,
  approvedCount,
  declinedCount,
}: {
  statusFilter: AttendanceRequestStatus
  onStatusFilterChange: (status: AttendanceRequestStatus) => void
  pendingCount: number
  approvedCount: number
  declinedCount: number
}) {
  return (
    <div className="px-4">
      <FilterTabs>
        <FilterTabs.Link
          active={statusFilter === AttendanceRequestStatus.PENDING}
          onClick={() => onStatusFilterChange(AttendanceRequestStatus.PENDING)}
        >
          Pending <FilterTabs.Badge>{pendingCount}</FilterTabs.Badge>
        </FilterTabs.Link>
        <FilterTabs.Link
          active={statusFilter === AttendanceRequestStatus.APPROVED}
          onClick={() => onStatusFilterChange(AttendanceRequestStatus.APPROVED)}
        >
          Approved <FilterTabs.Badge>{approvedCount}</FilterTabs.Badge>
        </FilterTabs.Link>
        <FilterTabs.Link
          active={statusFilter === AttendanceRequestStatus.DECLINED}
          onClick={() => onStatusFilterChange(AttendanceRequestStatus.DECLINED)}
        >
          Declined <FilterTabs.Badge>{declinedCount}</FilterTabs.Badge>
        </FilterTabs.Link>
      </FilterTabs>
    </div>
  )
}
