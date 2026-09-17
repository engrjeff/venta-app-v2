import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

function PageHeaderRoot({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header"
      className={cn("flex h-16 items-center gap-4 border-b px-6", className)}
      {...props}
    />
  )
}

function PageHeaderHeading({ className, ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="page-header-heading" className={cn(className)} {...props} />
  )
}

function PageHeaderTitle({ className, ...props }: ComponentProps<"h1">) {
  return (
    <h1
      data-slot="page-header-title"
      className={cn("text-base font-semibold", className)}
      {...props}
    />
  )
}

function PageHeaderSubtitle({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="page-header-subtitle"
      className={cn("text-xs", className)}
      {...props}
    />
  )
}

function PageHeaderActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-actions"
      className={cn("ml-auto flex items-center gap-3", className)}
      {...props}
    />
  )
}

export const PageHeader = Object.assign(PageHeaderRoot, {
  Heading: PageHeaderHeading,
  Title: PageHeaderTitle,
  Subtitle: PageHeaderSubtitle,
  Actions: PageHeaderActions,
})
