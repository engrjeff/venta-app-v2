import { Link } from "@tanstack/react-router"
import {
  ClockIcon,
  FileTextIcon,
  HomeIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: HomeIcon },
  { label: "Timesheet", to: "/timesheet", icon: ClockIcon },
  { label: "Requests", to: "/requests", icon: FileTextIcon },
  { label: "Employees", to: "/employees", icon: UsersIcon },
  { label: "Settings", to: "/settings", icon: SettingsIcon },
] as const

export function AppBottomNav() {
  return (
    <nav
      aria-label="Admin navigation"
      className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/80 backdrop-blur-lg supports-backdrop-filter:bg-background/60 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex h-16 max-w-lg items-stretch justify-around">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: false }}
            className="flex flex-1 flex-col items-center justify-center gap-1 outline-none active:scale-95"
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full transition-colors",
                    isActive && "bg-primary/10"
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-5 text-muted-foreground",
                      isActive && "text-primary"
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "text-[11px] font-medium text-muted-foreground",
                    isActive && "text-primary"
                  )}
                >
                  {item.label}
                </span>
              </>
            )}
          </Link>
        ))}
      </div>
    </nav>
  )
}
