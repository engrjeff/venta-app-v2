/*
  Warnings:

  - Made the column `address` on table `branch` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "branch" ALTER COLUMN "address" SET NOT NULL;
