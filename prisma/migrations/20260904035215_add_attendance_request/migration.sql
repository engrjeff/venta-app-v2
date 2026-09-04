-- CreateEnum
CREATE TYPE "AttendanceRequestType" AS ENUM ('FORGOT_TO_CLOCK_OUT');

-- CreateEnum
CREATE TYPE "AttendanceRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'DECLINED', 'CANCELLED');

-- CreateTable
CREATE TABLE "attendance_request" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "attendanceId" TEXT NOT NULL,
    "type" "AttendanceRequestType" NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "AttendanceRequestStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "attendance_request_organizationId_idx" ON "attendance_request"("organizationId");

-- CreateIndex
CREATE INDEX "attendance_request_employeeId_idx" ON "attendance_request"("employeeId");

-- CreateIndex
CREATE INDEX "attendance_request_attendanceId_idx" ON "attendance_request"("attendanceId");

-- AddForeignKey
ALTER TABLE "attendance_request" ADD CONSTRAINT "attendance_request_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_request" ADD CONSTRAINT "attendance_request_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_request" ADD CONSTRAINT "attendance_request_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "attendance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
