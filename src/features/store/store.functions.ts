import { createServerFn } from "@tanstack/react-start"
import { storeIdSchema } from "./schema"
import { getStoreFieldOptions, getStores } from "./store.server"

export const getFieldOptions = createServerFn({ method: "GET" })
  .inputValidator(storeIdSchema)
  .handler(async ({ data }) => {
    return getStoreFieldOptions(data.id)
  })

export const getAll = createServerFn({ method: "GET" }).handler(getStores)

export const storeApi = { getFieldOptions, getAll }
