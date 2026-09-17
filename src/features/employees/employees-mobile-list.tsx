import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty"
import type { EmploymentStatus } from "@/generated/prisma/enums"
import { SearchIcon } from "lucide-react"
import { EmployeeMobileListItem } from "./employee-mobile-list-item"
import type { ExtendedEmployee } from "./employee.types"

function groupByBranch(employees: ExtendedEmployee[]) {
  const groups = new Map<string, ExtendedEmployee[]>()

  for (const employee of employees) {
    const branchName = employee.branches[0]?.branch.name ?? "No branch"
    const group = groups.get(branchName) ?? []
    group.push(employee)
    groups.set(branchName, group)
  }

  return Array.from(groups.entries()).sort(([a], [b]) => a.localeCompare(b))
}

export function EmployeesMobileList({
  employees,
  statusFilter,
}: {
  employees: ExtendedEmployee[]
  statusFilter: EmploymentStatus
}) {
  const filtered = employees.filter(
    (employee) => employee.status === statusFilter
  )
  const groups = groupByBranch(filtered)

  return (
    <div className="flex flex-col gap-4 px-4">
      {groups.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="size-4">
              <SearchIcon className="size-4" />
            </EmptyMedia>
            <EmptyDescription>No employees found</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((employee) => (
            <li key={employee.id}>
              <EmployeeMobileListItem employee={employee} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
