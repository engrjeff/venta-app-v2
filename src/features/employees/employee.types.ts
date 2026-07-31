import type { Branch, Designation, Employee } from "@/generated/prisma/client"

export type ExtendedEmployee = Employee & {
  designation: Pick<Designation, "id" | "name" | "salaryRate" | "salaryType">
} & {
  branches: Array<{ branch: Pick<Branch, "id" | "name"> }>
}
