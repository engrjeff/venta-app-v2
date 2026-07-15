import { clientEnv } from "@/config/clientEnv"
import { organizationClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: clientEnv.VITE_APP_URL,
  plugins: [organizationClient()],
})
