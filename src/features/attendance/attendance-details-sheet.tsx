import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { AttendanceStatus } from "@/generated/prisma/enums"
import { formatDurationFromSeconds, formatPHP, formatTime } from "@/lib/utils"
import { formatDate } from "date-fns"
import { AttendanceStatusBadge } from "./attendance-status-badge"

interface AttendanceDetailsSheetProps {
  employee: {
    firstName: string
    lastName: string
    designation: { name: string }
  }
  attendance: {
    date: Date
    timeIn: Date | null
    timeOut: Date | null
    status: AttendanceStatus
    totalWorkedSeconds: number
    totalBreakSeconds: number
    totalPay: number | null
    branch: { name: string }
  }
}

export function AttendanceDetailsSheet({
  employee,
  attendance,
}: AttendanceDetailsSheetProps) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button type="button" variant="outline" size="sm">
            View timesheet
          </Button>
        }
      />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Attendance Details</SheetTitle>
          <SheetDescription>
            {formatDate(attendance.date, "EEEE, MMM dd, yyyy")}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold">
                {employee.firstName} {employee.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                {employee.designation.name} &middot; {attendance.branch.name}
              </p>
            </div>
            <AttendanceStatusBadge
              status={attendance.status}
              date={attendance.date}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-md border p-3">
            <div>
              <p className="text-xs text-muted-foreground">Time In</p>
              <p className="font-mono font-semibold">
                {attendance.timeIn ? formatTime(attendance.timeIn) : "--"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Time Out</p>
              <p className="font-mono font-semibold">
                {attendance.timeOut ? formatTime(attendance.timeOut) : "--"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 rounded-md border p-3">
            <div>
              <p className="text-xs text-muted-foreground">Worked</p>
              <p className="font-mono font-semibold">
                {formatDurationFromSeconds(attendance.totalWorkedSeconds)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Break</p>
              <p className="font-mono font-semibold">
                {formatDurationFromSeconds(attendance.totalBreakSeconds)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Earnings</p>
              <p className="font-mono font-semibold">
                {formatPHP(attendance.totalPay ?? 0)}
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
