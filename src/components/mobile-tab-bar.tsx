import { Link } from "@tanstack/react-router"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export interface MobileTabBarTab {
  id: string
  label: string
  icon: LucideIcon
  to?: string
  onClick?: () => void
}

interface MobileTabBarProps {
  tabs: MobileTabBarTab[]
  activeTab: string
}

export function MobileTabBar({ tabs, activeTab }: MobileTabBarProps) {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-20 border-t bg-accent py-2 backdrop-blur-lg supports-backdrop-filter:bg-accent/60 md:hidden"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab

          const content = (
            <>
              <tab.icon
                className={cn(
                  "size-5 text-muted-foreground",
                  isActive && "text-chart-2"
                )}
              />
              <span
                className={cn(
                  "text-[10.5px] text-muted-foreground",
                  isActive && "font-medium text-chart-2"
                )}
              >
                {tab.label}
              </span>
            </>
          )

          const itemClassName =
            "flex min-h-12 flex-1 flex-col items-center justify-center gap-1 outline-none active:scale-95"

          if (tab.to) {
            return (
              <Link key={tab.id} to={tab.to} className={itemClassName}>
                {content}
              </Link>
            )
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={tab.onClick}
              className={itemClassName}
            >
              {content}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
