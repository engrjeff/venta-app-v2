import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Designation, Employee } from "@/generated/prisma/browser"
import { formatPHP, getInitials } from "@/lib/utils"

interface DesignationsTableProps {
  designations: Array<
    Designation & {
      employees: Pick<Employee, "id" | "firstName" | "lastName">[]
    }
  >
}

export function DesignationsTable({ designations }: DesignationsTableProps) {
  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader className="font-semibold">
          <TableRow className="bg-muted/50">
            <TableHead className="w-9 border-r">#</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead>Assigned Employees</TableHead>
            <TableHead className="text-right">Rate</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {designations.map((designation, index) => (
            <TableRow key={designation.id}>
              <TableCell className="border-r">{index + 1}</TableCell>
              <TableCell>
                <div>
                  <p className="font-semibold">{designation.name}</p>
                </div>
              </TableCell>
              <TableCell>
                {designation.employees.length === 0 ? (
                  <span>None</span>
                ) : (
                  <AvatarGroup className="grayscale">
                    {designation.employees.slice(0, 4).map((employee) => (
                      <Avatar key={employee.id}>
                        <AvatarFallback>
                          {getInitials(employee.firstName, employee.lastName)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {designation.employees.length > 4 && (
                      <Avatar>
                        <AvatarGroupCount>
                          +{designation.employees.length - 4}
                        </AvatarGroupCount>
                      </Avatar>
                    )}
                  </AvatarGroup>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="font-mono">
                  <p>{formatPHP(designation.salaryRate)}</p>
                  <span className="text-xs text-muted-foreground">
                    {designation.salaryType.toLowerCase()}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center"></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
