import { createServerFn } from "@tanstack/react-start"
import { storeIdSchema } from "../store/schema"
import {
  createDesignation,
  createDesignations,
  getStoreDesignations,
  softDeleteDesignation,
  updateDesignation,
} from "./designations.server"
import {
  designationArraySchema,
  designationIdSchema,
  designationSchema,
  designationUpdateSchema,
} from "./schema"

export const createMany = createServerFn({ method: "POST" })
  .validator(designationArraySchema)
  .handler(async ({ data }) => {
    return createDesignations(data)
  })

export const getAll = createServerFn({ method: "GET" })
  .validator(storeIdSchema)
  .handler(async ({ data }) => {
    return getStoreDesignations(data.id)
  })

export const create = createServerFn({ method: "POST" })
  .validator(designationSchema)
  .handler(async ({ data }) => {
    return createDesignation(data)
  })

export const update = createServerFn({ method: "POST" })
  .validator(designationUpdateSchema)
  .handler(async ({ data }) => {
    return updateDesignation(data)
  })

export const remove = createServerFn({ method: "POST" })
  .validator(designationIdSchema)
  .handler(async ({ data }) => {
    return softDeleteDesignation(data)
  })

export const designationsApi = { create, createMany, getAll, update, remove }
