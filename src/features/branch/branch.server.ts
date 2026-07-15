import { prisma } from "@/lib/db"
import type { CreateBranchInput } from "./schema"

export async function createStoreBranch(branchInput: CreateBranchInput) {
  try {
    const branch = await prisma.branch.create({
      data: {
        organizationId: branchInput.storeId,
        name: branchInput.name,
        address: branchInput.address,
      },
    })

    return { data: branch, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}

export async function getStoreBranches(storeId: string) {
  try {
    const branches = await prisma.branch.findMany({
      where: { organizationId: storeId },
    })

    return { data: branches, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}
