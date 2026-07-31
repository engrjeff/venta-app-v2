import { siteConfig } from "@/config/site"
import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { formatDate } from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(
  firstName?: string | null,
  lastName?: string | null,
  name?: string | null
) {
  if (firstName || lastName) {
    return [firstName, lastName]
      .filter(Boolean)
      .map((n) => n![0].toUpperCase())
      .join("")
  }
  return name?.[0]?.toUpperCase() ?? "?"
}

export function generatePageTitle(title: string) {
  return `${title} | ${siteConfig.title}`
}

export function sleep(ms: number) {
  if (typeof window === "undefined") return

  if (typeof setTimeout === "undefined") return

  return new Promise((resolve) => setTimeout(resolve, ms))
}

export interface ScheduleTimeRange {
  formatted: string
  start: number
  end: number
}

export function formatScheduleTimeRange(
  startTime: string | Date,
  endTime: string | Date
): ScheduleTimeRange {
  const start = startTime instanceof Date ? startTime : new Date(startTime)
  const end = endTime instanceof Date ? endTime : new Date(endTime)

  const format = (date: Date) => {
    const hours = date.getUTCHours()
    const minutes = date.getUTCMinutes()

    const period = hours >= 12 ? "PM" : "AM"
    const hour12 = hours % 12 || 12

    return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`
  }

  return {
    formatted: `${format(start)} to ${format(end)}`,
    start: start.getUTCHours(),
    end: end.getUTCHours(),
  }
}

export function formatTime(time: string | Date) {
  const _time = time instanceof Date ? time : new Date(time)

  return formatDate(new Date(_time), "hh:mm aa")
}

export function formatPHP(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount)
}
