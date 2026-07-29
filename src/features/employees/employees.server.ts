import slugify from "slugify"
import { useEmployeeSession } from "./employee-session"
import type { CreateManyEmployeeInput, VerifyUsernameInput } from "./schema"
import { prisma } from "@/lib/db"

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
