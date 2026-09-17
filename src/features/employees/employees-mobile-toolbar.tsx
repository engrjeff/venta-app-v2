import { FilterTabs } from "@/components/filter-tabs"
import { SearchInput } from "@/components/search-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EmploymentStatus } from "@/generated/prisma/enums"
import { useLoaderData, useNavigate, useSearch } from "@tanstack/react-router"
import { MapPinIcon } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import type { ExtendedEmployee } from "./employee.types"

const ALL = "__all__"

export function EmployeesMobileToolbar({
  employees,
  statusFilter,
  onStatusFilterChange,
}: {
  employees: ExtendedEmployee[]
  statusFilter: EmploymentStatus
  onStatusFilterChange: (status: EmploymentStatus) => void
}) {
  const loaderData = useLoaderData({ from: "/_protected/employees/" })
  const branches = loaderData?.branches ?? []
  const search = useSearch({ from: "/_protected/employees/" })
  const navigate = useNavigate({ from: "/employees/" })

  const [query, setQuery] = useState(search.q ?? "")

  // keep in sync when `q` changes from elsewhere (e.g. the desktop filters'
  // own search input, browser back/forward), otherwise this component's
  // debounced onChange would eventually fire with a stale value and
  // clobber the `q` the other source just set.
  useEffect(() => {
    setQuery(search.q ?? "")
  }, [search.q])

  const handleSearch = useCallback(
    (q: string) => {
      if ((search.q ?? "") === q) return

      navigate({
        search: (prev) => ({ ...prev, q: q || undefined }),
        replace: true,
      })
    },
    [navigate, search.q]
  )

  const activeCount = employees.filter(
    (employee) => employee.status === EmploymentStatus.ACTIVE
  ).length
  const inactiveCount = employees.filter(
    (employee) => employee.status === EmploymentStatus.INACTIVE
  ).length

  const selectedBranchId = search.branches?.value[0] ?? ALL
  const selectedBranch = branches.find(
    (branch) => branch.id === selectedBranchId
  )

  function handleBranchChange(value: string | null) {
    navigate({
      search: (prev) => ({
        ...prev,
        branches:
          !value || value === ALL
            ? undefined
            : { operator: "is", value: [value] },
      }),
    })
  }

  return (
    <div className="flex flex-col gap-4 px-4">
      <SearchInput
        placeholder="Search employees"
        value={query}
        onValueChange={setQuery}
        onChange={handleSearch}
        className="max-w-none"
      />

      <div className="flex items-center justify-between gap-2">
        <Select value={selectedBranchId} onValueChange={handleBranchChange}>
          <SelectTrigger>
            <MapPinIcon className="size-3.5 text-muted-foreground" />
            <SelectValue placeholder="Branch">
              {() => selectedBranch?.name ?? "Branch"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All branches</SelectItem>
            {branches.map((branch) => (
              <SelectItem key={branch.id} value={branch.id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <FilterTabs className="hidden">
          <FilterTabs.Link
            active={statusFilter === EmploymentStatus.ACTIVE}
            onClick={() => onStatusFilterChange(EmploymentStatus.ACTIVE)}
          >
            Active <FilterTabs.Badge>{activeCount}</FilterTabs.Badge>
          </FilterTabs.Link>
          <FilterTabs.Link
            active={statusFilter === EmploymentStatus.INACTIVE}
            onClick={() => onStatusFilterChange(EmploymentStatus.INACTIVE)}
          >
            Inactive <FilterTabs.Badge>{inactiveCount}</FilterTabs.Badge>
          </FilterTabs.Link>
        </FilterTabs>
      </div>
    </div>
  )
}
