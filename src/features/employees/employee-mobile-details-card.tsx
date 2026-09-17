import { Separator } from "@/components/ui/separator"
import { formatPHP, formatSalaryType } from "@/lib/utils"
import { formatDate } from "date-fns"
import type { ExtendedEmployee } from "./employee.types"

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}

export function EmployeeMobileDetailsCard({
  employee,
}: {
  employee: ExtendedEmployee
}) {
  const branchNames = employee.branches
    .map(({ branch }) => branch.name)
    .join(", ")

  const joinedAt = employee.hiredAt ?? employee.createdAt

  return (
    <div className="flex flex-col gap-3 rounded-md bg-card p-4 shadow-xs ring-1 ring-foreground/10">
      <DetailRow label="Designation" value={employee.designation.name} />
      <Separator />
      <DetailRow
        label="Rate"
        value={`${formatPHP(employee.designation.salaryRate)}/${formatSalaryType(employee.designation.salaryType)}`}
      />
      {branchNames && (
        <>
          <Separator />
          <DetailRow label="Branches" value={branchNames} />
        </>
      )}
      {employee.employeeNumber && (
        <>
          <Separator />
          <DetailRow label="Employee no." value={employee.employeeNumber} />
        </>
      )}
      <Separator />
      <DetailRow label="Joined" value={formatDate(joinedAt, "MMM d, yyyy")} />
    </div>
  )
}
