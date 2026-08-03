import { createServerFn } from "@tanstack/react-start"
import { storeIdSchema } from "../store/schema"
import { createDesignations, getStoreDesignations } from "./designations.server"
import { designationArraySchema } from "./schema"

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

export const designationsApi = { createMany, getAll }
