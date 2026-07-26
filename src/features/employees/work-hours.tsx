import { Button } from "@/components/ui/button"
import { formatDate } from "date-fns"
import { PlayIcon } from "lucide-react"
import { useElapsedTime } from "./use-elapsed-time"

interface WorkHoursProps {
  timeInString: string
}

export function WorkHours({ timeInString }: WorkHoursProps) {
  const clockInTime = formatDate(new Date(timeInString), "hh:mm aa")

  const elapsedTime = useElapsedTime(timeInString)

  return (
    <div className="flex items-center justify-between rounded-md border bg-card p-4">
      <div className="space-y-1">
        <span className="text-xs text-muted-foreground">Work Hours</span>
        <div className="font-mono text-4xl font-semibold">
          {elapsedTime.formatted}
        </div>
        <p className="text-xs text-muted-foreground">
          Clocked In: <span className="font-mono">{clockInTime}</span>
        </p>
      </div>

      <div>
        <Button type="button" size="icon-lg" className="rounded-full">
          <PlayIcon />
        </Button>
      </div>
    </div>
  )
}
