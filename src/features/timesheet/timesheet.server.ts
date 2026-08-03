import { prisma } from "@/lib/db"
import type { TimesheetQueryOptions } from "./schema"
import { getDateRange } from "./timesheet.utils"

export async function getTimesheet(options: TimesheetQueryOptions) {
  try {
    const range = getDateRange({ type: "range", preset: "this_week" })

    const timesheet = await prisma.employee.findMany({
      where: { organizationId: options.storeId },
      include: {
        designation: true,
        branches: {
          include: { branch: true },
        },
        attendance: {
          where: {
            date: {
              gte: range.start,
              lte: range.end,
            },
          },
        },
      },
    })

    return { data: timesheet, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}
