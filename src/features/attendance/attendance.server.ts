import type { Attendance } from "@/generated/prisma/client"
import { AttendanceStatus } from "@/generated/prisma/enums"
import { prisma } from "@/lib/db"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client"
import { useEmployeeSession } from "../employees/employee-session"
import type {
  ActiveAttendanceQueryInput,
  AttendanceTodayInput,
  AttendanceTransitionInput,
  EmployeeClockInInput,
} from "./schema"

export function getToday() {
  const today = new Date().toISOString().split("T")[0]
  return new Date(today)
}

// attendance
export async function submitClockInAttendance(
  clockInInputs: EmployeeClockInInput
) {
  try {
    // save the attendance record
    const { storeId, branchId, employeeId, timeIn, timeInLat, timeInLng } =
      clockInInputs

    const clockInDate = new Date(timeIn)

    const today = new Intl.DateTimeFormat("en-CA").format(new Date())

    const attendance = await prisma.attendance.create({
      data: {
        organizationId: storeId,
        branchId,
        employeeId,
        timeIn: clockInDate,
        timeInLatitude: timeInLat,
        timeInLongitude: timeInLng,
        date: new Date(today),
        workStartedAt: clockInDate,
      },
      include: {
        branch: { select: { name: true } },
      },
    })

    // update the employee session cookie with the clock-in data
    const employeeSession = await useEmployeeSession()

    await employeeSession.update({
      ...employeeSession.data,

      branchId,
      branchName: attendance.branch.name,

      attendanceId: attendance.id,
      timeInString: timeIn,
    })

    return { data: attendance, error: null }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        if (
          error.message.includes(
            'Unique constraint failed on the fields: (`"employeeId"`, `date`)'
          )
        ) {
          // check if there is a clock-in data in the employee session cookie
          const employeeSession = await useEmployeeSession()

          // if employee id is in cookie but no attendace data, update the employee session cookie with the clock-in data
          if (
            employeeSession.data?.employeeId &&
            !employeeSession?.data?.attendanceId
          ) {
            // get the attendance from db by employeedId-date
            const attendance = await prisma.attendance.findFirst({
              where: {
                employeeId: clockInInputs.employeeId,
                date: getToday(),
              },
              include: { branch: { select: { id: true, name: true } } },
            })

            if (!attendance) {
              return {
                data: null,
                error: new Error("You have already clocked-in for today."),
              }
            }

            // update the employee session cookie with the clock-in data
            await employeeSession.update({
              ...employeeSession.data,

              branchId: attendance.branchId,
              branchName: attendance.branch.name,

              attendanceId: attendance.id,
              timeInString: attendance.timeIn?.toISOString(),
            })

            return { data: attendance, error: null }
          }

          return {
            data: null,
            error: new Error("You have already clocked-in for today."),
          }
        }
      }
    }

    return { data: null, error: error as any }
  }
}

export async function getActiveAttendance(inputs: ActiveAttendanceQueryInput) {
  try {
    const attendance = await prisma.attendance.findUnique({
      where: {
        id: inputs.attendanceId,
        employeeId: inputs.employeeId,
      },
      include: {
        organization: true,
        branch: true,
        breaks: true,
        employee: {
          include: { designation: { select: { id: true, name: true } } },
        },
      },
    })

    return { data: attendance, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}

// ATTENDANCE TRANSITION
function secondsBetween(start: Date, end: Date) {
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 1000))
}

export function pauseAttendance(attendance: Attendance, at: Date): Attendance {
  if (attendance.status !== AttendanceStatus.WORKING) {
    throw new Error("Employee is not currently working.")
  }

  if (!attendance.workStartedAt) {
    throw new Error("Missing workStartedAt.")
  }

  return {
    ...attendance,

    status: AttendanceStatus.ON_BREAK,

    workStartedAt: null,
    breakStartedAt: at,

    totalWorkedSeconds:
      attendance.totalWorkedSeconds +
      secondsBetween(attendance.workStartedAt, at),
  }
}

export function resumeAttendance(attendance: Attendance, at: Date): Attendance {
  if (attendance.status !== AttendanceStatus.ON_BREAK) {
    throw new Error("Employee is not on break.")
  }

  if (!attendance.breakStartedAt) {
    throw new Error("Missing breakStartedAt.")
  }

  return {
    ...attendance,

    status: AttendanceStatus.WORKING,

    breakStartedAt: null,
    workStartedAt: at,

    totalBreakSeconds:
      attendance.totalBreakSeconds +
      secondsBetween(attendance.breakStartedAt, at),
  }
}

export function clockOutAttendance(
  attendance: Attendance,
  at: Date,
  lat: number,
  lng: number
): Attendance {
  if (attendance.status === AttendanceStatus.CLOCKED_OUT) {
    throw new Error("Employee already clocked out.")
  }

  if (
    attendance.status === AttendanceStatus.WORKING &&
    !attendance.workStartedAt
  ) {
    throw new Error("Missing workStartedAt.")
  }

  if (
    attendance.status === AttendanceStatus.ON_BREAK &&
    !attendance.breakStartedAt
  ) {
    throw new Error("Missing breakStartedAt.")
  }

  return {
    ...attendance,

    status: AttendanceStatus.CLOCKED_OUT,

    timeOut: at,

    workStartedAt: null,
    breakStartedAt: null,

    totalWorkedSeconds:
      attendance.totalWorkedSeconds +
      (attendance.status === AttendanceStatus.WORKING
        ? secondsBetween(attendance.workStartedAt!, at)
        : 0),

    totalBreakSeconds:
      attendance.totalBreakSeconds +
      (attendance.status === AttendanceStatus.ON_BREAK
        ? secondsBetween(attendance.breakStartedAt!, at)
        : 0),

    timeOutLatitude: lat,
    timeOutLongitude: lng,
  }
}

export function transitionAttendance(
  attendance: Attendance,
  input: AttendanceTransitionInput
) {
  switch (input.action) {
    case "pause":
      return pauseAttendance(attendance, new Date(input.at))

    case "resume":
      return resumeAttendance(attendance, new Date(input.at))

    case "clockOut":
      return clockOutAttendance(
        attendance,
        new Date(input.at),
        input.timeOutLatitude,
        input.timeOutLongitude
      )
  }
}

export async function submitAttendanceTransition(
  input: AttendanceTransitionInput
) {
  return prisma.$transaction(
    async (tx) => {
      const attendance = await tx.attendance.findUniqueOrThrow({
        where: {
          id: input.attendanceId,
        },
      })

      const next = transitionAttendance(attendance, input)

      await tx.attendance.update({
        where: {
          id: attendance.id,
        },
        data: next,
      })

      switch (input.action) {
        case "pause":
          await tx.attendanceBreak.create({
            data: {
              attendanceId: attendance.id,
              startedAt: input.at,
            },
          })
          break

        case "resume":
        case "clockOut":
          if (attendance.status === AttendanceStatus.ON_BREAK) {
            const activeBreak = await tx.attendanceBreak.findFirstOrThrow({
              where: {
                attendanceId: attendance.id,
                endedAt: null,
              },
              orderBy: {
                startedAt: "desc",
              },
            })

            await tx.attendanceBreak.update({
              where: {
                id: activeBreak.id,
              },
              data: {
                endedAt: input.at,
                durationSeconds: secondsBetween(
                  attendance.breakStartedAt!,
                  new Date(input.at)
                ),
              },
            })
          }
          break
      }

      return tx.attendance.findUniqueOrThrow({
        where: {
          id: attendance.id,
        },
      })
    },
    { maxWait: 5000, timeout: 10000 }
  )
}

export async function getAttendanceRecordsToday(input: AttendanceTodayInput) {
  try {
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        organizationId: input.storeId,
        date: getToday(),
      },
    })

    return { data: attendanceRecords, error: null }
  } catch (error) {
    console.log("Get Attendance Today Error: ", error)
    return { data: null, error: error as any }
  }
}
