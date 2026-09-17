import { useMemo, useState } from "react"

import { FilterTabs } from "@/components/filter-tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AttendanceStatus } from "@/generated/prisma/enums"
import { formatTime, getInitials } from "@/lib/utils"
import { Link } from "@tanstack/react-router"
import type {
  AttendanceRecord,
  AttendanceRow,
  EmployeeRosterEntry,
} from "./dashboard.types"
import { buildRows } from "./dashboard.utils"

type MobileStatusFilter = "ALL" | "WORKING" | "ON_BREAK" | "OUT"

function isOut(row: AttendanceRow) {
  return (
    row.status !== AttendanceStatus.WORKING &&
    row.status !== AttendanceStatus.ON_BREAK
  )
}

function AttendanceStatusPill({ status }: { status: AttendanceRow["status"] }) {
  if (status === AttendanceStatus.WORKING) {
    return <Badge variant={AttendanceStatus.WORKING}>Working</Badge>
  }

  if (status === AttendanceStatus.ON_BREAK) {
    return <Badge variant={AttendanceStatus.ON_BREAK}>Break</Badge>
  }

  if (status === AttendanceStatus.CLOCKED_OUT) {
    return <Badge variant={AttendanceStatus.CLOCKED_OUT}>Done</Badge>
  }

  return <Badge variant="destructive">Absent</Badge>
}

export function AttendanceTodayMobileList({
  employees,
  attendanceRecords,
}: {
  employees: EmployeeRosterEntry[]
  attendanceRecords: AttendanceRecord[]
}) {
  const [filter, setFilter] = useState<MobileStatusFilter>("ALL")

  const rows = useMemo(
    () => buildRows(employees, attendanceRecords),
    [employees, attendanceRecords]
  )

  const workingCount = rows.filter(
    (row) => row.status === AttendanceStatus.WORKING
  ).length
  const onBreakCount = rows.filter(
    (row) => row.status === AttendanceStatus.ON_BREAK
  ).length
  const outCount = rows.filter(isOut).length

  const filteredRows =
    filter === "ALL"
      ? rows
      : filter === "WORKING"
        ? rows.filter((row) => row.status === AttendanceStatus.WORKING)
        : filter === "ON_BREAK"
          ? rows.filter((row) => row.status === AttendanceStatus.ON_BREAK)
          : rows.filter(isOut)

  return (
    <div className="flex flex-col gap-3 px-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Today's attendance</p>
        <Link to="/timesheet" className="text-xs text-blue-500">
          See all
        </Link>
      </div>

      <div className="overflow-x-auto">
        <FilterTabs>
          <FilterTabs.Link
            active={filter === "ALL"}
            onClick={() => setFilter("ALL")}
          >
            All <FilterTabs.Badge>{rows.length}</FilterTabs.Badge>
          </FilterTabs.Link>
          <FilterTabs.Link
            active={filter === "WORKING"}
            onClick={() => setFilter("WORKING")}
          >
            Working <FilterTabs.Badge>{workingCount}</FilterTabs.Badge>
          </FilterTabs.Link>
          <FilterTabs.Link
            active={filter === "ON_BREAK"}
            onClick={() => setFilter("ON_BREAK")}
          >
            Break <FilterTabs.Badge>{onBreakCount}</FilterTabs.Badge>
          </FilterTabs.Link>
          <FilterTabs.Link
            active={filter === "OUT"}
            onClick={() => setFilter("OUT")}
          >
            Out <FilterTabs.Badge>{outCount}</FilterTabs.Badge>
          </FilterTabs.Link>
        </FilterTabs>
      </div>

      <div className="flex flex-col gap-2">
        {filteredRows.map((row) => (
          <div
            key={row.key}
            className="flex items-center gap-3 rounded-md bg-card p-3 ring-1 ring-foreground/10"
          >
            <Avatar size="sm">
              <AvatarFallback className="text-xs font-semibold">
                {getInitials(row.employee.firstName, row.employee.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {row.employee.lastName}, {row.employee.firstName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {row.branch?.name ?? "--"} &middot;{" "}
                {row.timeIn ? `in ${formatTime(row.timeIn)}` : "no clock in"}
              </p>
            </div>
            <AttendanceStatusPill status={row.status} />
          </div>
        ))}
      </div>
    </div>
  )
}
