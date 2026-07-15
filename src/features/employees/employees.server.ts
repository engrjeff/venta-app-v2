import { prisma } from "@/lib/db"
import slugify from "slugify"
import type { CreateManyEmployeeInput } from "./schema"

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
