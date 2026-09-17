import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

function StatCardRoot({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-card"
      className={cn(
        "flex flex-col gap-2 rounded-md bg-card p-4 ring-1 ring-foreground/10",
        className
      )}
      {...props}
    />
  )
}

function StatCardLabel({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="stat-card-label"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function StatCardValue({
  className,
  numeric = false,
  ...props
}: ComponentProps<"p"> & { numeric?: boolean }) {
  return (
    <p
      data-slot="stat-card-value"
      className={cn(
        "text-3xl font-semibold",
        numeric && "font-mono",
        className
      )}
      {...props}
    />
  )
}

function StatCardCaption({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="stat-card-caption"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

export const StatCard = Object.assign(StatCardRoot, {
  Label: StatCardLabel,
  Value: StatCardValue,
  Caption: StatCardCaption,
})
