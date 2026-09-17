import type {
  AttendanceRecord,
  AttendanceRow,
  EmployeeRosterEntry,
} from "./dashboard.types"

export function buildRows(
  employees: EmployeeRosterEntry[],
  attendanceRecords: AttendanceRecord[]
): AttendanceRow[] {
  const attendanceByEmployeeId = new Map(
    attendanceRecords.map((attendance) => [attendance.employeeId, attendance])
  )

  return employees.map((employee) => {
    const attendance = attendanceByEmployeeId.get(employee.id)

    if (attendance) {
      return {
        key: attendance.id,
        employeeId: employee.id,
        employee: attendance.employee,
        branch: attendance.branch,
        status: attendance.status,
        timeIn: attendance.timeIn,
        timeOut: attendance.timeOut,
      }
    }

    const primaryBranch =
      employee.branches.find((eb) => eb.isPrimary)?.branch ??
      employee.branches[0]?.branch

    return {
      key: `not-clocked-in-${employee.id}`,
      employeeId: employee.id,
      employee,
      branch: primaryBranch,
      status: undefined,
      timeIn: null,
      timeOut: null,
    }
  })
}
