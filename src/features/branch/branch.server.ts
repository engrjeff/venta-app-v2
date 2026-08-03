import { prisma } from "@/lib/db"
import { geocodeAddress } from "@/lib/geocoding"
import type {
  BranchIdInput,
  CreateBranchInput,
  UpdateBranchInput,
} from "./schema"

export async function createStoreBranch(branchInput: CreateBranchInput) {
  try {
    // geocode the address
    const geocodeResult = await geocodeAddress(branchInput.address)

    const { lat, lng } = geocodeResult.geometry.location as unknown as {
      lat: number
      lng: number
    }

    const scheduleStartTime = new Date(
      `1970-01-01T${branchInput.scheduleStartTime}:00Z`
    )

    const scheduleEndTime = new Date(
      `1970-01-01T${branchInput.scheduleEndTime}:00Z`
    )

    const branch = await prisma.branch.create({
      data: {
        organizationId: branchInput.storeId,
        name: branchInput.name,
        address: branchInput.address,
        scheduleStartTime,
        scheduleEndTime,
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

export async function updateStoreBranch(branchInput: UpdateBranchInput) {
  try {
    const foundBranch = await prisma.branch.findUnique({
      where: { id: branchInput.id },
    })

    if (!foundBranch) {
      throw new Error("Branch not found")
    }

    let lat = foundBranch.latitude
    let lng = foundBranch.longitude
    let placeId = foundBranch.gmPlaceId
    let formattedAddress = foundBranch.gmFormattedAddress

    const shouldUpdateGeoData =
      foundBranch.address.toLowerCase().trim() !==
      branchInput.address.toLowerCase().trim()

    // only update the geo fields if there is a change in address
    if (shouldUpdateGeoData) {
      // geocode the address
      const geocodeResult = await geocodeAddress(branchInput.address)

      const { lat: geoLat, lng: geoLng } = geocodeResult.geometry
        .location as unknown as {
        lat: number
        lng: number
      }

      lat = geoLat
      lng = geoLng

      placeId = geocodeResult.place_id
      formattedAddress = geocodeResult.formatted_address
    }

    const scheduleStartTime = new Date(
      `1970-01-01T${branchInput.scheduleStartTime}:00Z`
    )

    const scheduleEndTime = new Date(
      `1970-01-01T${branchInput.scheduleEndTime}:00Z`
    )

    const branch = await prisma.branch.update({
      where: { id: branchInput.id },
      data: {
        organizationId: branchInput.storeId,
        name: branchInput.name,
        address: branchInput.address,
        scheduleStartTime,
        scheduleEndTime,
        latitude: lat,
        longitude: lng,
        gmFormattedAddress: formattedAddress,
        gmPlaceId: placeId,
      },
    })

    return { data: branch, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}

export async function softDeleteBranch(input: BranchIdInput) {
  try {
    const foundBranch = await prisma.branch.findUnique({
      where: { id: input.id },
    })

    if (!foundBranch) {
      throw new Error("Branch not found")
    }

    await prisma.branch.update({
      where: { id: input.id },
      data: { isActive: false },
    })

    return { data: { success: true }, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}
