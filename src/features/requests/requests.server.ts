import { clockOutAttendance } from "../attendance/attendance.server"
import {
  combineDateAndTime,
  secondsBetween,
} from "../attendance/attendance.utils"
import {
  AttendanceRequestStatus,
  AttendanceRequestType,
  AttendanceStatus,
} from "@/generated/prisma/enums"
import { prisma } from "@/lib/db"
import type {
  AttendanceRequestIdInput,
  AttendanceRequestsByEmployeeInput,
  AttendanceRequestsByStoreInput,
  CreateAttendanceRequestInput,
} from "./schema"

const requestInclude = {
  employee: { select: { id: true, firstName: true, lastName: true } },
  attendance: { select: { date: true, timeIn: true, timeOut: true } },
} as const

export async function createAttendanceRequest(
  input: CreateAttendanceRequestInput
) {
  try {
    const attendance = await prisma.attendance.findUniqueOrThrow({
      where: { id: input.attendanceId },
    })

    const existing = await prisma.attendanceRequest.findFirst({
      where: {
        attendanceId: input.attendanceId,
        status: {
          in: [
            AttendanceRequestStatus.PENDING,
            AttendanceRequestStatus.APPROVED,
          ],
        },
      },
    })

    if (existing) {
      return {
        data: null,
        error: new Error(
          "A request for this attendance record already exists."
        ),
      }
    }

    const request = await prisma.attendanceRequest.create({
      data: {
        organizationId: attendance.organizationId,
        employeeId: input.employeeId,
        attendanceId: input.attendanceId,
        type: input.type,
        reason: input.reason,
        clockOutTime: input.clockOutTime
          ? new Date(`1970-01-01T${input.clockOutTime}:00Z`)
          : undefined,
      },
      include: requestInclude,
    })

    return { data: request, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}

export async function getAttendanceRequestsByEmployee(
  input: AttendanceRequestsByEmployeeInput
) {
  try {
    const requests = await prisma.attendanceRequest.findMany({
      where: {
        employeeId: input.employeeId,
        status: input.status,
      },
      include: requestInclude,
      orderBy: { createdAt: "desc" },
    })

    return { data: requests, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}

export async function getAttendanceRequestsByStore(
  input: AttendanceRequestsByStoreInput
) {
  try {
    const requests = await prisma.attendanceRequest.findMany({
      where: {
        organizationId: input.storeId,
        status: input.status
          ? input.status.operator === "is"
            ? { in: input.status.value }
            : { notIn: input.status.value }
          : undefined,
        employeeId: input.employees
          ? input.employees.operator === "is"
            ? { in: input.employees.value }
            : { notIn: input.employees.value }
          : undefined,
      },
      include: requestInclude,
      orderBy: { createdAt: "desc" },
    })

    return { data: requests, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}

export async function approveAttendanceRequest(
  input: AttendanceRequestIdInput
) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const request = await tx.attendanceRequest.findUniqueOrThrow({
        where: { id: input.id },
        include: {
          attendance: { include: { attendanceSnapshot: true } },
        },
      })

      if (request.status !== AttendanceRequestStatus.PENDING) {
        throw new Error("This request has already been reviewed.")
      }

      const { attendanceSnapshot: snapshot, ...attendance } = request.attendance

      if (request.type === AttendanceRequestType.FORGOT_TO_CLOCK_OUT) {
        if (attendance.status === AttendanceStatus.CLOCKED_OUT) {
          throw new Error(
            "Employee has already clocked out for this attendance record."
          )
        }

        if (!snapshot) {
          throw new Error("Attendance snapshot is missing.")
        }

        if (!request.clockOutTime) {
          throw new Error("This request is missing a requested clock-out time.")
        }

        if (
          attendance.timeInLatitude == null ||
          attendance.timeInLongitude == null
        ) {
          throw new Error(
            "Missing clock-in location for this attendance record."
          )
        }

        const clockOutAt = combineDateAndTime(
          attendance.date,
          request.clockOutTime
        )

        const next = clockOutAttendance(
          attendance,
          snapshot,
          clockOutAt,
          attendance.timeInLatitude,
          attendance.timeInLongitude
        )

        await tx.attendance.update({
          where: { id: attendance.id },
          data: next,
        })

        if (attendance.status === AttendanceStatus.ON_BREAK) {
          const activeBreak = await tx.attendanceBreak.findFirst({
            where: { attendanceId: attendance.id, endedAt: null },
            orderBy: { startedAt: "desc" },
          })

          if (activeBreak) {
            await tx.attendanceBreak.update({
              where: { id: activeBreak.id },
              data: {
                endedAt: clockOutAt,
                durationSeconds: secondsBetween(
                  activeBreak.startedAt,
                  clockOutAt
                ),
              },
            })
          }
        }
      }

      return tx.attendanceRequest.update({
        where: { id: request.id },
        data: {
          status: AttendanceRequestStatus.APPROVED,
          reviewedAt: new Date(),
        },
        include: requestInclude,
      })
    })

    return { data: result, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}

export async function declineAttendanceRequest(
  input: AttendanceRequestIdInput
) {
  try {
    const request = await prisma.attendanceRequest.findUniqueOrThrow({
      where: { id: input.id },
    })

    if (request.status !== AttendanceRequestStatus.PENDING) {
      return {
        data: null,
        error: new Error("This request has already been reviewed."),
      }
    }

    const updated = await prisma.attendanceRequest.update({
      where: { id: input.id },
      data: {
        status: AttendanceRequestStatus.DECLINED,
        reviewedAt: new Date(),
      },
      include: requestInclude,
    })

    return { data: updated, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}
