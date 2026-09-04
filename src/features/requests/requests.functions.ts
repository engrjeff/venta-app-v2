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
} from "./schema"

export const createRequestFn = createServerFn({ method: "POST" })
  .inputValidator(createAttendanceRequestSchema)
  .handler(async ({ data }) => {
    return createAttendanceRequest(data)
  })

export const getByEmployeeFn = createServerFn({ method: "GET" })
  .inputValidator(attendanceRequestsByEmployeeSchema)
  .handler(async ({ data }) => {
    return getAttendanceRequestsByEmployee(data)
  })

export const getByStoreFn = createServerFn({ method: "GET" })
  .inputValidator(attendanceRequestsByStoreSchema)
  .handler(async ({ data }) => {
    return getAttendanceRequestsByStore(data)
  })

export const approveFn = createServerFn({ method: "POST" })
  .inputValidator(attendanceRequestIdSchema)
  .handler(async ({ data }) => {
    return approveAttendanceRequest(data)
  })

export const declineFn = createServerFn({ method: "POST" })
  .inputValidator(attendanceRequestIdSchema)
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
