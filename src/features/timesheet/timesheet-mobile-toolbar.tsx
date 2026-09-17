import { DateRangeFilterMobile } from "@/components/date-range-filter/date-range-filter-mobile"
import { getThisWeekRange } from "@/components/date-range-filter/presets"
import {
  rangeToSearch,
  searchToRange,
} from "@/components/date-range-filter/utils"
import type { FilterField } from "@/components/filter-builder/filter-builder"
import {
  queryToFilterRules,
  rulesToQuery,
} from "@/components/filter-builder/filter-builder"
import { useLoaderData, useNavigate, useSearch } from "@tanstack/react-router"
import { XIcon } from "lucide-react"

export function TimesheetMobileToolbar() {
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
    })),
  }

  const branchFilter: FilterField = {
    id: "branches",
    label: "Branch",
    type: "select",
    options: branches.map((b) => ({ label: b.name, value: b.id })),
  }

  const designationFilter: FilterField = {
    id: "designations",
    label: "Designation",
    type: "select",
    options: designations.map((d) => ({ label: d.name, value: d.id })),
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

  function removeRule(fieldId: string) {
    const nextRules = activeFilters.filter((rule) => rule.field !== fieldId)

    navigate({
      search: (prev) => ({
        start: prev.start,
        end: prev.end,
        ...rulesToQuery(nextRules),
      }),
    })
  }

  function clearAll() {
    navigate({ search: (prev) => ({ start: prev.start, end: prev.end }) })
  }

  return (
    <div className="flex flex-col gap-2 px-4">
      <DateRangeFilterMobile
        value={range}
        onApply={(rangeQuery) =>
          navigate({
            search: (prev) => ({ ...prev, ...rangeToSearch(rangeQuery) }),
          })
        }
      />

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeFilters.map((rule) => {
            const field = filterFields.find((f) => f.id === rule.field)
            const labels = rule.value.map(
              (val) =>
                field?.options?.find((option) => option.value === val)?.label ??
                val
            )

            return (
              <span
                key={rule.field}
                className="inline-flex items-center gap-1 rounded-full bg-muted py-1 pr-1.5 pl-2.5 text-xs"
              >
                {labels.join(", ")}
                <button
                  type="button"
                  aria-label={`Remove ${rule.label} filter`}
                  onClick={() => removeRule(rule.field)}
                >
                  <XIcon className="size-3" />
                </button>
              </span>
            )
          })}
          <button
            type="button"
            className="text-xs text-muted-foreground"
            onClick={clearAll}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
