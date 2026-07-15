/*
  Warnings:

  - You are about to drop the column `branchId` on the `employee` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "employee" DROP CONSTRAINT "employee_branchId_fkey";

-- DropIndex
DROP INDEX "employee_branchId_idx";

-- AlterTable
ALTER TABLE "employee" DROP COLUMN "branchId";

-- CreateTable
CREATE TABLE "employee_branch" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_branch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "employee_branch_employeeId_idx" ON "employee_branch"("employeeId");

-- CreateIndex
CREATE INDEX "employee_branch_branchId_idx" ON "employee_branch"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "employee_branch_employeeId_branchId_key" ON "employee_branch"("employeeId", "branchId");

-- AddForeignKey
ALTER TABLE "employee_branch" ADD CONSTRAINT "employee_branch_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_branch" ADD CONSTRAINT "employee_branch_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
