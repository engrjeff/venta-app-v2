import { createServerFn } from "@tanstack/react-start"
import { storeIdSchema, storeSlugSchema } from "./schema"
import {
  getStoreById,
  getStoreBySlug,
  getStoreFieldOptions,
  getStores,
} from "./store.server"

export const getFieldOptions = createServerFn({ method: "GET" })
  .inputValidator(storeIdSchema)
  .handler(async ({ data }) => {
    return getStoreFieldOptions(data.id)
  })

export const getAll = createServerFn({ method: "GET" }).handler(getStores)

export const getBySlug = createServerFn({ method: "GET" })
  .inputValidator(storeSlugSchema)
  .handler(async ({ data }) => getStoreBySlug(data.slug))

export const getById = createServerFn({ method: "GET" })
  .inputValidator(storeIdSchema)
  .handler(async ({ data }) => getStoreById(data.id))

export const storeApi = { getFieldOptions, getAll, getBySlug, getById }
