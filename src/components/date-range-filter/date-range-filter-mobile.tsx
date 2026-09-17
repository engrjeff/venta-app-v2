import { differenceInCalendarDays, format } from "date-fns"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"
import { useEffect, useState } from "react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  MOBILE_DATE_PRESETS,
  getThisWeekRange,
  isPresetSelected,
} from "./presets"

function toInputValue(date?: Date) {
  return date ? format(date, "yyyy-MM-dd") : ""
}

function fromInputValue(value: string) {
  return value ? new Date(`${value}T00:00:00`) : undefined
}

export function DateRangeFilterMobile({
  value,
  onApply,
}: {
  value?: DateRange
  onApply?: (range: DateRange | undefined) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<DateRange | undefined>(
    value ?? getThisWeekRange()
  )
  const [month, setMonth] = useState<Date>(draft?.from ?? new Date())

  useEffect(() => {
    setDraft(value ?? getThisWeekRange())
  }, [value])

  // Keep the visible calendar month in sync whenever the range's start
  // date changes from something other than manual month navigation
  // (preset clicks, the From/To inputs, or the sheet re-seeding on open).
  useEffect(() => {
    if (draft?.from) setMonth(draft.from)
  }, [draft?.from])

  function label() {
    if (!value?.from) return "Select date range"
    if (!value.to) return format(value.from, "MMM d, yyyy")
    return `${format(value.from, "MMM d")} - ${format(value.to, "MMM d, yyyy")}`
  }

  function handleOpenChange(isOpen: boolean) {
    if (isOpen) setDraft(value ?? getThisWeekRange())
    setOpen(isOpen)
  }

  const daysSelected =
    draft?.from && draft?.to
      ? differenceInCalendarDays(draft.to, draft.from) + 1
      : 0

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between font-normal"
        onClick={() => handleOpenChange(true)}
      >
        <span className="flex items-center gap-2">
          <CalendarIcon className="size-4" />
          {label()}
        </span>
        <ChevronDownIcon className="size-4 text-muted-foreground" />
      </Button>

      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="max-h-[90vh] gap-0 overflow-y-auto rounded-t-2xl p-0"
        >
          <div className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-muted" />

          <SheetHeader className="flex-row items-center justify-between space-y-0">
            <SheetTitle>Date range</SheetTitle>
            <button
              type="button"
              className="text-sm text-muted-foreground"
              onClick={() => setDraft(undefined)}
            >
              Reset
            </button>
          </SheetHeader>

          <div className="flex gap-2 overflow-x-auto px-4 pb-3">
            {MOBILE_DATE_PRESETS.map((preset) => (
              <Button
                key={preset.label}
                type="button"
                size="sm"
                variant={
                  isPresetSelected(preset, draft) ? "secondary" : "outline"
                }
                className="shrink-0 rounded-full"
                onClick={() => setDraft(preset.getRange())}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 px-4 pb-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">From</label>
              <Input
                type="date"
                value={toInputValue(draft?.from)}
                onChange={(e) =>
                  setDraft((prev) => ({
                    to: prev?.to,
                    from: fromInputValue(e.target.value),
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">To</label>
              <Input
                type="date"
                value={toInputValue(draft?.to)}
                onChange={(e) =>
                  setDraft((prev) => ({
                    from: prev?.from,
                    to: fromInputValue(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="px-4 pb-3">
            <Calendar
              mode="range"
              navLayout="around"
              month={month}
              onMonthChange={setMonth}
              selected={draft}
              onSelect={setDraft}
              numberOfMonths={1}
              className="w-full rounded-lg"
              weekStartsOn={1}
              classNames={{
                root: "w-full",
                months: "w-full",
                month:
                  "grid w-full grid-cols-[auto_1fr_auto] items-center gap-y-2 [&>*:last-child]:col-span-3",
                month_caption:
                  "flex h-(--cell-size) items-center justify-center",
              }}
            />
          </div>

          <div className="flex flex-col gap-3 border-t p-4">
            <p className="text-sm text-muted-foreground">
              {daysSelected > 0
                ? `${daysSelected} day${daysSelected > 1 ? "s" : ""} selected`
                : "No dates selected"}
              {draft?.from && draft?.to && (
                <span className="ml-1 text-foreground">
                  {format(draft.from, "MMM d")} - {format(draft.to, "MMM d")}
                </span>
              )}
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={() => {
                  onApply?.(draft)
                  setOpen(false)
                }}
              >
                Apply range
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
