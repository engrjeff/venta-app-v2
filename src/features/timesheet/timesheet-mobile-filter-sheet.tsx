import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useLoaderData, useNavigate, useSearch } from "@tanstack/react-router"
import { useEffect, useState } from "react"

const ALL = "__all__"

export function TimesheetMobileFilterSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { employees, branches, designations } = useLoaderData({
    from: "/_protected/timesheet",
  })
  const search = useSearch({ from: "/_protected/timesheet" })
  const navigate = useNavigate({ from: "/timesheet" })

  const [employeeId, setEmployeeId] = useState(
    search.employees?.value[0] ?? ALL
  )
  const [branchId, setBranchId] = useState(search.branches?.value[0] ?? ALL)
  const [designationId, setDesignationId] = useState(
    search.designations?.value[0] ?? ALL
  )

  useEffect(() => {
    if (!open) return

    setEmployeeId(search.employees?.value[0] ?? ALL)
    setBranchId(search.branches?.value[0] ?? ALL)
    setDesignationId(search.designations?.value[0] ?? ALL)
  }, [open, search.employees, search.branches, search.designations])

  function handleApply() {
    navigate({
      search: (prev) => ({
        ...prev,
        employees:
          employeeId === ALL
            ? undefined
            : { operator: "is", value: [employeeId] },
        branches:
          branchId === ALL ? undefined : { operator: "is", value: [branchId] },
        designations:
          designationId === ALL
            ? undefined
            : { operator: "is", value: [designationId] },
      }),
    })
    onOpenChange(false)
  }

  function handleClearAll() {
    setEmployeeId(ALL)
    setBranchId(ALL)
    setDesignationId(ALL)
  }

  const selectedEmployee = employees.find(
    (employee) => employee.id === employeeId
  )
  const selectedBranch = branches.find((branch) => branch.id === branchId)
  const selectedDesignation = designations.find(
    (designation) => designation.id === designationId
  )

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="gap-0 rounded-t-2xl p-0"
      >
        <div className="mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full bg-muted" />

        <SheetHeader className="flex-row items-center justify-between space-y-0">
          <SheetTitle>Filters</SheetTitle>
          <button
            type="button"
            className="text-sm text-muted-foreground"
            onClick={handleClearAll}
          >
            Clear all
          </button>
        </SheetHeader>

        <div className="flex flex-col gap-4 p-4 pt-0">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Employee</label>
            <Select
              value={employeeId}
              onValueChange={(v) => setEmployeeId(v ?? ALL)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All employees">
                  {() =>
                    selectedEmployee
                      ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
                      : "All employees"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All employees</SelectItem>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Branch</label>
            <Select
              value={branchId}
              onValueChange={(v) => setBranchId(v ?? ALL)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All branches">
                  {() => selectedBranch?.name ?? "All branches"}
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
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Designation</label>
            <Select
              value={designationId}
              onValueChange={(v) => setDesignationId(v ?? ALL)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All designations">
                  {() => selectedDesignation?.name ?? "All designations"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All designations</SelectItem>
                {designations.map((designation) => (
                  <SelectItem key={designation.id} value={designation.id}>
                    {designation.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 border-t p-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" className="flex-1" onClick={handleApply}>
            Show results
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
