import { EmploymentStatus } from "@/generated/prisma/enums"
import { prisma } from "@/lib/db"
import { getToday } from "../attendance/attendance.server"
import type { DashboardDataInput } from "./schema"

export async function getDashboardData(input: DashboardDataInput) {
  try {
    const store = await prisma.organization.findUnique({
      where: {
        id: input.storeId,
      },
      include: {
        attendances: {
          where: {
            date: getToday(),
          },
          include: {
            branch: { select: { id: true, name: true } },
            employee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                designation: { select: { id: true, name: true } },
              },
            },
          },
        },
        _count: {
          select: {
            branches: true,
            employees: {
              where: { status: EmploymentStatus.ACTIVE },
            },
          },
        },
      },
    })

    return { data: store, error: null }
  } catch (error) {
    console.log("GET Dashboard Data Error: ", error)
    return { data: null, error: error as any }
  }
}
