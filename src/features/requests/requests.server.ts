import { clockOutAttendance } from "../attendance/attendance.server"
import {
  calculateAttendancePay,
  combineDateAndTime,
  secondsBetween,
} from "../attendance/attendance.utils"
import {
  AttendanceRequestStatus,
  AttendanceRequestType,
  AttendanceStatus,
} from "@/generated/prisma/enums"
import type { Prisma } from "@/generated/prisma/client"
import { prisma } from "@/lib/db"
import type {
  AttendanceRequestIdInput,
  AttendanceRequestsByEmployeeInput,
  AttendanceRequestsByStoreInput,
  CreateAttendanceRequestInput,
  DeclineAttendanceRequestInput,
} from "./schema"

const requestInclude = {
  employee: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      designation: { select: { id: true, name: true } },
    },
  },
  attendance: {
    select: {
      date: true,
      timeIn: true,
      timeOut: true,
      status: true,
      totalWorkedSeconds: true,
      totalBreakSeconds: true,
      totalPay: true,
      branch: { select: { id: true, name: true } },
      attendanceSnapshot: {
        select: {
          scheduleStartTime: true,
          scheduleEndTime: true,
          salaryType: true,
          salaryRate: true,
        },
      },
    },
  },
} satisfies Prisma.AttendanceRequestInclude

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

    const requestedTimes =
      input.type === AttendanceRequestType.EDIT_TIME_IN
        ? {
            requestedTimeIn: new Date(
              `1970-01-01T${input.requestedTimeIn}:00Z`
            ),
          }
        : {
            clockOutTime: new Date(`1970-01-01T${input.clockOutTime}:00Z`),
          }

    const request = await prisma.attendanceRequest.create({
      data: {
        organizationId: attendance.organizationId,
        employeeId: input.employeeId,
        attendanceId: input.attendanceId,
        type: input.type,
        reason: input.reason,
        ...requestedTimes,
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
        type: input.type
          ? input.type.operator === "is"
            ? { in: input.type.value }
            : { notIn: input.type.value }
          : undefined,
        attendance: {
          branchId: input.branches
            ? input.branches.operator === "is"
              ? { in: input.branches.value }
              : { notIn: input.branches.value }
            : undefined,
          date:
            input.start || input.end
              ? {
                  gte: input.start ? new Date(input.start) : undefined,
                  lte: input.end ? new Date(input.end) : undefined,
                }
              : undefined,
        },
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

      const stillOpen = attendance.status !== AttendanceStatus.CLOCKED_OUT

      if (
        request.type === AttendanceRequestType.FORGOT_TO_CLOCK_OUT &&
        !stillOpen
      ) {
        throw new Error(
          "Employee has already clocked out for this attendance record. Use an Edit Time Out request to correct it instead."
        )
      }

      const isClockOutFlow =
        request.type === AttendanceRequestType.FORGOT_TO_CLOCK_OUT ||
        request.type === AttendanceRequestType.EDIT_TIME_OUT

      if (isClockOutFlow && stillOpen) {
        // Employee hasn't clocked out yet — actually transition them to
        // CLOCKED_OUT at the requested time (same flow for both types).
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
      } else if (request.type === AttendanceRequestType.EDIT_TIME_OUT) {
        // Already clocked out — correct the final time-out and recompute
        // worked seconds/pay from it (break total is assumed unchanged).
        if (!snapshot) {
          throw new Error("Attendance snapshot is missing.")
        }

        if (!request.clockOutTime) {
          throw new Error("This request is missing a requested clock-out time.")
        }

        if (!attendance.timeIn) {
          throw new Error("Missing time-in for this attendance record.")
        }

        const newTimeOut = combineDateAndTime(
          attendance.date,
          request.clockOutTime
        )

        const totalWorkedSeconds = Math.max(
          0,
          secondsBetween(attendance.timeIn, newTimeOut) -
            attendance.totalBreakSeconds
        )

        const calculation = calculateAttendancePay({
          totalWorkedSeconds,
          scheduleStartTime: snapshot.scheduleStartTime,
          scheduleEndTime: snapshot.scheduleEndTime,
          salaryType: snapshot.salaryType,
          salaryRate: snapshot.salaryRate,
        })

        await tx.attendance.update({
          where: { id: attendance.id },
          data: { timeOut: newTimeOut, totalWorkedSeconds, ...calculation },
        })
      } else if (request.type === AttendanceRequestType.EDIT_TIME_IN) {
        if (!request.requestedTimeIn) {
          throw new Error("This request is missing a requested time-in.")
        }

        const newTimeIn = combineDateAndTime(
          attendance.date,
          request.requestedTimeIn
        )

        if (stillOpen) {
          // Worked-seconds accounting runs off workStartedAt, not timeIn,
          // so correcting timeIn on an in-progress record needs no recompute.
          await tx.attendance.update({
            where: { id: attendance.id },
            data: { timeIn: newTimeIn },
          })
        } else {
          if (!snapshot) {
            throw new Error("Attendance snapshot is missing.")
          }

          if (!attendance.timeOut) {
            throw new Error("Missing time-out for this attendance record.")
          }

          const totalWorkedSeconds = Math.max(
            0,
            secondsBetween(newTimeIn, attendance.timeOut) -
              attendance.totalBreakSeconds
          )

          const calculation = calculateAttendancePay({
            totalWorkedSeconds,
            scheduleStartTime: snapshot.scheduleStartTime,
            scheduleEndTime: snapshot.scheduleEndTime,
            salaryType: snapshot.salaryType,
            salaryRate: snapshot.salaryRate,
          })

          await tx.attendance.update({
            where: { id: attendance.id },
            data: { timeIn: newTimeIn, totalWorkedSeconds, ...calculation },
          })
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
  input: DeclineAttendanceRequestInput
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
        declineReason: input.declineReason,
      },
      include: requestInclude,
    })

    return { data: updated, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}
