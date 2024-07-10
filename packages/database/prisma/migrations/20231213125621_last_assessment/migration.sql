/*
  Warnings:

  - A unique constraint covering the columns `[lastAssessmentId]` on the table `Study` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Study` ADD COLUMN `lastAssessmentId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Study_lastAssessmentId_key` ON `Study`(`lastAssessmentId`);

-- AddForeignKey
ALTER TABLE `Study` ADD CONSTRAINT `Study_lastAssessmentId_fkey` FOREIGN KEY (`lastAssessmentId`) REFERENCES `Assessment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
