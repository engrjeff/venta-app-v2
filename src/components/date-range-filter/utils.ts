import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

export function rangeToSearch(range?: DateRange) {
  return {
    start: range?.from ? format(range.from, "yyyy-MM-dd") : undefined,
    end: range?.to ? format(range.to, "yyyy-MM-dd") : undefined,
  }
}

export function searchToRange(search: {
  start?: string
  end?: string
}): DateRange | undefined {
  if (!search.start && !search.end) {
    return undefined
  }

  return {
    from: search.start ? new Date(search.start) : undefined,
    to: search.end ? new Date(search.end) : undefined,
  }
}
