import { createServerFn } from "@tanstack/react-start"
import { orgIdSchema } from "../onboarding/schema"
import { createStoreBranch, getStoreBranches } from "./branch.server"
import { branchSchema } from "./schema"

export const create = createServerFn({ method: "POST" })
  .inputValidator(branchSchema)
  .handler(async ({ data }) => {
    return createStoreBranch(data)
  })

export const getAll = createServerFn({ method: "GET" })
  .inputValidator(orgIdSchema)
  .handler(async ({ data }) => {
    return getStoreBranches(data.id)
  })

export const branchApi = { create, getAll }
