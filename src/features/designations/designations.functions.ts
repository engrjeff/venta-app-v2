import { createServerFn } from "@tanstack/react-start"
import { createDesignations } from "./designations.server"
import { designationArraySchema } from "./schema"

export const createMany = createServerFn({ method: "POST" })
  .inputValidator(designationArraySchema)
  .handler(async ({ data }) => {
    return createDesignations(data)
  })

export const designationsApi = { createMany }
