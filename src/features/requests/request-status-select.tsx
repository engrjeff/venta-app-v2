import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { AttendanceRequestStatus } from "@/generated/prisma/enums"
import { ATTENDANCE_REQUEST_STATUS_LABELS } from "./request-labels"

interface RequestStatusSelectProps {
  value?: AttendanceRequestStatus
  onChange: (value: AttendanceRequestStatus | undefined) => void
}

export function RequestStatusSelect({
  value,
  onChange,
}: RequestStatusSelectProps) {
  return (
    <NativeSelect
      aria-label="Filter by status"
      value={value ?? ""}
      onChange={(e) =>
        onChange(
          e.target.value
            ? (e.target.value as AttendanceRequestStatus)
            : undefined
        )
      }
    >
      <NativeSelectOption value="">All statuses</NativeSelectOption>
      {Object.values(AttendanceRequestStatus).map((status) => (
        <NativeSelectOption key={status} value={status}>
          {ATTENDANCE_REQUEST_STATUS_LABELS[status]}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  )
}
