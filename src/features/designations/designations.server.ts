import type { CreateManyDesignationInput } from "./schema"
import { prisma } from "@/lib/db"

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
