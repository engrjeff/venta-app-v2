import type { AttendanceStatus } from "@/generated/prisma/enums"
import type { ExtendedEmployee } from "./employee.types"
import { EmployeeMobileDetailsCard } from "./employee-mobile-details-card"
import { EmployeeMobileHeader } from "./employee-mobile-header"
import { EmployeeMobileProfile } from "./employee-mobile-profile"
import { EmployeeMobileStats } from "./employee-mobile-stats"
import { EmployeePendingRequestsBanner } from "./employee-pending-requests-banner"

export function EmployeeMobileScreen({
  employee,
  activeAttendanceStatus,
  hoursThisWeekSeconds,
  earnings,
  pendingRequestsCount,
}: {
  employee: ExtendedEmployee
  activeAttendanceStatus: AttendanceStatus | null
  hoursThisWeekSeconds: number
  earnings: number
  pendingRequestsCount: number
}) {
  return (
    <div className="flex flex-col gap-4 pb-24">
      <EmployeeMobileHeader employee={employee} />

      <EmployeeMobileProfile
        employee={employee}
        activeAttendanceStatus={activeAttendanceStatus}
      />

      <div className="flex flex-col gap-4 px-4">
        <EmployeeMobileDetailsCard employee={employee} />

        <EmployeeMobileStats
          hoursThisWeekSeconds={hoursThisWeekSeconds}
          earnings={earnings}
        />

        <EmployeePendingRequestsBanner
          employeeId={employee.id}
          count={pendingRequestsCount}
        />
      </div>
    </div>
  )
}
