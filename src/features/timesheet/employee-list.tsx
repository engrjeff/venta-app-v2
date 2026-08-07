import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Link, useLocation } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import type { ExtendedEmployee } from "../employees/employee.types"

export function EmployeeList({
  employees,
}: {
  employees: Array<Omit<ExtendedEmployee, "branches">>
}) {
  const { pathname } = useLocation()

  const [search, setSearch] = useState("")

  const indexedEmployees = useMemo(
    () =>
      employees.map((employee) => ({
        employee,
        search: [
          employee.firstName,
          employee.lastName,
          `${employee.firstName} ${employee.lastName}`,
          `${employee.lastName} ${employee.firstName}`,
        ]
          .join(" ")
          .toLowerCase(),
      })),
    [employees]
  )

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return employees
    }

    return indexedEmployees
      .filter((item) => item.search.includes(query))
      .map((item) => item.employee)
  }, [employees, indexedEmployees, search])

  return (
    <Card
      size="sm"
      className="flex h-full flex-1 flex-col gap-0 rounded-md pb-0"
    >
      <CardHeader className="border-b">
        <CardTitle>Employees</CardTitle>
        <CardDescription className="mb-2 text-xs">
          Select employee to view timesheet
        </CardDescription>
        <Input
          type="search"
          placeholder="Search employees"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto px-0">
        {filteredEmployees.length === 0 ? (
          <div>
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              No employees found.
            </p>
          </div>
        ) : (
          <ul className="max-h-full divide-y overflow-y-auto">
            {filteredEmployees.map((employee) => (
              <li key={employee.id}>
                <Link
                  to="/timesheet/$employeeId"
                  params={{ employeeId: employee.id }}
                  preload={false}
                  className="group"
                >
                  <div
                    className={cn(
                      "border-l-2 border-transparent p-3 group-hover:bg-accent/50",
                      pathname.includes(employee.id) &&
                        "border-primary bg-accent group-hover:bg-accent"
                    )}
                  >
                    <p className="text-sm font-semibold">
                      {employee.lastName}, {employee.firstName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {employee.designation.name}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
