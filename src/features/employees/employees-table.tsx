import { SearchInput } from "@/components/search-input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
import { formatPHP } from "@/lib/utils"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { SearchIcon } from "lucide-react"
import { useCallback, useState } from "react"
import { EmployeeActions } from "./employee-actions"
import type { ExtendedEmployee } from "./employee.types"

export function EmployeesTable({
  employees,
}: {
  employees: Array<ExtendedEmployee>
}) {
  const search = useSearch({ from: "/_protected/employees" })
  const navigate = useNavigate({ from: "/employees" })

  const [query, setQuery] = useState(search.q ?? "")

  const handleSearch = useCallback(
    (q: string) => {
      if ((search.q ?? "") === q) return

      navigate({
        search: (prev) => ({
          ...prev,
          q: q || undefined,
        }),
        replace: true,
      })
    },
    [navigate, search.q]
  )

  return (
    <Card
      size="sm"
      className="h-full max-h-full overflow-hidden rounded-md pb-0"
    >
      <CardHeader className="px-3">
        <SearchInput
          placeholder="Search employees"
          value={query}
          onValueChange={setQuery}
          onChange={handleSearch}
        />
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto border-t px-0">
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
            {employees.length === 0 && query ? (
              <TableRow className="pointer-events-none">
                <TableCell colSpan={7}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon" className="size-4">
                        <SearchIcon size={16} className="size-4" />
                      </EmptyMedia>
                      <EmptyDescription>
                        No employees found for query "{query}""
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee, index) => (
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
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
