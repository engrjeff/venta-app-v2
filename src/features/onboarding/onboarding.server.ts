import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getRequestHeaders } from "@tanstack/react-start/server"
import slugify from "slugify"
import type { CreateStoreInputs } from "./schema"

type OnboardingStatus = {
  completed: boolean
  nextStep:
    | "/onboarding"
    | "/onboarding/branch"
    | "/onboarding/designations"
    | "/onboarding/employees"
    | "/onboarding/finish"
    | "/dashboard"
  storeData?:
    | {
        name: string
        branchCount: number
        designationCount: number
        employeeCount: number
      }
    | undefined
}

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

    // if ok, create the org setting
    await prisma.organizationSettings.create({
      data: {
        businessType: store.businessType,
        organizationId: storeOrg.id,
      },
    })

    return { data: storeOrg, error: null }
  } catch (error) {
    return { data: null, error: error as any }
  }
}

export async function getOnboardingStatus(organizationId?: string): Promise<{
  data: OnboardingStatus | null
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
        organizationSettings: { select: { onboardingCompleted: true } },
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

    if (store._count.branches === 0) {
      return {
        data: { completed: false, nextStep: "/onboarding/branch" },
        error: null,
      }
    }

    if (store._count.designations === 0) {
      return {
        data: { completed: false, nextStep: "/onboarding/designations" },
        error: null,
      }
    }

    if (store._count.employees === 0) {
      return {
        data: { completed: false, nextStep: "/onboarding/employees" },
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
