import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getRequestHeaders } from "@tanstack/react-start/server"

/**
 *
 * @param storeId the store id - the very value of the organization id
 * @returns a listing of data used as options in various forms
 */
export async function getStoreFieldOptions(storeId: string) {
  try {
    const store = await prisma.organization.findUnique({
      where: { id: storeId },
      select: {
        id: true,
        name: true,
        branches: { select: { id: true, name: true } },
        designations: { select: { id: true, name: true } },
      },
    })

    return { data: store, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}

export async function getStores() {
  try {
    const orgs = await auth.api.listOrganizations({
      headers: getRequestHeaders(),
    })

    const stores = await prisma.organization.findMany({
      where: {
        id: {
          in: orgs.map((org) => org.id),
        },
      },
      include: {
        organizationSettings: {
          select: {
            businessType: true,
          },
        },
      },
    })

    return {
      data: stores.map(({ organizationSettings, ...store }) => ({
        ...store,
        businessType: organizationSettings?.businessType,
      })),
      error: null,
    }
  } catch (error) {
    return { data: null, error: error as any }
  }
}
