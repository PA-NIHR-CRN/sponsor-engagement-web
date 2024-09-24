/*
  Warnings:

  - Added the required column `studyStatusGroup` to the `StudyUpdates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `StudyUpdates` ADD COLUMN `studyStatusGroup` VARCHAR(191) NOT NULL,
    MODIFY `studyStatus` VARCHAR(191) NULL;
