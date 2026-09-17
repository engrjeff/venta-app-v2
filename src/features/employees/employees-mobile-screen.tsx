import { EmploymentStatus } from "@/generated/prisma/enums"
import { useState } from "react"
import { AddEmployeeMobileSheet } from "./add-employee-mobile-sheet"
import type { ExtendedEmployee } from "./employee.types"
import { EmployeesMobileHeader } from "./employees-mobile-header"
import { EmployeesMobileList } from "./employees-mobile-list"
import { EmployeesMobileToolbar } from "./employees-mobile-toolbar"

export function EmployeesMobileScreen({
  employees,
}: {
  employees: ExtendedEmployee[]
}) {
  const [statusFilter, setStatusFilter] = useState<EmploymentStatus>(
    EmploymentStatus.ACTIVE
  )

  return (
    <div className="relative flex flex-col gap-4 pb-24">
      <EmployeesMobileHeader total={employees.length} />

      <EmployeesMobileToolbar
        employees={employees}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <EmployeesMobileList employees={employees} statusFilter={statusFilter} />

      <AddEmployeeMobileSheet />
    </div>
  )
}
