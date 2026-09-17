import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AttendanceStatus } from "@/generated/prisma/enums"
import { formatPHP, formatSalaryType, getInitials } from "@/lib/utils"
import type { ExtendedEmployee } from "./employee.types"

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}

export function EmployeeProfileCard({
  employee,
  activeAttendanceStatus,
}: {
  employee: ExtendedEmployee
  activeAttendanceStatus: AttendanceStatus | null
}) {
  const primaryBranch = employee.branches[0]?.branch

  return (
    <div className="rounded-md bg-card py-3 shadow-xs ring-1 ring-foreground/10">
      <div className="flex items-center gap-3 px-3">
        <Avatar size="lg">
          <AvatarFallback className="text-base font-semibold">
            {getInitials(employee.firstName, employee.lastName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold">
            {employee.firstName} {employee.lastName}
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            {employee.username}
            {employee.employeeNumber ? ` · ${employee.employeeNumber}` : ""}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 px-3">
        {activeAttendanceStatus && (
          <Badge variant={activeAttendanceStatus}>
            {activeAttendanceStatus === AttendanceStatus.ON_BREAK
              ? "On break"
              : "Working now"}
          </Badge>
        )}
        <Badge variant="outline">{employee.designation.name}</Badge>
        {primaryBranch && <Badge variant="outline">{primaryBranch.name}</Badge>}
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-3 px-3">
        <ProfileRow label="Designation" value={employee.designation.name} />
        <ProfileRow
          label="Rate"
          value={`${formatPHP(employee.designation.salaryRate)}/${formatSalaryType(employee.designation.salaryType)}`}
        />
        <ProfileRow label="Branches" value={employee.branches[0].branch.name} />
        <ProfileRow
          label="Phone"
          value={employee.phone ? employee.phone : "None provided"}
        />
      </div>
    </div>
  )
}
