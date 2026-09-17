import { Button } from "@/components/ui/button"
import { useRouter } from "@tanstack/react-router"
import { ChevronLeftIcon } from "lucide-react"

export function EmployeesMobileHeader({ total }: { total: number }) {
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

      <p className="flex-1 text-lg font-semibold">Employees</p>

      <p className="text-sm text-muted-foreground">{total} total</p>
    </div>
  )
}
