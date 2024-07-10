-- DropForeignKey
ALTER TABLE `AssessmentFurtherInformation` DROP FOREIGN KEY `AssessmentFurtherInformation_furtherInformationId_fkey`;

-- AlterTable
ALTER TABLE `AssessmentFurtherInformation` MODIFY `furtherInformationId` INTEGER NULL,
    MODIFY `furtherInformationText` TEXT NULL;

-- AddForeignKey
ALTER TABLE `AssessmentFurtherInformation` ADD CONSTRAINT `AssessmentFurtherInformation_furtherInformationId_fkey` FOREIGN KEY (`furtherInformationId`) REFERENCES `SysRefAssessmentFurtherInformation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
