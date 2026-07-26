import { createServerFn } from "@tanstack/react-start"
import {
  createStore,
  createStoreSettings,
  finishOnboarding,
  getOnboardingStatus,
} from "./onboarding.server"
import { orgIdSchema, storeSchema, storeSettingsSchema } from "./schema"

export const create = createServerFn({ method: "POST" })
  .inputValidator(storeSchema)
  .handler(async ({ data }) => {
    return createStore(data)
  })

export const createSettings = createServerFn({ method: "POST" })
  .inputValidator(storeSettingsSchema)
  .handler(async ({ data }) => {
    return createStoreSettings(data)
  })

export const checkOnboardingStatus = createServerFn({ method: "GET" })
  .inputValidator(orgIdSchema.partial())
  .handler(async ({ data }) => {
    return getOnboardingStatus(data.id)
  })

export const finish = createServerFn({ method: "GET" })
  .inputValidator(orgIdSchema.partial())
  .handler(async ({ data }) => {
    return finishOnboarding(data.id)
  })

export const onboardingApi = {
  create,
  checkOnboardingStatus,
  finish,
  createSettings,
}
