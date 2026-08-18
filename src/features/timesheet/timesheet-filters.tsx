import type { FilterField } from "@/components/filter-builder/filter-builder"
import { FilterBuilder } from "@/components/filter-builder/filter-builder"

const filterFields: FilterField<unknown>[] = [
  {
    id: "employees",
    label: "Employee",
    type: "select",
    options: [
      {
        value: "employee-1",
        label: "John Doe",
      },
      {
        value: "employee-2",
        label: "Jane Smith",
      },
      {
        value: "employee-3",
        label: "Peter Santos",
      },
      {
        value: "employee-4",
        label: "Maria Cruz",
      },
    ],
  },

  {
    id: "branches",
    label: "Branch",
    type: "select",
    options: [
      {
        value: "branch-1",
        label: "Main Branch",
      },
      {
        value: "branch-2",
        label: "Makati Branch",
      },
      {
        value: "branch-3",
        label: "Quezon City Branch",
      },
    ],
  },

  {
    id: "designations",
    label: "Designation",
    type: "select",
    options: [
      {
        value: "designation-1",
        label: "Manager",
      },
      {
        value: "designation-2",
        label: "Cashier",
      },
      {
        value: "designation-3",
        label: "Staff",
      },
    ],
  },
]

export function TimesheetFilters() {
  return (
    <div>
      <FilterBuilder
        fields={filterFields}
        onApply={(filterRules) => console.log(filterRules)}
      />
    </div>
  )
}
