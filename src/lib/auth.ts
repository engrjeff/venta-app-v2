import { serverEnv } from "@/config/serverEnv"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { organization } from "better-auth/plugins"
import { tanstackStartCookies } from "better-auth/tanstack-start"
import { prisma } from "./db"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [serverEnv.BETTER_AUTH_URL],
  plugins: [organization(), tanstackStartCookies()],
})
