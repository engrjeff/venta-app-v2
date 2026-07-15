import type { Organization } from "@/generated/prisma/client"

export interface Store extends Organization {
  businessType?: string
}
