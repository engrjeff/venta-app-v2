import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"
import { PencilIcon } from "lucide-react"
import { useState } from "react"
import { EditEmployeeDialog } from "./edit-employee-dialog"
import { EmployeeActions } from "./employee-actions"
import type { ExtendedEmployee } from "./employee.types"
import { UpdateEmployeeForm } from "./update-employee-form"

export function EmployeeDetailHeader({
  employee,
}: {
  employee: ExtendedEmployee
}) {
  const [editOpen, setEditOpen] = useState(false)

  return (
    <div className="flex items-center justify-between border-b px-6 py-4">
      <div className="flex items-center gap-2 text-sm">
        <Link
          to="/employees"
          className="text-muted-foreground hover:text-foreground"
        >
          Employees
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="font-semibold">
          {employee.firstName} {employee.lastName}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setEditOpen(true)}
        >
          <PencilIcon /> Edit Details
        </Button>
        <EmployeeActions employee={employee} />
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
