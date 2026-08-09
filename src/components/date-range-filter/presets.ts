import {
  endOfMonth,
  endOfWeek,
  isSameDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subMonths,
  subWeeks,
} from "date-fns"
import type { DateRange } from "react-day-picker"

export type DatePreset = {
  label: string
  getRange: () => DateRange
}

export const DATE_PRESETS: DatePreset[] = [
  {
    label: "This Week",
    getRange: () => ({
      from: startOfWeek(new Date()),
      to: endOfWeek(new Date()),
    }),
  },
  {
    label: "Last Week",
    getRange: () => {
      const d = subWeeks(new Date(), 1)

      return {
        from: startOfWeek(d),
        to: endOfWeek(d),
      }
    },
  },
  {
    label: "This Month",
    getRange: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: "Last Month",
    getRange: () => {
      const d = subMonths(new Date(), 1)

      return {
        from: startOfMonth(d),
        to: endOfMonth(d),
      }
    },
  },
  {
    label: "Year-to-date",
    getRange: () => ({
      from: startOfYear(new Date()),
      to: new Date(),
    }),
  },
]

export function getThisWeekRange(): DateRange {
  return {
    from: startOfWeek(new Date()),
    to: endOfWeek(new Date()),
  }
}

export function isPresetSelected(preset: DatePreset, range?: DateRange) {
  if (!range?.from || !range.to) {
    return false
  }

  const presetRange = preset.getRange()

  return (
    presetRange.from &&
    presetRange.to &&
    isSameDay(range.from, presetRange.from) &&
    isSameDay(range.to, presetRange.to)
  )
}
