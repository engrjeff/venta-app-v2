import { createServerFn } from "@tanstack/react-start"
import {
  approveAttendanceRequest,
  createAttendanceRequest,
  declineAttendanceRequest,
  getAttendanceRequestsByEmployee,
  getAttendanceRequestsByStore,
} from "./requests.server"
import {
  attendanceRequestIdSchema,
  attendanceRequestsByEmployeeSchema,
  attendanceRequestsByStoreSchema,
  createAttendanceRequestSchema,
  declineAttendanceRequestSchema,
} from "./schema"

export const createRequestFn = createServerFn({ method: "POST" })
  .validator(createAttendanceRequestSchema)
  .handler(async ({ data }) => {
    return createAttendanceRequest(data)
  })

export const getByEmployeeFn = createServerFn({ method: "GET" })
  .validator(attendanceRequestsByEmployeeSchema)
  .handler(async ({ data }) => {
    return getAttendanceRequestsByEmployee(data)
  })

export const getByStoreFn = createServerFn({ method: "GET" })
  .validator(attendanceRequestsByStoreSchema)
  .handler(async ({ data }) => {
    return getAttendanceRequestsByStore(data)
  })

export const approveFn = createServerFn({ method: "POST" })
  .validator(attendanceRequestIdSchema)
  .handler(async ({ data }) => {
    return approveAttendanceRequest(data)
  })

export const declineFn = createServerFn({ method: "POST" })
  .validator(declineAttendanceRequestSchema)
  .handler(async ({ data }) => {
    return declineAttendanceRequest(data)
  })

export const requestsApi = {
  createRequestFn,
  getByEmployeeFn,
  getByStoreFn,
  approveFn,
  declineFn,
}
