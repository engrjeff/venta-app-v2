import { StatCard } from "@/components/stat-card"

export function DashboardMobileStats({
  salesToday,
  salesChangeLabel,
  workingCount,
  scheduledCount,
  onBreakCount,
}: {
  salesToday: string
  salesChangeLabel: string
  workingCount: number
  scheduledCount: number
  onBreakCount: number
}) {
  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      <StatCard>
        <StatCard.Label>Sales Today</StatCard.Label>
        <StatCard.Value numeric>{salesToday}</StatCard.Value>
        <StatCard.Caption className="text-emerald-500">
          {salesChangeLabel}
        </StatCard.Caption>
      </StatCard>
      <StatCard>
        <StatCard.Label>Working Now</StatCard.Label>
        <StatCard.Value numeric className="text-emerald-500">
          {workingCount}
          <span className="text-lg text-muted-foreground">
            /{scheduledCount}
          </span>
        </StatCard.Value>
        <StatCard.Caption>{onBreakCount} on break</StatCard.Caption>
      </StatCard>
    </div>
  )
}
