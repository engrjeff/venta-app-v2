import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import type {
  Attendance,
  Branch,
  Designation,
  Employee,
} from "@/generated/prisma/browser"
import { AttendanceStatus } from "@/generated/prisma/enums"
import { formatTime } from "@/lib/utils"
import { useNavigate } from "@tanstack/react-router"
import { SearchIcon } from "lucide-react"
import { useState } from "react"

interface AttendanceRecord extends Attendance {
  branch: Pick<Branch, "id" | "name">
  employee: Pick<Employee, "id" | "firstName" | "lastName" | "username"> & {
    designation: Pick<Designation, "id" | "name">
  }
}

export function AttendanceTodayWidget({
  attendanceRecords,
}: {
  attendanceRecords: AttendanceRecord[]
}) {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState<AttendanceStatus>()

  const filteredRecords = statusFilter
    ? attendanceRecords.filter((a) => a.status === statusFilter)
    : attendanceRecords

  return (
    <Card size="sm" className="rounded-md">
      <CardHeader>
        <CardTitle>Today's Attendance</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="flex items-center gap-2 px-3 pb-3">
          <Button
            type="button"
            size="sm"
            variant={statusFilter === undefined ? "secondary" : "ghost"}
            className="text-xs"
            onClick={() => setStatusFilter(undefined)}
          >
            All
          </Button>
          <Button
            type="button"
            size="sm"
            variant={
              statusFilter === AttendanceStatus.WORKING ? "secondary" : "ghost"
            }
            className="text-xs"
            onClick={() => setStatusFilter(AttendanceStatus.WORKING)}
          >
            Working
          </Button>
          <Button
            type="button"
            size="sm"
            variant={
              statusFilter === AttendanceStatus.ON_BREAK ? "secondary" : "ghost"
            }
            className="text-xs"
            onClick={() => setStatusFilter(AttendanceStatus.ON_BREAK)}
          >
            On Break
          </Button>
          <Button
            type="button"
            size="sm"
            variant={
              statusFilter === AttendanceStatus.CLOCKED_OUT
                ? "secondary"
                : "ghost"
            }
            className="text-xs"
            onClick={() => setStatusFilter(AttendanceStatus.CLOCKED_OUT)}
          >
            Clocked Out
          </Button>
        </div>
        <Table>
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
            {filteredRecords.length === 0 ? (
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
              filteredRecords.map((attendance) => (
                <TableRow
                  key={attendance.id}
                  className="group cursor-pointer"
                  onClick={() =>
                    navigate({
                      to: "/timesheet/$employeeId",
                      params: { employeeId: attendance.employeeId },
                    })
                  }
                >
                  <TableCell>
                    <p className="font-semibold group-hover:underline">
                      {attendance.employee.lastName},{" "}
                      {attendance.employee.firstName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {attendance.employee.designation.name}
                    </p>
                  </TableCell>
                  <TableCell>{attendance.branch.name}</TableCell>
                  <TableCell>
                    <Badge variant={attendance.status}>
                      {attendance.status.replaceAll("_", " ").toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {attendance.timeIn && (
                      <p className="text-center font-mono">
                        {formatTime(attendance.timeIn)}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    {attendance.timeOut ? (
                      <p className="text-center font-mono">
                        {formatTime(attendance.timeOut)}
                      </p>
                    ) : (
                      <p className="text-center">--</p>
                    )}
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
