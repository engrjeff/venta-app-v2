import { DateRangeFilter } from "@/components/date-range-filter/date-range-filter"
import { getThisWeekRange } from "@/components/date-range-filter/presets"
import {
  rangeToSearch,
  searchToRange,
} from "@/components/date-range-filter/utils"
import type { FilterField } from "@/components/filter-builder/filter-builder"
import {
  FilterBuilder,
  queryToFilterRules,
  rulesToQuery,
} from "@/components/filter-builder/filter-builder"
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
import { formatDurationFromSeconds, formatPHP, formatTime } from "@/lib/utils"
import { useLoaderData, useNavigate, useSearch } from "@tanstack/react-router"
import { formatDate } from "date-fns"
import { SearchIcon } from "lucide-react"

export function TimesheetTable() {
  const { timesheets, employees, branches, designations } = useLoaderData({
    from: "/_protected/timesheet",
  })

  const search = useSearch({ from: "/_protected/timesheet" })
  const navigate = useNavigate({ from: "/timesheet" })

  if (timesheets.error) {
    return <p>An Error has occured</p>
  }

  const totals = timesheets.data?.reduce<{
    workHours: number
    breakHours: number
    earnings: number
  }>(
    (acc, attendance) => {
      const breakHours = attendance.totalBreakSeconds / 3600
      const workHours = attendance.totalWorkedSeconds / 3600
      const pay = attendance.totalPay ?? 0

      return {
        workHours: acc.workHours + workHours,
        breakHours: acc.breakHours + breakHours,
        earnings: acc.earnings + pay,
      }
    },
    {
      workHours: 0,
      breakHours: 0,
      earnings: 0,
    }
  ) ?? {
    workHours: 0,
    breakHours: 0,
    earnings: 0,
  }

  const range = searchToRange(search) ?? getThisWeekRange()

  const employeeFilter: FilterField = {
    id: "employees",
    label: "Employee",
    type: "select",
    options: employees.map((e) => ({
      value: e.id,
      label: `${e.firstName} ${e.lastName}`,
      renderAs: (
        <div className="flex flex-col">
          <span className="text-xs">{`${e.firstName} ${e.lastName}`}</span>
          <span className="text-xs text-muted-foreground">
            {e.designation.name}
          </span>
        </div>
      ),
    })),
  }

  const branchFilter: FilterField = {
    id: "branches",
    label: "Branch",
    type: "select",
    options: branches.map((b) => ({
      label: b.name,
      value: b.id,
    })),
  }

  const designationFilter: FilterField = {
    id: "designations",
    label: "Designation",
    type: "select",
    options: designations.map((d) => ({
      label: d.name,
      value: d.id,
    })),
  }

  const filterFields = [employeeFilter, branchFilter, designationFilter]

  const activeFilters = queryToFilterRules(
    {
      employees: search.employees,
      branches: search.branches,
      designations: search.designations,
    },
    filterFields
  )

  return (
    <Card size="sm" className="hidden h-full flex-1 rounded-md pb-0 lg:flex">
      <CardHeader className="flex items-start justify-between gap-4">
        <FilterBuilder
          fields={filterFields}
          value={activeFilters}
          onApply={(filterRules) =>
            navigate({
              search: (prev) => ({
                ...prev,
                ...rulesToQuery(filterRules),
              }),
            })
          }
          onChange={(filterRules) =>
            navigate({
              search: (prev) => ({
                start: prev.start,
                end: prev.end,
                ...rulesToQuery(filterRules),
              }),
            })
          }
        />
        <DateRangeFilter
          value={range}
          onApply={(rangeQuery) => {
            navigate({
              search: (prev) => ({
                ...prev,
                ...rangeToSearch(rangeQuery),
              }),
            })
          }}
        />
      </CardHeader>

      <CardContent className="flex-1 px-0">
        <Table className="h-full border-t">
          <TableHeader className="font-semibold">
            <TableRow className="bg-muted/50">
              <TableHead>Employee</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead className="text-center">Time In</TableHead>
              <TableHead className="text-center">Time Out</TableHead>
              <TableHead className="text-center">Total Work Hours</TableHead>
              <TableHead className="text-center">Total Break Hours</TableHead>
              <TableHead className="text-center">Earnings</TableHead>
              <TableHead className="text-center">Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!timesheets.data?.length ? (
              <TableRow className="pointer-events-none">
                <TableCell colSpan={9}>
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon" className="size-4">
                        <SearchIcon size={16} className="size-4" />
                      </EmptyMedia>
                      <EmptyDescription>No records to show</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {timesheets.data.map((attendance) => {
                  // const remark = attendance.timeIn
                  //   ? getAttendanceRemark(
                  //       attendance.timeIn,
                  //       employee.branches[0].branch.scheduleStartTime
                  //     )
                  //   : null
                  return (
                    <TableRow
                      key={attendance.id}
                      className="hover:bg-transparent"
                    >
                      <TableCell>
                        <div>
                          <p>
                            {attendance.attendanceSnapshot?.employeeLastName},{" "}
                            {attendance.attendanceSnapshot?.employeeFirstName}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {attendance.attendanceSnapshot?.designationName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p>{attendance.attendanceSnapshot?.branchName}</p>
                      </TableCell>
                      <TableCell>
                        {formatDate(attendance.date, "EE, MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-mono">
                          {attendance.timeIn
                            ? formatTime(attendance.timeIn)
                            : "--"}
                        </p>
                      </TableCell>
                      <TableCell className="text-center">
                        <p className="font-mono">
                          {attendance.timeOut
                            ? formatTime(attendance.timeOut)
                            : "--"}
                        </p>
                      </TableCell>

                      <TableCell className="text-center font-mono">
                        {formatDurationFromSeconds(
                          attendance.totalWorkedSeconds
                        )}
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {formatDurationFromSeconds(
                          attendance.totalBreakSeconds
                        )}
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {formatPHP(attendance.totalPay ?? 0)}
                      </TableCell>
                      <TableCell className="text-center"></TableCell>
                    </TableRow>
                  )
                })}
                <TableRow className="bg-muted/50">
                  <TableCell
                    colSpan={5}
                    className="border-r text-right font-semibold"
                  >
                    Total
                  </TableCell>
                  <TableCell colSpan={1} className="text-center">
                    <span className="text-center font-mono font-semibold text-green-500">
                      {totals.workHours.toFixed(2)} hrs
                    </span>
                  </TableCell>
                  <TableCell colSpan={1} className="text-center">
                    <span className="text-center font-mono font-semibold text-green-500">
                      {totals.breakHours.toFixed(2)} hrs
                    </span>
                  </TableCell>
                  <TableCell colSpan={1} className="text-center">
                    <span className="text-center font-mono font-semibold text-green-500">
                      {formatPHP(totals.earnings)}
                    </span>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
