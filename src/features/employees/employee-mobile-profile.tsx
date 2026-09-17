import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AttendanceStatus } from "@/generated/prisma/enums"
import { getInitials } from "@/lib/utils"
import { useNavigate } from "@tanstack/react-router"
import { ClockIcon, PencilIcon } from "lucide-react"
import { useState } from "react"
import { EditEmployeeDialog } from "./edit-employee-dialog"
import type { ExtendedEmployee } from "./employee.types"
import { UpdateEmployeeForm } from "./update-employee-form"

export function EmployeeMobileProfile({
  employee,
  activeAttendanceStatus,
}: {
  employee: ExtendedEmployee
  activeAttendanceStatus: AttendanceStatus | null
}) {
  const navigate = useNavigate()
  const [editOpen, setEditOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4 px-4">
      <div className="flex items-center gap-3">
        <Avatar size="lg">
          <AvatarFallback className="text-base font-semibold">
            {getInitials(employee.firstName, employee.lastName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-lg font-semibold">
            {employee.firstName} {employee.lastName}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {activeAttendanceStatus && (
              <Badge variant={activeAttendanceStatus}>
                {activeAttendanceStatus === AttendanceStatus.ON_BREAK
                  ? "On break"
                  : "Working now"}
              </Badge>
            )}
            <span className="font-mono text-xs text-muted-foreground">
              {employee.username}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setEditOpen(true)}
        >
          <PencilIcon /> Edit
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            navigate({
              to: "/timesheet",
              search: { employees: { operator: "is", value: [employee.id] } },
            })
          }
        >
          <ClockIcon /> Timesheet
        </Button>
      </div>

      <EditEmployeeDialog
        employee={employee}
        open={editOpen}
        onOpenChange={setEditOpen}
      >
        <UpdateEmployeeForm
          employee={employee}
          onAfterSave={() => setEditOpen(false)}
        />
      </EditEmployeeDialog>
    </div>
  )
}
