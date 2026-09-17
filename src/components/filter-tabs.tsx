import type { ComponentProps } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function FilterTabsRoot({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="filter-tabs"
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-md bg-muted p-0.5",
        className
      )}
      {...props}
    />
  )
}

function FilterTabsLink({
  className,
  active = false,
  ...props
}: ComponentProps<typeof Button> & { active?: boolean }) {
  return (
    <Button
      data-slot="filter-tabs-link"
      data-active={active || undefined}
      variant="ghost"
      size="sm"
      className={cn(
        "text-muted-foreground data-active:bg-background data-active:text-foreground data-active:shadow-sm dark:data-active:hover:bg-background",
        className
      )}
      {...props}
    />
  )
}

function FilterTabsBadge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="filter-tabs-badge"
      className={cn("inline-block px-0.5 text-chart-2", className)}
      {...props}
    />
  )
}

export const FilterTabs = Object.assign(FilterTabsRoot, {
  Link: FilterTabsLink,
  Badge: FilterTabsBadge,
})
