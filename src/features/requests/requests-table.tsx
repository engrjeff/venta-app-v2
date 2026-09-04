import { useNavigate, useSearch } from "@tanstack/react-router"
import { formatDate } from "date-fns"
import { SearchIcon } from "lucide-react"

import type { FilterField } from "@/components/filter-builder/filter-builder"
import {
  FilterBuilder,
  queryToFilterRules,
  rulesToQuery,
} from "@/components/filter-builder/filter-builder"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AttendanceRequestStatus,
  AttendanceRequestType,
} from "@/generated/prisma/enums"
import { formatTimeOfDay } from "@/lib/utils"
import {
  ATTENDANCE_REQUEST_STATUS_LABELS,
  ATTENDANCE_REQUEST_TYPE_LABELS,
} from "./request-labels"
import { RequestActions } from "./request-actions"
import type { AttendanceRequestWithRelations } from "./request.types"

interface RequestEmployeeOption {
  id: string
  firstName: string
  lastName: string
}

export function RequestsTable({
  requests,
  employees,
}: {
  requests: AttendanceRequestWithRelations[]
  employees: RequestEmployeeOption[]
}) {
  const search = useSearch({ from: "/_protected/requests" })
  const navigate = useNavigate({ from: "/requests" })

  const statusFilter: FilterField = {
    id: "status",
    label: "Status",
    type: "select",
    options: Object.values(AttendanceRequestStatus).map((status) => ({
      value: status,
      label: ATTENDANCE_REQUEST_STATUS_LABELS[status],
    })),
  }

  const employeeFilter: FilterField = {
    id: "employees",
    label: "Employee",
    type: "select",
    options: employees.map((employee) => ({
      value: employee.id,
      label: `${employee.firstName} ${employee.lastName}`,
    })),
  }

  const filterFields = [statusFilter, employeeFilter]

  const activeFilters = queryToFilterRules(
    { status: search.status, employees: search.employees },
    filterFields
  )

  return (
    <Card size="sm" className="hidden h-full flex-1 rounded-md pb-0 lg:flex">
      <CardHeader>
        <FilterBuilder
          fields={filterFields}
          value={activeFilters}
          onApply={(filterRules) =>
            navigate({ search: () => rulesToQuery(filterRules) as any })
          }
          onChange={(filterRules) =>
            navigate({ search: () => rulesToQuery(filterRules) as any })
          }
        />
      </CardHeader>
      <CardContent className="flex-1 px-0">
        <Table className="h-full border-t">
          <TableHeader className="font-semibold">
            <TableRow className="bg-muted/50">
              <TableHead>Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Attendance Date</TableHead>
              <TableHead>Requested Clock-Out</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!requests.length ? (
              <TableRow className="pointer-events-none">
                <TableCell colSpan={8}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon" className="size-4">
                        <SearchIcon size={16} className="size-4" />
                      </EmptyMedia>
                      <EmptyDescription>No requests to show</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id} className="hover:bg-transparent">
                  <TableCell>
                    {request.employee.firstName} {request.employee.lastName}
                  </TableCell>
                  <TableCell>
                    {ATTENDANCE_REQUEST_TYPE_LABELS[request.type]}
                  </TableCell>
                  <TableCell className="max-w-64 truncate">
                    {request.reason}
                  </TableCell>
                  <TableCell>
                    {formatDate(request.attendance.date, "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    {request.type ===
                      AttendanceRequestType.FORGOT_TO_CLOCK_OUT &&
                    request.clockOutTime
                      ? formatTimeOfDay(request.clockOutTime)
                      : "--"}
                  </TableCell>
                  <TableCell>
                    {formatDate(request.createdAt, "MMM dd, yyyy hh:mm a")}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={request.status}>
                      {ATTENDANCE_REQUEST_STATUS_LABELS[request.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <RequestActions request={request} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
