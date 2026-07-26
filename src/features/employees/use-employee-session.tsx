import { useRouteContext } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"
import { employeesApi } from "./employees.functions"

export function useEmployeeSession() {
  const { employee: employeeSession } = useRouteContext({
    from: "/e/$storeSlug",
  })

  const clearSessionFn = useServerFn(employeesApi.clearSession)

  const clearSession = useCallback(clearSessionFn, [])

  return { data: employeeSession, clear: clearSession }
}
