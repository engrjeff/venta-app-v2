import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Link } from "@tanstack/react-router"
import { ChevronRightIcon, TriangleAlertIcon } from "lucide-react"

export function EmployeePendingRequestsBanner({
  employeeId,
  count,
}: {
  employeeId: string
  count: number
}) {
  if (count === 0) return null

  return (
    <Item
      variant="outline"
      size="sm"
      render={
        <Link
          to="/requests"
          search={{ employees: { operator: "is", value: [employeeId] } }}
        />
      }
    >
      <ItemMedia variant="icon" className="text-amber-500">
        <TriangleAlertIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          {count} pending request{count > 1 ? "s" : ""}
        </ItemTitle>
      </ItemContent>
      <ChevronRightIcon className="size-4 text-muted-foreground" />
    </Item>
  )
}
