import { prisma } from "@/lib/db"
import { geocodeAddress } from "@/lib/geocoding"
import type { CreateBranchInput } from "./schema"

export async function createStoreBranch(branchInput: CreateBranchInput) {
  try {
    // geocode the address
    const geocodeResult = await geocodeAddress(branchInput.address)

    const { lat, lng } = geocodeResult.geometry.location as unknown as {
      lat: number
      lng: number
    }

    const branch = await prisma.branch.create({
      data: {
        organizationId: branchInput.storeId,
        name: branchInput.name,
        address: branchInput.address,
        latitude: lat,
        longitude: lng,
        gmFormattedAddress: geocodeResult.formatted_address,
        gmPlaceId: geocodeResult.place_id,
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
