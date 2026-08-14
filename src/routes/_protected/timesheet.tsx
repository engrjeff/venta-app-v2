import { DateRangeFilter } from "@/components/date-range-filter/date-range-filter"
import { getThisWeekRange } from "@/components/date-range-filter/presets"
import {
  rangeToSearch,
  searchToRange,
} from "@/components/date-range-filter/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { employeesApi } from "@/features/employees/employees.functions"
import { timesheetQueryOptionsSchema } from "@/features/timesheet/schema"
import { timesheetApi } from "@/features/timesheet/timesheet.functions"
import { formatPHP, formatTime, generatePageTitle } from "@/lib/utils"
import { createFileRoute } from "@tanstack/react-router"
import { formatDate } from "date-fns"
import { ClockIcon, SearchIcon } from "lucide-react"

export const Route = createFileRoute("/_protected/timesheet")({
  head: () => ({
    meta: [{ title: generatePageTitle("Timesheet") }],
  }),
  validateSearch: timesheetQueryOptionsSchema.omit({ storeId: true }),
  loaderDeps: ({ search: { employees, start, end } }) => ({
    employees,
    start,
    end,
  }),
  loader: async ({ context, deps: { employees, start, end } }) => {
    const [timesheets, employeeList] = await Promise.all([
      timesheetApi.getMany({
        data: { storeId: context.activeStoreId, employees, start, end },
      }),
      employeesApi.getAll({ data: { storeId: context.activeStoreId } }),
    ])

    return { timesheets, employeeList }
  },
  component: RouteComponent,
  pendingComponent: () => (
    <Card size="sm" className="h-full flex-1 rounded-md">
      <CardHeader className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle>
            <Skeleton className="h-4 w-36" />
          </CardTitle>
          <CardDescription className="text-xs">
            <Skeleton className="h-3 w-40" />
          </CardDescription>
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center">
        <Skeleton className="size-full" />
      </CardContent>
    </Card>
  ),
})

function RouteComponent() {
  const { timesheets } = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

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

  return (
    <div className="flex h-full flex-col space-y-4 p-4">
      {/* page header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ClockIcon className="size-4" />{" "}
          <h1 className="font-semibold">Timesheet</h1>
        </div>
      </div>
      {/* content */}
      <Card size="sm" className="h-full flex-1 rounded-md pb-0">
        <CardHeader className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* <Filter
              label="Employees"
              options={
                employeeList.data?.map((e) => ({
                  value: e.id,
                  label: `${e.firstName} ${e.lastName}`,
                })) ?? []
              }
            /> */}
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
          </div>
        </CardHeader>

        <CardContent className="flex-1 px-0">
          <Table className="h-full border-t">
            <TableHeader className="font-semibold">
              <TableRow className="bg-muted/50">
                <TableHead>Date</TableHead>
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
                  <TableCell colSpan={7}>
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
                          {(attendance.totalWorkedSeconds / 3600).toFixed(2)}{" "}
                          <span className="text-xs text-muted-foreground">
                            hrs
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-mono">
                          {(attendance.totalBreakSeconds / 3600).toFixed(2)}{" "}
                          <span className="text-xs text-muted-foreground">
                            hrs
                          </span>
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
                      colSpan={3}
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
    </div>
  )
}
