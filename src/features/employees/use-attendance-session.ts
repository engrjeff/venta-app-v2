import { AttendanceStatus } from "@/generated/prisma/enums"
import { performGeofenceCheck, type Coordinates } from "@/lib/geo-fencing"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { formatDate } from "date-fns"
import { useCallback, useMemo, useState } from "react"
import { toast } from "sonner"
import { employeesApi } from "./employees.functions"

export interface Attendance {
  id: string

  timeIn: string | null
  timeOut: string | null

  status: AttendanceStatus

  workStartedAt: string | null
  breakStartedAt: string | null

  totalWorkedSeconds: number
  totalBreakSeconds: number
}

interface UseAttendanceSessionOptions {
  attendance: Attendance
}

export function useAttendanceSession({
  attendance: serverAttendance,
}: UseAttendanceSessionOptions) {
  const transitionAttendance = useServerFn(employeesApi.transitionAttendance)

  const router = useRouter()

  const [optimisticAttendance, setOptimisticAttendance] =
    useState<Attendance | null>(null)

  const [saving, setSaving] = useState(false)

  const [savingClockout, setSavingClockout] = useState(false)

  const attendance = useMemo(
    () => optimisticAttendance ?? serverAttendance,
    [optimisticAttendance, serverAttendance]
  )

  const clockInString = serverAttendance.timeIn
    ? formatDate(new Date(serverAttendance.timeIn), "hh:mm aa")
    : ""

  const pause = useCallback(async () => {
    if (saving || attendance.status !== AttendanceStatus.WORKING) {
      return
    }

    const now = new Date().toISOString()

    setSaving(true)

    setOptimisticAttendance({
      ...attendance,
      status: AttendanceStatus.ON_BREAK,
      workStartedAt: null,
      breakStartedAt: now,
    })

    try {
      const result = await transitionAttendance({
        data: { action: "pause", attendanceId: serverAttendance.id, at: now },
      })
      if (result.id) {
        toast.success("Saved!")
      }
      await router.invalidate()
    } catch (error) {
      let msg = "Server Error"

      if (error instanceof Error) {
        msg = error.message
      }

      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }, [attendance, saving])

  const resume = useCallback(async () => {
    if (saving || attendance.status !== AttendanceStatus.ON_BREAK) {
      return
    }

    const now = new Date().toISOString()

    setSaving(true)

    setOptimisticAttendance({
      ...attendance,
      status: AttendanceStatus.WORKING,
      workStartedAt: now,
      breakStartedAt: null,
    })

    try {
      const result = await transitionAttendance({
        data: { action: "resume", attendanceId: serverAttendance.id, at: now },
      })

      if (result.id) {
        toast.success("Saved!")
      }

      await router.invalidate()
    } catch (error) {
      let msg = "Server Error"

      if (error instanceof Error) {
        msg = error.message
      }

      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }, [attendance, saving])

  const clockOut = useCallback(
    async (center: Coordinates, radius: number) => {
      if (saving || attendance.status === AttendanceStatus.CLOCKED_OUT) {
        return
      }

      const now = new Date().toISOString()

      setSavingClockout(true)

      setOptimisticAttendance({
        ...attendance,
        status: AttendanceStatus.CLOCKED_OUT,
        workStartedAt: null,
        timeOut: now,
      })

      try {
        // should not be able to clock out if not within radius
        const geo = await performGeofenceCheck(center, radius)

        if (!geo.canClockIn) {
          toast.error(
            "Make sure you are within store vicinity. Cannot clock out."
          )
          return
        }

        const result = await transitionAttendance({
          data: {
            action: "clockOut",
            attendanceId: serverAttendance.id,
            at: now,
            timeOutLatitude: geo.current.location.latitude,
            timeOutLongitude: geo.current.location.longitude,
          },
        })

        if (result.id) {
          toast.success("Saved!")
        }

        await router.invalidate()
      } catch (error) {
        let msg = "Server Error"

        if (error instanceof Error) {
          msg = error.message
        }

        toast.error(msg)
      } finally {
        setSavingClockout(false)
      }
    },
    [attendance, saving, savingClockout]
  )

  return {
    attendance,

    saving,
    savingClockout,

    pause,
    resume,
    clockOut,

    isWorking: attendance.status === AttendanceStatus.WORKING,
    isOnBreak: attendance.status === AttendanceStatus.ON_BREAK,
    isClockedOut: attendance.status === AttendanceStatus.CLOCKED_OUT,

    clockInString,
  }
}
