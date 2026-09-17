import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatPHP, formatSalaryType } from "@/lib/utils"
import { useNavigate } from "@tanstack/react-router"
import { SearchIcon } from "lucide-react"
import { EmployeeActions } from "./employee-actions"
import type { ExtendedEmployee } from "./employee.types"

export function EmployeesTable({
  employees,
}: {
  employees: Array<ExtendedEmployee>
}) {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-md border bg-card">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Table>
          <TableHeader className="font-semibold">
            <TableRow className="bg-muted/50">
              <TableHead className="w-9 border-r">#</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Branches</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow className="pointer-events-none">
                <TableCell colSpan={7}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon" className="size-4">
                        <SearchIcon size={16} className="size-4" />
                      </EmptyMedia>
                      <EmptyDescription>
                        No employee records found
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee, index) => (
                <TableRow
                  key={employee.id}
                  className="cursor-pointer"
                  onClick={() =>
                    navigate({
                      to: "/employees/$employeeId",
                      params: { employeeId: employee.id },
                    })
                  }
                >
                  <TableCell className="border-r">{index + 1}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold">
                        {employee.lastName}, {employee.firstName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {employee.email ? employee.email : "No email provided"}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-mono">{employee.username}</span>
                  </TableCell>

                  <TableCell>
                    <p>
                      {employee.designation.name} &middot;{" "}
                      <span className="font-mono text-xs text-muted-foreground">
                        {formatPHP(employee.designation.salaryRate)}/
                        {formatSalaryType(employee.designation.salaryType)}
                      </span>
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs font-semibold">
                      Phone:{" "}
                      {employee.phone ? (
                        <a
                          href={`tel:+${employee.phone}`}
                          className="font-normal text-muted-foreground hover:underline"
                        >
                          {employee.phone}
                        </a>
                      ) : (
                        <span className="font-normal text-muted-foreground">
                          None provided
                        </span>
                      )}
                    </p>
                  </TableCell>
                  <TableCell>
                    {employee.branches
                      .map((branch) => branch.branch.name)
                      .join(", ")}
                  </TableCell>
                  <TableCell
                    className="text-center"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <EmployeeActions employee={employee} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between border-t px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {employees.length} of {employees.length} rows
        </p>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" size="sm">
            Previous
          </Button>
          <Button type="button" variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
