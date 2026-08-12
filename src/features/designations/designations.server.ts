import { prisma } from "@/lib/db"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client"
import type {
  CreateDesignationInput,
  CreateManyDesignationInput,
} from "./schema"

export async function createDesignations(
  designationArrayInput: CreateManyDesignationInput
) {
  try {
    const designations = await prisma.designation.createMany({
      data: designationArrayInput.designations.map((designation) => ({
        organizationId: designationArrayInput.storeId,
        ...designation,
      })),
    })

    return { data: designations, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}

export async function getStoreDesignations(storeId: string) {
  try {
    const designations = await prisma.designation.findMany({
      where: { organizationId: storeId },
      include: {
        employees: { select: { id: true, firstName: true, lastName: true } },
      },
    })

    return { data: designations, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}

export async function createDesignation(input: CreateDesignationInput) {
  try {
    const existing = await prisma.designation.findFirst({
      where: {
        organizationId: input.storeId,
        name: { equals: input.name, mode: "insensitive" },
      },
      select: { id: true },
    })

    if (existing) {
      return {
        data: null,
        error: new Error(`Designation ${input.name} already exists.`),
      }
    }

    const designation = await prisma.designation.create({
      data: {
        organizationId: input.storeId,
        name: input.name,
        salaryType: input.salaryType,
        salaryRate: input.salaryRate,
      },
    })

    return { data: designation, error: null }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (
        error.message.includes(
          'Unique constraint failed on the fields: (`"organizationId"`, `name`)'
        )
      ) {
        return {
          data: null,
          error: new Error(`Designation ${input.name} already exists.`),
        }
      }
    }

    return { data: null, error: error as any }
  }
}
