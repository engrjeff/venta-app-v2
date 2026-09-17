import type { FilterField } from "@/components/filter-builder/filter-builder"
import {
  FilterBuilder,
  queryToFilterRules,
  rulesToQuery,
} from "@/components/filter-builder/filter-builder"
import { SearchInput } from "@/components/search-input"
import { useLoaderData, useNavigate, useSearch } from "@tanstack/react-router"
import { useCallback, useEffect, useState } from "react"

export function EmployeesFilters() {
  const loaderData = useLoaderData({
    from: "/_protected/employees/",
  })

  const search = useSearch({ from: "/_protected/employees/" })
  const navigate = useNavigate({ from: "/employees/" })

  const [query, setQuery] = useState(search.q ?? "")

  // keep in sync when `q` changes from elsewhere (e.g. the mobile toolbar's
  // own search input, browser back/forward), otherwise this component's
  // debounced onChange would eventually fire with a stale value and
  // clobber the `q` the other source just set.
  useEffect(() => {
    setQuery(search.q ?? "")
  }, [search.q])

  const branches = loaderData?.branches ?? []
  const designations = loaderData?.designations ?? []

  const handleSearch = useCallback(
    (q: string) => {
      if ((search.q ?? "") === q) return

      navigate({
        search: (prev) => ({
          ...prev,
          q: q || undefined,
        }),
        replace: true,
      })
    },
    [navigate, search.q]
  )

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

  const filterFields = [branchFilter, designationFilter]

  const activeFilters = queryToFilterRules(
    {
      branches: search.branches,
      designations: search.designations,
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
              q: prev.q,
              ...rulesToQuery(filterRules),
            }),
          })
        }
      />

      <SearchInput
        placeholder="Search employees"
        value={query}
        onValueChange={setQuery}
        onChange={handleSearch}
        className="h-8 max-w-xs"
      />
    </div>
  )
}
