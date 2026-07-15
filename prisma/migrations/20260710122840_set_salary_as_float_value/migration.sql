/*
  Warnings:

  - You are about to alter the column `salaryRate` on the `designation` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "designation" ALTER COLUMN "salaryRate" SET DATA TYPE DOUBLE PRECISION;
