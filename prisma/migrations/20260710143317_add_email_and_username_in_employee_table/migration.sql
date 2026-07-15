/*
  Warnings:

  - Added the required column `username` to the `employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employee" ADD COLUMN     "email" TEXT,
ADD COLUMN     "username" TEXT NOT NULL;
