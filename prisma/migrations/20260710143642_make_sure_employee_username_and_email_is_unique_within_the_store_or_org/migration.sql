/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,username]` on the table `employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organizationId,email]` on the table `employee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "employee_username_idx" ON "employee"("username");

-- CreateIndex
CREATE INDEX "employee_email_idx" ON "employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employee_organizationId_username_key" ON "employee"("organizationId", "username");

-- CreateIndex
CREATE UNIQUE INDEX "employee_organizationId_email_key" ON "employee"("organizationId", "email");
