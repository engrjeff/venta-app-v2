import { Button } from "@/components/ui/button"
import type { Store } from "@/features/store/store.types"
import { format } from "date-fns"
import { BellIcon, StoreIcon } from "lucide-react"

export function DashboardMobileHeader({ store }: { store: Store }) {
  return (
    <div className="fixed inset-x-0 top-0 flex h-15.75 w-screen items-center gap-3 border-b bg-background px-4 py-2 backdrop-blur-lg supports-backdrop-filter:bg-background/60">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <StoreIcon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{store.name}</p>
        <p className="text-xs text-muted-foreground">
          {format(new Date(), "EEE, MMM d")} &middot; all branches
        </p>
      </div>
      <Button size="icon-sm" variant="outline" className="shrink-0">
        <BellIcon />
      </Button>
    </div>
  )
}
