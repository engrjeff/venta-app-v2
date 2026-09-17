import { AttendanceStatus } from "@/generated/prisma/enums"
import { prisma } from "@/lib/db"
import type { TimesheetQueryOptions } from "./schema"
import { getDateRange } from "./timesheet.utils"

export async function getTimesheet(input: TimesheetQueryOptions) {
  try {
    const range = getDateRange({ type: "range", preset: "this_week" })

    const timesheets = await prisma.attendance.findMany({
      where: {
        organizationId: input.storeId,
        employeeId: input.employees
          ? input.employees.operator === "is"
            ? { in: input.employees.value }
            : { notIn: input.employees.value }
          : undefined,
        branchId: input.branches
          ? input.branches.operator === "is"
            ? { in: input.branches.value }
            : { notIn: input.branches.value }
          : undefined,
        employee: input.designations
          ? {
              designationId:
                input.designations.operator === "is"
                  ? { in: input.designations.value }
                  : { notIn: input.designations.value },
            }
          : undefined,
        attendanceSnapshot: { isNot: null },
        status: {
          in: [
            AttendanceStatus.CLOCKED_OUT,
            AttendanceStatus.WORKING,
            AttendanceStatus.ON_BREAK,
          ],
        },
        date:
          input.start && input.end
            ? {
                gte: new Date(input.start),
                lte: new Date(input.end),
              }
            : {
                gte: range.start,
                lte: range.end,
              },
      },
      include: {
        attendanceSnapshot: true,
        breaks: true,
        requests: {
          select: { id: true, status: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: {
        date: "desc",
      },
    })

    return { data: timesheets, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}
