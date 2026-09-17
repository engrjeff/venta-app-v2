import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useLoaderData } from "@tanstack/react-router"
import { SearchIcon } from "lucide-react"
import { useState } from "react"
import { TimesheetShiftCard } from "./timesheet-shift-card"

export function TimesheetMobileSearch({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { timesheets } = useLoaderData({ from: "/_protected/timesheet" })
  const [query, setQuery] = useState("")

  const records = timesheets.data ?? []

  const trimmedQuery = query.trim().toLowerCase()

  const matches = trimmedQuery
    ? records.filter((attendance) => {
        const name =
          `${attendance.attendanceSnapshot?.employeeFirstName ?? ""} ${attendance.attendanceSnapshot?.employeeLastName ?? ""}`
            .trim()
            .toLowerCase()

        return name.includes(trimmedQuery)
      })
    : []

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) setQuery("")
    onOpenChange(isOpen)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="h-[100dvh] gap-0 p-0"
      >
        <div className="flex items-center gap-2 border-b p-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              type="search"
              placeholder="Search by employee"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <button
            type="button"
            className="text-sm text-primary"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          {!trimmedQuery ? (
            <p className="pt-6 text-center text-sm text-muted-foreground">
              Search for an employee to view their shifts
            </p>
          ) : matches.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon" className="size-4">
                  <SearchIcon className="size-4" />
                </EmptyMedia>
                <EmptyDescription>No shifts found</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              <p className="text-xs font-medium text-muted-foreground">
                {matches.length} match{matches.length === 1 ? "" : "es"}
              </p>
              {matches.map((attendance) => (
                <TimesheetShiftCard
                  key={attendance.id}
                  attendance={attendance}
                />
              ))}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
