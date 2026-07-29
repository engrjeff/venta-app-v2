import { type Attendance } from "@/generated/prisma/client"
import { AttendanceStatus } from "@/generated/prisma/enums"
import { prisma } from "@/lib/db"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client"
import slugify from "slugify"
import { useEmployeeSession } from "./employee-session"
import type {
  ActiveAttendanceQueryInput,
  AttendanceTransitionInput,
  CreateManyEmployeeInput,
  EmployeeClockInInput,
  VerifyUsernameInput,
} from "./schema"

function generateEmployeeNumber(storeName: string, username: string) {
  return `${slugify(storeName.toUpperCase(), { trim: true })}-${slugify(username.toUpperCase(), { trim: true })}`
}

export async function createEmployees(
  employeesArrayInput: CreateManyEmployeeInput
) {
  try {
    const employees = await prisma.$transaction(async (tx) => {
      return Promise.all(
        employeesArrayInput.employees.map(
          async ({ branchId, designationId, ...employee }) => {
            return tx.employee.create({
              data: {
                firstName: employee.firstName,
                lastName: employee.lastName,
                username: employee.username,
                email: employee.email,
                phone: employee.phone,
                organizationId: employeesArrayInput.storeId,
                designationId,
                employeeNumber: generateEmployeeNumber(
                  employeesArrayInput.storeName,
                  employee.username
                ),
                branches: {
                  create: [{ branchId }],
                },
              },
            })
          }
        )
      )
    })

    return { data: employees, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}

export async function getEmployee(id: string) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        organization: { select: { name: true } },
        designation: { select: { name: true } },
        branches: {
          select: {
            branch: {
              select: {
                id: true,
                name: true,
                address: true,
                latitude: true,
                longitude: true,
                attendanceRadius: true,
                gmFormattedAddress: true,
              },
            },
          },
        },
      },
    })

    return { data: employee, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}

export async function createEmployeeSession(input: VerifyUsernameInput) {
  try {
    const foundEmployee = await prisma.employee.findFirst({
      where: {
        organizationId: input.storeId,
        username: input.username,
      },
    })

    if (!foundEmployee) {
      return { data: null, error: { message: "Employee not found" } }
    }

    // create session
    const employeeSession = await useEmployeeSession()

    await employeeSession.update({
      employeeId: foundEmployee.id,
      employeeUsername: foundEmployee.username,
      employeeFirstName: foundEmployee.firstName,
      employeeLastName: foundEmployee.lastName,
      storeId: foundEmployee.organizationId,
    })

    return { data: { success: true }, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}

export async function getEmployeeSession() {
  try {
    const employeeSession = await useEmployeeSession()
    const employeeId = employeeSession.data.employeeId

    if (!employeeId) {
      await employeeSession.clear()
      return { data: null, error: { message: "No employee session" } }
    }

    return { data: employeeSession.data, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}

export async function clearEmployeeSession() {
  try {
    const employeeSession = await useEmployeeSession()

    await employeeSession.clear()

    return { data: { success: true }, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
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

    const today = new Date().toISOString().split("T")[0]

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
            const today = new Date().toISOString().split("T")[0]

            const attendance = await prisma.attendance.findFirst({
              where: {
                employeeId: clockInInputs.employeeId,
                date: new Date(today),
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
  return prisma.$transaction(async (tx) => {
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
  })
}
