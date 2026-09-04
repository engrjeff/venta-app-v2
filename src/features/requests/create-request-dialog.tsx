import { ResponsiveFormSheet } from "@/components/responsive-form-sheet"
import { CreateRequestForm } from "./create-request-form"

interface CreateRequestDialogProps {
  attendanceId: string
  employeeId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateRequestDialog({
  attendanceId,
  employeeId,
  open,
  onOpenChange,
}: CreateRequestDialogProps) {
  const close = () => onOpenChange(false)

  return (
    <ResponsiveFormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Create Request"
      description="Let your admin know what happened on this day."
    >
      <CreateRequestForm
        attendanceId={attendanceId}
        employeeId={employeeId}
        onAfterSave={close}
        onCancel={close}
      />
    </ResponsiveFormSheet>
  )
}
