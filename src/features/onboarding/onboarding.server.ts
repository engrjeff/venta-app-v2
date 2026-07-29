import { getRequestHeaders } from "@tanstack/react-start/server"
import slugify from "slugify"
import type { CreateStoreInputs, CreateStoreSettingsInputs } from "./schema"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

async function generateStoreSlug(name: string) {
  const baseSlug = slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  })

  let slug = baseSlug
  let counter = 2

  while (true) {
    try {
      await auth.api.checkOrganizationSlug({
        body: { slug },
      })

      // If no error was thrown, the slug is available.
      return slug
    } catch (error: any) {
      if (error?.body?.code === "ORGANIZATION_SLUG_ALREADY_TAKEN") {
        slug = `${baseSlug}-${counter++}`
        continue
      }

      throw error
    }
  }
}

export async function createStore(store: CreateStoreInputs) {
  try {
    // generate a unique store slug
    const storeSlug = await generateStoreSlug(store.name)

    // create the store as an organization
    const storeOrg = await auth.api.createOrganization({
      body: {
        name: store.name,
        slug: storeSlug,
        logo: store.logo,
        keepCurrentActiveOrganization: false,
      },
      headers: getRequestHeaders(),
    })

    // // if ok, create the org setting
    // await prisma.organizationSettings.create({
    //   data: {
    //     businessType: store.businessType,
    //     organizationId: storeOrg.id,
    //   },
    // })

    return { data: storeOrg, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}

export async function createStoreSettings(data: CreateStoreSettingsInputs) {
  try {
    const storeSettings = await prisma.organizationSettings.create({
      data: {
        businessType: data.businessType,
        organizationId: data.storeId,
      },
    })

    return { data: storeSettings, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}

type OnboardingStatusResponse =
  | {
      completed: boolean
      nextStep: "/onboarding"
    }
  | {
      completed: boolean
      nextStep:
        | "/onboarding/store-settings"
        | "/onboarding/branch"
        | "/onboarding/designations"
        | "/onboarding/employees"
      storeData: {
        name: string
        id: string
      }
    }
  | {
      completed: boolean
      nextStep: "/onboarding/finish"
      storeData: {
        name: string
        id: string
        branchCount: number
        designationCount: number
        employeeCount: number
      }
    }
  | {
      completed: true
      nextStep: "/dashboard"
    }

export async function getOnboardingStatus(organizationId?: string): Promise<{
  data: OnboardingStatusResponse | null
  error: any
}> {
  try {
    if (!organizationId) {
      return {
        data: { completed: false, nextStep: "/onboarding" },
        error: null,
      }
    }

    const store = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        organizationSettings: {
          select: { businessType: true, onboardingCompleted: true },
        },
        _count: {
          select: { branches: true, designations: true, employees: true },
        },
      },
    })

    if (!store) {
      return {
        data: { completed: false, nextStep: "/onboarding" },
        error: null,
      }
    }

    if (!store.organizationSettings) {
      return {
        data: {
          completed: false,
          nextStep: "/onboarding/store-settings",
          storeData: { name: store.name, id: store.id },
        },
        error: null,
      }
    }

    if (store._count.branches === 0) {
      return {
        data: {
          completed: false,
          nextStep: "/onboarding/branch",
          storeData: { name: store.name, id: store.id },
        },
        error: null,
      }
    }

    if (store._count.designations === 0) {
      return {
        data: {
          completed: false,
          nextStep: "/onboarding/designations",
          storeData: { name: store.name, id: store.id },
        },
        error: null,
      }
    }

    if (store._count.employees === 0) {
      return {
        data: {
          completed: false,
          nextStep: "/onboarding/employees",
          storeData: { name: store.name, id: store.id },
        },
        error: null,
      }
    }

    if (!store.organizationSettings?.onboardingCompleted) {
      return {
        data: {
          completed: false,
          nextStep: "/onboarding/finish",
          storeData: {
            name: store.name,
            id: store.id,
            branchCount: store._count.branches,
            designationCount: store._count.designations,
            employeeCount: store._count.employees,
          },
        },
        error: null,
      }
    }

    return {
      data: { completed: true, nextStep: "/dashboard" },
      error: null,
    }
  } catch (error) {
    return { data: null, error: error as any }
  }
}

// the store is the organization
export async function getStoreCount() {
  try {
    const result = await auth.api.listOrganizations({
      headers: getRequestHeaders(),
    })

    return { data: result?.length ?? 0, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}

export async function finishOnboarding(organizationId?: string) {
  try {
    const result = await prisma.organizationSettings.update({
      where: { organizationId },
      select: { id: true },
      data: {
        onboardingCompleted: true,
      },
    })

    return { data: result, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}
