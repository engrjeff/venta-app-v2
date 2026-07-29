/*
  Warnings:

  - Added the required column `scheduleEndTime` to the `branch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleStartTime` to the `branch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "branch" ADD COLUMN     "scheduleEndTime" TIME(0) NOT NULL,
ADD COLUMN     "scheduleStartTime" TIME(0) NOT NULL;
