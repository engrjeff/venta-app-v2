import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { EmploymentStatus } from "@/generated/prisma/enums"
import { formatPHP, formatSalaryType, getInitials } from "@/lib/utils"
import { Link } from "@tanstack/react-router"
import type { ExtendedEmployee } from "./employee.types"

export function EmployeeMobileListItem({
  employee,
}: {
  employee: ExtendedEmployee
}) {
  const isActive = employee.status === EmploymentStatus.ACTIVE

  return (
    <Link
      to="/employees/$employeeId"
      params={{ employeeId: employee.id }}
      className="flex items-center gap-3 rounded-md bg-card p-3 shadow"
    >
      <Avatar size="sm">
        <AvatarFallback className="text-xs font-semibold">
          {getInitials(employee.firstName, employee.lastName)}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {employee.lastName}, {employee.firstName}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          <span className="font-mono">{employee.username}</span> &middot;{" "}
          {formatPHP(employee.designation.salaryRate)}/
          {formatSalaryType(employee.designation.salaryType)}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <Badge variant={isActive ? "SUCCESS" : "CLOCKED_OUT"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
        <p className="text-xs text-muted-foreground">
          {employee.designation.name}
        </p>
      </div>
    </Link>
  )
}
