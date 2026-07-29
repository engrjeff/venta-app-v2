import z from "zod"

// the storeId is the organizationId
export const branchSchema = z
  .object({
    storeId: z
      .string({ error: "Store is required" })
      .min(1, "Store is required"),
    name: z
      .string({ error: "Branch name is required" })
      .min(1, "Branch name is required"),
    address: z
      .string({ error: "Branch address is required" })
      .min(1, "Branch address is required"),
    scheduleStartTime: z.iso.time({ error: "Schedule start time is required" }),
    scheduleEndTime: z.iso.time({ error: "Schedule end time is required" }),
  })
  .superRefine(({ scheduleStartTime, scheduleEndTime }, ctx) => {
    if (scheduleEndTime <= scheduleStartTime) {
      ctx.addIssue({
        code: "custom",
        path: ["scheduleEndTime"],
        message: "End time must be after start time",
      })
    }
  })

export type CreateBranchInput = z.infer<typeof branchSchema>
