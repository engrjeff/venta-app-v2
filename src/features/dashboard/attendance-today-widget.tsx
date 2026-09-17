import { FilterTabs } from "@/components/filter-tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { AttendanceStatusBadge } from "@/features/attendance/attendance-status-badge"
import { AttendanceStatus } from "@/generated/prisma/enums"
import { formatTime, getInitials } from "@/lib/utils"
import { Link, useNavigate } from "@tanstack/react-router"
import { MoveUpRightIcon, SearchIcon } from "lucide-react"
import { useMemo, useState } from "react"
import type {
  AttendanceRecord,
  AttendanceStatusFilter,
  EmployeeRosterEntry,
} from "./dashboard.types"
import { buildRows } from "./dashboard.utils"

export function AttendanceTodayWidget({
  employees,
  attendanceRecords,
  scheduledCount,
}: {
  employees: EmployeeRosterEntry[]
  attendanceRecords: AttendanceRecord[]
  scheduledCount: number
}) {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<AttendanceStatusFilter>()

  const rows = useMemo(
    () => buildRows(employees, attendanceRecords),
    [employees, attendanceRecords]
  )

  const filteredRows =
    statusFilter === undefined
      ? rows
      : statusFilter === "NOT_CLOCKED_IN"
        ? rows.filter((row) => row.status === undefined)
        : rows.filter((row) => row.status === statusFilter)

  return (
    <Card size="sm" className="rounded-md">
      <CardHeader>
        <CardTitle>Today's Attendance</CardTitle>
        <CardDescription className="text-xs">
          {scheduledCount} employees scheduled today
        </CardDescription>
        <CardAction>
          <FilterTabs>
            <FilterTabs.Link
              active={statusFilter === undefined}
              onClick={() => setStatusFilter(undefined)}
            >
              All
            </FilterTabs.Link>
            <FilterTabs.Link
              active={statusFilter === AttendanceStatus.WORKING}
              onClick={() => setStatusFilter(AttendanceStatus.WORKING)}
            >
              Working
            </FilterTabs.Link>
            <FilterTabs.Link
              active={statusFilter === AttendanceStatus.ON_BREAK}
              onClick={() => setStatusFilter(AttendanceStatus.ON_BREAK)}
            >
              On Break
            </FilterTabs.Link>
            <FilterTabs.Link
              active={statusFilter === AttendanceStatus.CLOCKED_OUT}
              onClick={() => setStatusFilter(AttendanceStatus.CLOCKED_OUT)}
            >
              Clocked Out
            </FilterTabs.Link>
            <FilterTabs.Link
              active={statusFilter === "NOT_CLOCKED_IN"}
              onClick={() => setStatusFilter("NOT_CLOCKED_IN")}
            >
              Not Clocked In
            </FilterTabs.Link>
          </FilterTabs>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <Table className="border-b">
          <TableHeader>
            <TableRow className="border-t bg-muted/50 font-semibold">
              <TableHead>Employee</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Time In</TableHead>
              <TableHead className="text-center">Time Out</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.length === 0 ? (
              <TableRow className="pointer-events-none">
                <TableCell colSpan={5}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon" className="size-4">
                        <SearchIcon size={16} className="size-4" />
                      </EmptyMedia>
                      <EmptyDescription>No records to show</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row) => {
                const hasAttendance = row.status !== undefined

                return (
                  <TableRow
                    key={row.key}
                    className="group cursor-pointer"
                    onClick={
                      hasAttendance
                        ? () =>
                            navigate({
                              to: "/timesheet",
                              search: {
                                employees: {
                                  operator: "is",
                                  value: [row.employeeId],
                                },
                              },
                            })
                        : undefined
                    }
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar size="sm">
                          <AvatarFallback className="text-xs font-semibold">
                            {getInitials(
                              row.employee.firstName,
                              row.employee.lastName
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p
                            className={
                              hasAttendance
                                ? "text-xs font-semibold group-hover:underline"
                                : "text-xs font-semibold"
                            }
                          >
                            {row.employee.lastName}, {row.employee.firstName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {row.employee.designation.name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.branch?.name ?? "--"}
                    </TableCell>
                    <TableCell>
                      <AttendanceStatusBadge status={row.status} />
                    </TableCell>
                    <TableCell>
                      {row.timeIn && (
                        <p className="text-center font-mono">
                          {formatTime(row.timeIn)}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      {row.timeOut ? (
                        <p className="text-center font-mono">
                          {formatTime(row.timeOut)}
                        </p>
                      ) : (
                        <p className="text-center">--</p>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="justify-end px-0">
        <Button
          nativeButton={false}
          size="xs"
          variant="link"
          className="text-blue-500"
          render={
            <Link to="/timesheet">
              View Timesheet <MoveUpRightIcon />
            </Link>
          }
        />
      </CardFooter>
    </Card>
  )
}
