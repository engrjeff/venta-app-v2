import { StatCard } from "@/components/stat-card"
import type { TimesheetTotals } from "@/features/timesheet/timesheet.utils"
import { formatDurationFromSeconds, formatPHP } from "@/lib/utils"

export function EmployeeStatCards({
  totals,
  overtimeShiftCount,
  weekRangeLabel,
}: {
  totals: TimesheetTotals
  overtimeShiftCount: number
  weekRangeLabel: string
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard>
        <StatCard.Label>Hours this week</StatCard.Label>
        <StatCard.Value numeric>
          {formatDurationFromSeconds(totals.workHours * 3600)}
        </StatCard.Value>
        {/* TODO: derive scheduled hours from the employee's branch schedule */}
        <StatCard.Caption>of 40h scheduled</StatCard.Caption>
      </StatCard>
      <StatCard>
        <StatCard.Label>Overtime</StatCard.Label>
        <StatCard.Value numeric className="text-amber-500">
          {formatDurationFromSeconds(totals.overtimeHours * 3600)}
        </StatCard.Value>
        <StatCard.Caption>
          {overtimeShiftCount} shift{overtimeShiftCount === 1 ? "" : "s"}
        </StatCard.Caption>
      </StatCard>
      <StatCard>
        <StatCard.Label>Earnings</StatCard.Label>
        <StatCard.Value numeric className="text-emerald-500">
          {formatPHP(totals.earnings)}
        </StatCard.Value>
        <StatCard.Caption>{weekRangeLabel}</StatCard.Caption>
      </StatCard>
    </div>
  )
}
