import { useSearch } from "@tanstack/react-router"
import { useState } from "react"
import { TimesheetMobileFilterSheet } from "./timesheet-mobile-filter-sheet"
import { TimesheetMobileHeader } from "./timesheet-mobile-header"
import { TimesheetMobileList } from "./timesheet-mobile-list"
import { TimesheetMobileSearch } from "./timesheet-mobile-search"
import { TimesheetMobileToolbar } from "./timesheet-mobile-toolbar"
import { countActiveTimesheetFilters } from "./timesheet.utils"

export function TimesheetMobileScreen() {
  const search = useSearch({ from: "/_protected/timesheet" })
  const [searchOpen, setSearchOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)

  const activeFilterCount = countActiveTimesheetFilters(search)

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pb-24">
      <TimesheetMobileHeader
        activeFilterCount={activeFilterCount}
        onSearchClick={() => setSearchOpen(true)}
        onFilterClick={() => setFilterOpen(true)}
      />

      <TimesheetMobileToolbar />

      <TimesheetMobileList />

      <TimesheetMobileSearch open={searchOpen} onOpenChange={setSearchOpen} />
      <TimesheetMobileFilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
      />
    </div>
  )
}
