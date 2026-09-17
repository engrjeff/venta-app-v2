import { StatCard } from "@/components/stat-card"
import { formatDurationFromSeconds, formatPHP } from "@/lib/utils"

export function EmployeeMobileStats({
  hoursThisWeekSeconds,
  earnings,
}: {
  hoursThisWeekSeconds: number
  earnings: number
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard>
        <StatCard.Label>Hours this week</StatCard.Label>
        <StatCard.Value numeric>
          {formatDurationFromSeconds(hoursThisWeekSeconds)}
        </StatCard.Value>
      </StatCard>
      <StatCard>
        <StatCard.Label>Earnings</StatCard.Label>
        <StatCard.Value numeric className="text-emerald-500">
          {formatPHP(earnings)}
        </StatCard.Value>
      </StatCard>
    </div>
  )
}
