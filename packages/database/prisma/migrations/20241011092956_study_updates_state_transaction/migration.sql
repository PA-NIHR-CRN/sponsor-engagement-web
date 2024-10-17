/*
  Warnings:

  - Added the required column `studyUpdateStateId` to the `StudyUpdates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionId` to the `StudyUpdates` table without a default value. This is not possible if the table is not empty.

*/
-- DeleteRows
TRUNCATE `StudyUpdates`;

-- AlterTable
ALTER TABLE `StudyUpdates` ADD COLUMN `studyUpdateStateId` INTEGER NOT NULL,
    ADD COLUMN `transactionId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `SysRefStudyUpdateState` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `state` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudyUpdates` ADD CONSTRAINT `StudyUpdates_studyUpdateStateId_fkey` FOREIGN KEY (`studyUpdateStateId`) REFERENCES `SysRefStudyUpdateState`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Seed data
INSERT INTO `SysRefStudyUpdateState` (`id`, `state`, `description`) VALUES
  (1, 'Before', 'The state of a study before the update is applied'),
  (2, 'After', 'The state of a study after the update is applied');