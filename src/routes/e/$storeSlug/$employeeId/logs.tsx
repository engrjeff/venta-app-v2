import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { AttendanceLogItem } from "@/features/attendance/attendance-log-item"
import { attendanceApi } from "@/features/attendance/attendance.functions"
import { createFileRoute } from "@tanstack/react-router"
import { InboxIcon } from "lucide-react"
import z from "zod"

const logsSearchSchema = z.object({
  start: z.iso.date().optional(),
  end: z.iso.date().optional(),
})

export const Route = createFileRoute("/e/$storeSlug/$employeeId/logs")({
  component: RouteComponent,
  validateSearch: logsSearchSchema,
  loaderDeps: ({ search: { start, end } }) => ({ start, end }),
  loader: async ({ params, deps: { start, end } }) => {
    const logs = await attendanceApi.getHistoryByEmployee({
      data: {
        employeeId: params.employeeId,
        start,
        end,
      },
    })

    return logs
  },
})

function RouteComponent() {
  const loaderData = Route.useLoaderData()

  if (loaderData.error) return <p>An error occured</p>

  if (!loaderData.data?.length)
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <InboxIcon />
          </EmptyMedia>
          <EmptyTitle>No attendance logs yet</EmptyTitle>
          <EmptyDescription>Attendance logs will appear here.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )

  const logs = loaderData.data

  const { employeeId } = Route.useParams()

  return (
    <>
      <div>
        <h2 className="font-bold">Attendance Logs</h2>
      </div>
      <ul className="space-y-3">
        {logs.map((log) => {
          if (!log.attendanceSnapshot) return null

          return (
            <li key={log.id}>
              <AttendanceLogItem log={log} employeeId={employeeId} />
            </li>
          )
        })}
      </ul>
    </>
  )
}
