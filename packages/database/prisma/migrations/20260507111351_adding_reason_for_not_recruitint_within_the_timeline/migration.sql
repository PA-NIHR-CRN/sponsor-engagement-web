/*
  Warnings:

  - You are about to drop the column `willRecruitWithin90Days` on the `Study` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Study` DROP COLUMN `willRecruitWithin90Days`,
    ADD COLUMN `reasonNotRecruitingWithinTimeline` VARCHAR(191) NULL,
    ADD COLUMN `willRecruitWithinTimeline` BOOLEAN NOT NULL DEFAULT true;
