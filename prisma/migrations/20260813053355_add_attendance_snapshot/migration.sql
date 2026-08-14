-- CreateTable
CREATE TABLE "attendance_snapshot" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "attendanceId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "employeeNumber" TEXT,
    "employeeFirstName" TEXT NOT NULL,
    "employeeLastName" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "branchName" TEXT NOT NULL,
    "designationId" TEXT NOT NULL,
    "designationName" TEXT NOT NULL,
    "salaryType" "SalaryType" NOT NULL,
    "salaryRate" DOUBLE PRECISION NOT NULL,
    "scheduleStartTime" TIME(0) NOT NULL,
    "scheduleEndTime" TIME(0) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attendance_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attendance_snapshot_attendanceId_key" ON "attendance_snapshot"("attendanceId");

-- CreateIndex
CREATE INDEX "attendance_snapshot_employeeId_idx" ON "attendance_snapshot"("employeeId");

-- CreateIndex
CREATE INDEX "attendance_snapshot_branchId_idx" ON "attendance_snapshot"("branchId");

-- CreateIndex
CREATE INDEX "attendance_snapshot_designationId_idx" ON "attendance_snapshot"("designationId");

-- CreateIndex
CREATE INDEX "attendance_snapshot_organizationId_idx" ON "attendance_snapshot"("organizationId");

-- AddForeignKey
ALTER TABLE "attendance_snapshot" ADD CONSTRAINT "attendance_snapshot_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_snapshot" ADD CONSTRAINT "attendance_snapshot_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "attendance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
