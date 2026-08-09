import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import * as React from "react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { DATE_PRESETS, getThisWeekRange, isPresetSelected } from "./presets"

type Props = {
  value?: DateRange
  onApply?: (range: DateRange | undefined) => void
}

export function DateRangeFilter({ value, onApply }: Props) {
  const initialRange = React.useMemo(() => value ?? getThisWeekRange(), [value])

  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<DateRange | undefined>(initialRange)

  React.useEffect(() => {
    setDraft(value ?? getThisWeekRange())
  }, [value])

  function label() {
    if (!value?.from) {
      return "Select date range"
    }

    if (!value.to) {
      return format(value.from, "MMM d, yyyy")
    }

    return `${format(value.from, "MMM d")} - ${format(value.to, "MMM d, yyyy")}`
  }

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setDraft(value)
        }

        setOpen(o)
      }}
    >
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-1 size-4" />
            {label()}
          </Button>
        }
      />

      <PopoverContent align="start" className="w-auto p-0">
        <div className="flex">
          <div className="w-44 border-r p-2">
            {DATE_PRESETS.map((preset) => (
              <Button
                key={preset.label}
                size="sm"
                variant={
                  isPresetSelected(preset, draft) ? "secondary" : "ghost"
                }
                className="mb-1 w-full justify-start"
                onClick={() => setDraft(preset.getRange())}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          <div className="flex flex-col">
            <Calendar
              mode="range"
              defaultMonth={draft?.from}
              selected={draft}
              onSelect={setDraft}
              numberOfMonths={2}
            />

            <div className="flex items-center justify-between border-t p-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setDraft(value)
                  setOpen(false)
                }}
              >
                Cancel
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setDraft(undefined)}>
                  Clear
                </Button>

                <Button
                  onClick={() => {
                    onApply?.(draft)
                    setOpen(false)
                  }}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
