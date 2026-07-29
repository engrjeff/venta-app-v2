/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,id,email]` on the table `employee` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "employee_organizationId_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "employee_organizationId_id_email_key" ON "employee"("organizationId", "id", "email");
