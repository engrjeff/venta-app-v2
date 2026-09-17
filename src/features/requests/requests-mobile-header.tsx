import { Button } from "@/components/ui/button"
import { useRouter } from "@tanstack/react-router"
import { ChevronLeftIcon, ListFilterIcon } from "lucide-react"

export function RequestsMobileHeader({
  activeFilterCount,
  onFilterClick,
}: {
  activeFilterCount: number
  onFilterClick: () => void
}) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Back"
        onClick={() => router.history.back()}
      >
        <ChevronLeftIcon />
      </Button>

      <p className="flex-1 text-lg font-semibold">Requests</p>

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="Filter requests"
        className="relative"
        onClick={onFilterClick}
      >
        <ListFilterIcon />
        {activeFilterCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            {activeFilterCount}
          </span>
        )}
      </Button>
    </div>
  )
}
