import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import type { Attendance, Branch } from "@/generated/prisma/browser"
import { AttendanceStatus } from "@/generated/prisma/enums"
import { LockIcon, LogOutIcon, PauseIcon, PlayIcon } from "lucide-react"
import { useState } from "react"
import { useAttendanceSession } from "./use-attendance-session"
import { useElapsedWorkTime } from "./use-elapsed-work-time"

import { SubmitButton } from "@/components/submit-button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function WorkHours({
  serverAttendance,
  branch,
}: {
  serverAttendance: Attendance
  branch: Branch
}) {
  const {
    id,
    status,
    timeIn,
    timeOut,
    workStartedAt,
    breakStartedAt,
    totalWorkedSeconds,
    totalBreakSeconds,
  } = serverAttendance

  const attendanceInput = {
    id,
    status,
    timeIn: timeIn ? timeIn.toISOString() : null,
    timeOut: timeOut ? timeOut.toISOString() : null,
    workStartedAt: workStartedAt ? workStartedAt.toISOString() : null,
    breakStartedAt: breakStartedAt ? breakStartedAt.toISOString() : null,
    totalWorkedSeconds,
    totalBreakSeconds,
  }

  const session = useAttendanceSession({
    attendance: attendanceInput,
  })

  const timer = useElapsedWorkTime({
    attendance: attendanceInput,
  })

  const [action, setAction] = useState<"PAUSE" | "RESUME" | "CLOCK_OUT">()

  async function handePause() {
    if (action !== "PAUSE") return

    await session.pause()

    setAction(undefined)
  }

  async function handeResume() {
    if (action !== "RESUME") return

    await session.resume()

    setAction(undefined)
  }

  async function handeClockOut() {
    if (action !== "CLOCK_OUT") return

    await session.clockOut(
      { latitude: branch.latitude, longitude: branch.longitude },
      branch.attendanceRadius
    )

    setAction(undefined)
  }

  return (
    <>
      <div className="space-y-4 rounded-md border bg-card p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Work Hours</span>
            <div className="font-mono text-4xl font-semibold">
              {timer.formatted}
            </div>
            <p className="text-xs text-muted-foreground">
              Clocked In:{" "}
              <span className="font-mono">{session.clockInString}</span>
            </p>
          </div>

          <div>
            {serverAttendance.status === AttendanceStatus.WORKING && (
              <Badge>Working</Badge>
            )}
            {serverAttendance.status === AttendanceStatus.ON_BREAK && (
              <Badge variant="secondary">On Break</Badge>
            )}
            {serverAttendance.status === AttendanceStatus.CLOCKED_OUT && (
              <Badge variant="outline">Clocked Out</Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {serverAttendance.status === AttendanceStatus.WORKING && (
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={() => setAction("PAUSE")}
              disabled={session.saving}
            >
              {session.saving ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <PauseIcon />
              )}
              Pause
            </Button>
          )}
          {serverAttendance.status === AttendanceStatus.ON_BREAK && (
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="flex-1"
              onClick={() => setAction("RESUME")}
              disabled={session.saving}
            >
              {session.saving ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <PlayIcon />
              )}
              Resume
            </Button>
          )}
          {serverAttendance.status === AttendanceStatus.CLOCKED_OUT ? (
            <Button
              type="button"
              size="lg"
              variant="outline"
              disabled
              className="flex-1"
            >
              <LockIcon />
              Shift Ended
            </Button>
          ) : (
            <Button
              type="button"
              size="lg"
              className="flex-1"
              onClick={() => setAction("CLOCK_OUT")}
              disabled={session.saving || session.savingClockout}
            >
              {session.savingClockout ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <LogOutIcon />
              )}
              Clock Out
            </Button>
          )}
        </div>
      </div>

      {/* dialogs */}

      {/* pause dialog */}
      <AlertDialog
        open={action === "PAUSE"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setAction(undefined)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will pause your work hours and start your break time. You can
              still resume later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <SubmitButton
              type="button"
              onClick={handePause}
              loading={session.saving}
            >
              Start Break
            </SubmitButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* resume dialog */}
      <AlertDialog
        open={action === "RESUME"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setAction(undefined)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will resume your work hours. You can still start a break
              later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <SubmitButton
              type="button"
              onClick={handeResume}
              loading={session.saving}
            >
              Resume Work
            </SubmitButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* clock out dialog */}
      <AlertDialog
        open={action === "CLOCK_OUT"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setAction(undefined)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clock you out for the day.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <SubmitButton
              type="button"
              onClick={handeClockOut}
              loading={session.saving}
            >
              Clock Out
            </SubmitButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
