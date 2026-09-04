import { useLoaderData, useNavigate, useSearch } from "@tanstack/react-router"

import { DateRangeFilter } from "@/components/date-range-filter/date-range-filter"
import { getThisWeekRange } from "@/components/date-range-filter/presets"
import {
  rangeToSearch,
  searchToRange,
} from "@/components/date-range-filter/utils"
import type { FilterField } from "@/components/filter-builder/filter-builder"
import {
  FilterBuilder,
  queryToFilterRules,
  rulesToQuery,
} from "@/components/filter-builder/filter-builder"

export function TimesheetMobileFilters() {
  const { employees, branches, designations } = useLoaderData({
    from: "/_protected/timesheet",
  })
  const search = useSearch({ from: "/_protected/timesheet" })
  const navigate = useNavigate({ from: "/timesheet" })

  const range = searchToRange(search) ?? getThisWeekRange()

  const employeeFilter: FilterField = {
    id: "employees",
    label: "Employee",
    type: "select",
    options: employees.map((e) => ({
      value: e.id,
      label: `${e.firstName} ${e.lastName}`,
      renderAs: (
        <div className="flex flex-col">
          <span className="text-xs">{`${e.firstName} ${e.lastName}`}</span>
          <span className="text-xs text-muted-foreground">
            {e.designation.name}
          </span>
        </div>
      ),
    })),
  }

  const branchFilter: FilterField = {
    id: "branches",
    label: "Branch",
    type: "select",
    options: branches.map((b) => ({
      label: b.name,
      value: b.id,
    })),
  }

  const designationFilter: FilterField = {
    id: "designations",
    label: "Designation",
    type: "select",
    options: designations.map((d) => ({
      label: d.name,
      value: d.id,
    })),
  }

  const filterFields = [employeeFilter, branchFilter, designationFilter]

  const activeFilters = queryToFilterRules(
    {
      employees: search.employees,
      branches: search.branches,
      designations: search.designations,
    },
    filterFields
  )

  return (
    <div className="flex flex-wrap items-center gap-2 lg:hidden">
      <FilterBuilder
        fields={filterFields}
        value={activeFilters}
        onApply={(filterRules) =>
          navigate({
            search: (prev) => ({ ...prev, ...rulesToQuery(filterRules) }),
          })
        }
        onChange={(filterRules) =>
          navigate({
            search: (prev) => ({
              start: prev.start,
              end: prev.end,
              ...rulesToQuery(filterRules),
            }),
          })
        }
      />

      <DateRangeFilter
        value={range}
        presetsOnly
        onApply={(rangeQuery) =>
          navigate({
            search: (prev) => ({ ...prev, ...rangeToSearch(rangeQuery) }),
          })
        }
      />
    </div>
  )
}
