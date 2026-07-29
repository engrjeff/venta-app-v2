/*
  Warnings:

  - You are about to drop the column `totalTimeWorked` on the `attendance` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('WORKING', 'ON_BREAK', 'CLOCKED_OUT');

-- AlterTable
ALTER TABLE "attendance" DROP COLUMN "totalTimeWorked",
ADD COLUMN     "breakStartedAt" TIMESTAMP(3),
ADD COLUMN     "status" "AttendanceStatus" NOT NULL DEFAULT 'WORKING',
ADD COLUMN     "totalBreakSeconds" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalWorkedSeconds" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "AttendanceBreak" (
    "id" TEXT NOT NULL,
    "attendanceId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "durationSeconds" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AttendanceBreak_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AttendanceBreak_attendanceId_idx" ON "AttendanceBreak"("attendanceId");

-- AddForeignKey
ALTER TABLE "AttendanceBreak" ADD CONSTRAINT "AttendanceBreak_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "attendance"("id") ON DELETE CASCADE ON UPDATE CASCADE;
