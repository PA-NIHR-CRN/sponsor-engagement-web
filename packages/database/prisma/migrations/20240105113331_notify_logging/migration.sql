-- AlterTable
ALTER TABLE `AssessmentReminder` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `messageId` VARCHAR(191) NULL,
    MODIFY `sentAt` DATETIME(3) NULL;
