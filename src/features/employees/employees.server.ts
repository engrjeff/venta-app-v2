import { prisma } from "@/lib/db"
import slugify from "slugify"
import { useEmployeeSession } from "./employee-session"
import type {
  CreateEmployeeInput,
  CreateManyEmployeeInput,
  EmployeeIdInput,
  UpdateEmployeeInput,
  UpdateEmployeeStatusInput,
  VerifyUsernameInput,
} from "./schema"

function generateEmployeeNumber(storeName: string, username: string) {
  return `${slugify(storeName.toUpperCase(), { trim: true })}-${slugify(username.toUpperCase(), { trim: true })}`
}

export async function getEmployees({ storeId }: { storeId: string }) {
  try {
    const employees = await prisma.employee.findMany({
      where: { organizationId: storeId },
      include: {
        designation: {
          select: { id: true, name: true, salaryRate: true, salaryType: true },
        },
        branches: { select: { branch: { select: { id: true, name: true } } } },
      },
      orderBy: {
        lastName: "asc",
      },
    })

    return { data: employees, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
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

export async function createEmployee(employee: CreateEmployeeInput) {
  try {
    const store = await prisma.organization.findUnique({
      where: { id: employee.storeId },
    })

    if (!store) {
      throw new Error("Store not found")
    }

    const result = await prisma.employee.create({
      data: {
        firstName: employee.firstName,
        lastName: employee.lastName,
        username: employee.username,
        email: employee.email,
        phone: employee.phone,
        organizationId: employee.storeId,
        designationId: employee.designationId,
        employeeNumber: generateEmployeeNumber(store.name, employee.username),
        branches: {
          create: [{ branchId: employee.branchId }],
        },
      },
    })

    return { data: result, error: null }
  } catch (error) {
    console.log("Create Employee Error: ", error)
    return { data: null, error: error as any }
  }
}

export async function updateEmployee(employee: UpdateEmployeeInput) {
  try {
    const foundEmployee = await prisma.employee.findUnique({
      where: { id: employee.id },
    })

    if (!foundEmployee) {
      throw new Error("Employee not found")
    }

    let employeeNumber = foundEmployee.employeeNumber

    if (employee.username !== foundEmployee.employeeNumber) {
      const store = await prisma.organization.findUnique({
        where: { id: employee.storeId },
      })

      if (!store) {
        throw new Error("Store not found")
      }

      employeeNumber = generateEmployeeNumber(store.name, employee.username)
    }

    const result = await prisma.employee.update({
      where: { id: employee.id },
      data: {
        firstName: employee.firstName,
        lastName: employee.lastName,
        username: employee.username,
        email: employee.email,
        phone: employee.phone,
        organizationId: employee.storeId,
        designationId: employee.designationId,
        employeeNumber,
        branches: {
          set: [
            {
              employeeId_branchId: {
                branchId: employee.branchId,
                employeeId: employee.id,
              },
            },
          ],
        },
      },
    })

    return { data: result, error: null }
  } catch (error) {
    console.log("Update Employee Error: ", error)
    return { data: null, error: error as any }
  }
}

export async function deleteEmployee({ employeeId }: EmployeeIdInput) {
  try {
    const foundEmployee = await prisma.employee.findUnique({
      where: { id: employeeId },
    })

    if (!foundEmployee) {
      throw new Error("Employee not found")
    }

    await prisma.employee.delete({ where: { id: employeeId } })

    return { data: { success: true }, error: null }
  } catch (error) {
    console.log("Delete Employee Error: ", error)
    return { data: null, error: error as any }
  }
}

export async function updateEmployeeStatus({
  employeeId,
  status,
}: UpdateEmployeeStatusInput) {
  try {
    const foundEmployee = await prisma.employee.findUnique({
      where: { id: employeeId },
    })

    if (!foundEmployee) {
      throw new Error("Employee not found")
    }

    const result = await prisma.employee.update({
      where: { id: employeeId },
      data: { status },
    })

    return { data: result, error: null }
  } catch (error) {
    console.log("Update Employee Status Error: ", error)
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
