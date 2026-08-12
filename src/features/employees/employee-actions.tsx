import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EmploymentStatus } from "@/generated/prisma/enums"
import { useNavigate } from "@tanstack/react-router"
import {
  EditIcon,
  ListIcon,
  MoreHorizontalIcon,
  RotateCcwIcon,
  RotateCwIcon,
  TrashIcon,
} from "lucide-react"
import { useState } from "react"
import { DeleteEmployeeDialog } from "./delete-employee-dialog"
import { EditEmployeeDialog } from "./edit-employee-dialog"
import type { ExtendedEmployee } from "./employee.types"
import { UpdateEmployeeForm } from "./update-employee-form"
import { UpdateEmployeeStatusDialog } from "./update-employee-status-dialog"

type EmployeeAction =
  | "view-attendance"
  | "edit"
  | "make-active"
  | "make-inactive"
  | "delete"

export function EmployeeActions({ employee }: { employee: ExtendedEmployee }) {
  const navigate = useNavigate()
  const [action, setAction] = useState<EmployeeAction>()

  function resetAction() {
    setAction(undefined)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              aria-label="Actions"
              variant="ghost"
              size="icon-sm"
            >
              <MoreHorizontalIcon />
            </Button>
          }
        />
        <DropdownMenuContent className="min-w-max" side="right">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setAction("edit")}>
              <EditIcon /> Update
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                navigate({
                  to: "/timesheet/$employeeId",
                  params: { employeeId: employee.id },
                })
              }
            >
              <ListIcon /> Attendance
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {employee.status === EmploymentStatus.ACTIVE ? (
              <DropdownMenuItem onClick={() => setAction("make-inactive")}>
                <RotateCcwIcon /> Make Inactive
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => setAction("make-active")}>
                <RotateCwIcon /> Make Active
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setAction("delete")}
            >
              <TrashIcon /> Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* edit dialog */}
      <EditEmployeeDialog
        employee={employee}
        open={action === "edit"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            resetAction()
          }
        }}
      >
        <UpdateEmployeeForm employee={employee} onAfterSave={resetAction} />
      </EditEmployeeDialog>

      {/* delete dialog */}
      <DeleteEmployeeDialog
        employee={employee}
        open={action === "delete"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            resetAction()
          }
        }}
        onAafterSave={resetAction}
      />

      {/* update status dialog */}
      <UpdateEmployeeStatusDialog
        employee={employee}
        open={action === "make-inactive"}
        status={EmploymentStatus.INACTIVE}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            resetAction()
          }
        }}
        onAafterSave={resetAction}
      />
      <UpdateEmployeeStatusDialog
        employee={employee}
        open={action === "make-active"}
        status={EmploymentStatus.ACTIVE}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            resetAction()
          }
        }}
        onAafterSave={resetAction}
      />
    </>
  )
}
