import { formatDurationFromSeconds, formatPHP } from "@/lib/utils"
import type { TimesheetTotals } from "./timesheet.utils"

export function TimesheetSummaryCard({ totals }: { totals: TimesheetTotals }) {
  return (
    <div className="grid grid-cols-3 divide-x rounded-md bg-card p-4 shadow">
      <div className="flex flex-col gap-1 pr-2">
        <p className="text-xs text-muted-foreground">Work hours</p>
        <p className="text-sm font-semibold">
          {formatDurationFromSeconds(totals.workHours * 3600)}
        </p>
      </div>
      <div className="flex flex-col gap-1 px-2">
        <p className="text-xs text-muted-foreground">Breaks</p>
        <p className="text-sm font-semibold">
          {formatDurationFromSeconds(totals.breakHours * 3600)}
        </p>
      </div>
      <div className="flex flex-col gap-1 pl-2">
        <p className="text-xs text-muted-foreground">Earnings</p>
        <p className="text-sm font-semibold text-emerald-500">
          {formatPHP(totals.earnings)}
        </p>
      </div>
    </div>
  )
}
