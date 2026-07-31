import { serverEnv } from "@/config/serverEnv"
import { useSession } from "@tanstack/react-start/server"
import { endOfDay } from "date-fns"

export type EmployeeSessionData = {
  employeeId: string
  employeeUsername: string
  employeeFirstName: string
  employeeLastName: string
  storeId: string

  branchId: string
  branchName: string

  attendanceId: string
  timeInString: string
}

export function useEmployeeSession() {
  const today = new Intl.DateTimeFormat("en-CA").format(new Date())

  return useSession<EmployeeSessionData>({
    name: "tindanatin-employee-session",
    password: serverEnv.EMPLOYEE_SESSION_SECRET,
    cookie: {
      secure: serverEnv.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
      expires: endOfDay(new Date(today)),
    },
  })
}
