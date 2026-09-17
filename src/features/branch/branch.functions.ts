import { createServerFn } from "@tanstack/react-start"
import { orgIdSchema } from "../onboarding/schema"
import {
  createStoreBranch,
  getStoreBranches,
  softDeleteBranch,
  updateStoreBranch,
} from "./branch.server"
import { branchIdSchema, branchSchema, branchUpdateSchema } from "./schema"

export const getAll = createServerFn({ method: "GET" })
  .validator(orgIdSchema)
  .handler(async ({ data }) => {
    return getStoreBranches(data.id)
  })

export const create = createServerFn({ method: "POST" })
  .validator(branchSchema)
  .handler(async ({ data }) => {
    return createStoreBranch(data)
  })

export const update = createServerFn({ method: "POST" })
  .validator(branchUpdateSchema)
  .handler(async ({ data }) => {
    return updateStoreBranch(data)
  })

export const remove = createServerFn({ method: "POST" })
  .validator(branchIdSchema)
  .handler(async ({ data }) => {
    return softDeleteBranch(data)
  })

export const branchApi = { getAll, create, update, remove }
