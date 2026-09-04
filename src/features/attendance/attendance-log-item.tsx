import { formatDate, isToday } from "date-fns"
import { FileTextIcon, MoreHorizontalIcon } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AttendanceRequestStatus,
  AttendanceStatus,
} from "@/generated/prisma/enums"
import { formatDurationFromSeconds, formatPHP, formatTime } from "@/lib/utils"
import { CreateRequestDialog } from "../requests/create-request-dialog"
import { ATTENDANCE_REQUEST_STATUS_LABELS } from "../requests/request-labels"
import type { AttendanceHistoryItem } from "./attendance.types"

interface AttendanceLogItemProps {
  log: AttendanceHistoryItem
  employeeId: string
}

export function AttendanceLogItem({ log, employeeId }: AttendanceLogItemProps) {
  const [createRequestOpen, setCreateRequestOpen] = useState(false)

  const latestRequest = log.requests[0]

  const isEligibleForRequest = !log.timeOut && log.timeIn && !isToday(log.date)

  const canCreateRequest =
    isEligibleForRequest &&
    (!latestRequest ||
      latestRequest.status === AttendanceRequestStatus.DECLINED ||
      latestRequest.status === AttendanceRequestStatus.CANCELLED)

  return (
    <div className="group relative space-y-0.5 rounded-md bg-card p-3 text-sm shadow">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              aria-label="Log actions"
              variant="ghost"
              size="icon-xs"
              className="absolute top-0.5 right-0.5"
              disabled={Boolean(isEligibleForRequest) === false}
            >
              <MoreHorizontalIcon />
            </Button>
          }
        />
        <DropdownMenuContent className="min-w-max" side="left">
          <DropdownMenuGroup>
            <DropdownMenuItem
              disabled={!canCreateRequest}
              onClick={() => setCreateRequestOpen(true)}
            >
              <FileTextIcon /> Create Request
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex items-center gap-2 pr-6">
        <p className="font-medium">{formatDate(log.date, "MMM dd, yyy")}</p>
        {latestRequest && (
          <Badge className="p-1.5" variant={latestRequest.status}>
            {ATTENDANCE_REQUEST_STATUS_LABELS[latestRequest.status]}
          </Badge>
        )}
      </div>
      <div className="flex items-center justify-between">
        {log.timeIn &&
          log.timeOut &&
          log.status === AttendanceStatus.CLOCKED_OUT && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{formatTime(log.timeIn)}</span>
              <span>-</span>
              <span>{formatTime(log.timeOut)}</span>
            </p>
          )}
        {!log.timeOut && log.timeIn && !isToday(log.date) && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{formatTime(log.timeIn)}</span>
            <span>-</span>
            <span className="text-destructive">Not clocked out</span>
          </p>
        )}
        {!log.timeOut && log.timeIn && isToday(log.date) && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{formatTime(log.timeIn)}</span>
            <span>-</span>
            <span className="text-emerald-500">Working</span>
          </p>
        )}
        <p className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          Work:
          <span className="font-mono">
            {formatDurationFromSeconds(log.totalWorkedSeconds)} /
          </span>
          <span className="font-mono font-medium text-emerald-500">
            {formatPHP(log.regularPay ?? 0)}
          </span>
        </p>
      </div>

      <CreateRequestDialog
        attendanceId={log.id}
        employeeId={employeeId}
        open={createRequestOpen}
        onOpenChange={setCreateRequestOpen}
      />
    </div>
  )
}
