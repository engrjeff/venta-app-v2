import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatPHP } from "@/lib/utils"
import { EmployeeActions } from "./employee-actions"
import type { ExtendedEmployee } from "./employee.types"

export function EmployeesTable({
  employees,
}: {
  employees: Array<ExtendedEmployee>
}) {
  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader className="font-semibold">
          <TableRow className="bg-muted/50">
            <TableHead className="w-9 border-r">#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>Branches</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead className="text-right">Rate</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee, index) => (
            <TableRow key={employee.id}>
              <TableCell className="border-r">{index + 1}</TableCell>
              <TableCell>
                <div>
                  <p className="font-semibold">
                    {employee.lastName}, {employee.firstName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    @{employee.username}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-xs">
                  <p className="font-semibold">
                    Email:{" "}
                    {employee.email ? (
                      <a
                        href={`mailto:${employee.email}`}
                        className="font-normal text-muted-foreground hover:underline"
                      >
                        {employee.email}
                      </a>
                    ) : (
                      <span className="font-normal text-muted-foreground">
                        None provided
                      </span>
                    )}
                  </p>
                  <p className="font-semibold">
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
                </div>
              </TableCell>
              <TableCell>
                {employee.branches
                  .map((branch) => branch.branch.name)
                  .join(", ")}
              </TableCell>
              <TableCell>{employee.designation.name}</TableCell>
              <TableCell className="text-right">
                <div className="font-mono">
                  <p>{formatPHP(employee.designation.salaryRate)}</p>
                  <span className="text-xs text-muted-foreground">
                    {employee.designation.salaryType.toLowerCase()}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <EmployeeActions employee={employee} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
