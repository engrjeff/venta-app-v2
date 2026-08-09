import { clientEnv } from "@/config/clientEnv"
import { organizationClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: clientEnv.VITE_APP_URL,
  plugins: [organizationClient()],
})

type ErrorTypes = Partial<Record<keyof typeof authClient.$ERROR_CODES, string>>
const errorCodes = {
  INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
  USER_ALREADY_EXISTS: "User already registered",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "The provided email is already in use",
} satisfies ErrorTypes

export const getAuthErrorMessage = (
  error: unknown,
  genericErrorMsg?: string
) => {
  const _error = error as any

  if (_error?.code in errorCodes) {
    return errorCodes[_error?.code as keyof typeof errorCodes]
  }
  return genericErrorMsg ?? "An unknown error has occurred"
}
