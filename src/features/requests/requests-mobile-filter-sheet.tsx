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
import { AttendanceRequestType } from "@/generated/prisma/enums"
import { useLoaderData, useNavigate, useSearch } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { ATTENDANCE_REQUEST_TYPE_LABELS } from "./request-labels"

const ALL = "__all__"

export function RequestsMobileFilterSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { employees } = useLoaderData({ from: "/_protected/requests" })
  const search = useSearch({ from: "/_protected/requests" })
  const navigate = useNavigate({ from: "/requests" })

  const [employeeId, setEmployeeId] = useState(
    search.employees?.value[0] ?? ALL
  )
  const [type, setType] = useState(search.type?.value[0] ?? ALL)

  useEffect(() => {
    if (!open) return

    setEmployeeId(search.employees?.value[0] ?? ALL)
    setType(search.type?.value[0] ?? ALL)
  }, [open, search.employees, search.type])

  function handleApply() {
    navigate({
      search: (prev) => ({
        ...prev,
        employees:
          employeeId === ALL
            ? undefined
            : { operator: "is", value: [employeeId] },
        type:
          type === ALL
            ? undefined
            : { operator: "is", value: [type as AttendanceRequestType] },
      }),
    })
    onOpenChange(false)
  }

  function handleClearAll() {
    setEmployeeId(ALL)
    setType(ALL)
  }

  const selectedEmployee = employees.find(
    (employee) => employee.id === employeeId
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
            <label className="text-xs text-muted-foreground">
              Request Type
            </label>
            <Select value={type} onValueChange={(v) => setType(v ?? ALL)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All types">
                  {() =>
                    type === ALL
                      ? "All types"
                      : ATTENDANCE_REQUEST_TYPE_LABELS[
                          type as AttendanceRequestType
                        ]
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All types</SelectItem>
                {Object.values(AttendanceRequestType).map((requestType) => (
                  <SelectItem key={requestType} value={requestType}>
                    {ATTENDANCE_REQUEST_TYPE_LABELS[requestType]}
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
