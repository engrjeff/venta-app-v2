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
import { AttendanceRequestType } from "@/generated/prisma/enums"
import { useLoaderData, useNavigate, useSearch } from "@tanstack/react-router"
import { ATTENDANCE_REQUEST_TYPE_LABELS } from "./request-labels"

export function RequestsFilters() {
  const { requests, employees, branches } = useLoaderData({
    from: "/_protected/requests",
  })

  const search = useSearch({ from: "/_protected/requests" })
  const navigate = useNavigate({ from: "/requests" })

  if (requests.error) {
    return <p>An Error has occured</p>
  }

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

  const typeFilter: FilterField = {
    id: "type",
    label: "Request Type",
    type: "select",
    options: Object.values(AttendanceRequestType).map((type) => ({
      label: ATTENDANCE_REQUEST_TYPE_LABELS[type],
      value: type,
    })),
  }

  const filterFields = [employeeFilter, branchFilter, typeFilter]

  const activeFilters = queryToFilterRules(
    {
      employees: search.employees,
      branches: search.branches,
      type: search.type,
    },
    filterFields
  )

  return (
    <div className="flex items-center justify-between gap-4 px-6">
      <FilterBuilder
        fields={filterFields}
        value={activeFilters}
        onApply={(filterRules) =>
          navigate({
            search: (prev) => ({
              ...prev,
              ...rulesToQuery(filterRules),
            }),
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
        onApply={(rangeQuery) => {
          navigate({
            search: (prev) => ({
              ...prev,
              ...rangeToSearch(rangeQuery),
            }),
          })
        }}
      />
    </div>
  )
}
