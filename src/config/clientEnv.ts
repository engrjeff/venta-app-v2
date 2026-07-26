import { z } from "zod"

const clientEnvSchema = z.object({
  VITE_APP_URL: z.url(),
  VITE_GOOGLE_MAPS_API_KEY: z.string(),
})

// Validate client environment
export const clientEnv = clientEnvSchema.parse(import.meta.env)
