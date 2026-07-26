import { prisma } from "@/lib/db"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client"
import slugify from "slugify"
import { useEmployeeSession } from "./employee-session"
import type {
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
      },
    })

    // update the employee session cookie with the clock-in data
    const employeeSession = await useEmployeeSession()

    await employeeSession.update({
      ...employeeSession.data,
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
