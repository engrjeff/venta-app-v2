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
  .inputValidator(designationArraySchema)
  .handler(async ({ data }) => {
    return createDesignations(data)
  })

export const getAll = createServerFn({ method: "GET" })
  .inputValidator(storeIdSchema)
  .handler(async ({ data }) => {
    return getStoreDesignations(data.id)
  })

export const create = createServerFn({ method: "POST" })
  .inputValidator(designationSchema)
  .handler(async ({ data }) => {
    return createDesignation(data)
  })

export const update = createServerFn({ method: "POST" })
  .inputValidator(designationUpdateSchema)
  .handler(async ({ data }) => {
    return updateDesignation(data)
  })

export const remove = createServerFn({ method: "POST" })
  .inputValidator(designationIdSchema)
  .handler(async ({ data }) => {
    return softDeleteDesignation(data)
  })

export const designationsApi = { create, createMany, getAll, update, remove }
