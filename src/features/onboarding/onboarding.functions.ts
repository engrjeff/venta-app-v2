import { createServerFn } from "@tanstack/react-start"
import {
  createStore,
  finishOnboarding,
  getOnboardingStatus,
} from "./onboarding.server"
import { orgIdSchema, storeSchema } from "./schema"

export const create = createServerFn({ method: "POST" })
  .inputValidator(storeSchema)
  .handler(async ({ data }) => {
    return createStore(data)
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

export const onboardingApi = { create, checkOnboardingStatus, finish }
