import {
  MOBILE_DATE_PRESETS,
  getThisWeekRange,
  isPresetSelected,
} from "@/components/date-range-filter/presets"
import { searchToRange } from "@/components/date-range-filter/utils"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty"
import { useLoaderData, useSearch } from "@tanstack/react-router"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { SearchIcon } from "lucide-react"
import { TimesheetShiftCard } from "./timesheet-shift-card"
import { TimesheetSummaryCard } from "./timesheet-summary-card"
import { calculateTimesheetTotals } from "./timesheet.utils"

function getRangeLabel(range: DateRange) {
  const preset = MOBILE_DATE_PRESETS.find((p) => isPresetSelected(p, range))

  if (preset) return preset.label.toUpperCase()

  if (range.from && range.to) {
    return `${format(range.from, "MMM d")} - ${format(range.to, "MMM d")}`
  }

  return "SHIFTS"
}

export function TimesheetMobileList() {
  const { timesheets } = useLoaderData({ from: "/_protected/timesheet" })
  const search = useSearch({ from: "/_protected/timesheet" })

  if (timesheets.error) {
    return (
      <p className="px-4 text-sm text-muted-foreground">An error occured</p>
    )
  }

  const records = timesheets.data ?? []
  const totals = calculateTimesheetTotals(records)
  const range = searchToRange(search) ?? getThisWeekRange()

  return (
    <div className="flex flex-col gap-4 px-4">
      <TimesheetSummaryCard totals={totals} />

      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">
          {getRangeLabel(range)}
        </p>
        <p className="text-xs text-muted-foreground">
          {records.length} shift{records.length === 1 ? "" : "s"}
        </p>
      </div>

      {records.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon" className="size-4">
              <SearchIcon className="size-4" />
            </EmptyMedia>
            <EmptyDescription>No shifts to show</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-3">
          {records.map((attendance) => (
            <TimesheetShiftCard key={attendance.id} attendance={attendance} />
          ))}
        </div>
      )}
    </div>
  )
}
