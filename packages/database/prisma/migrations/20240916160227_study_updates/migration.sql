-- CreateTable
CREATE TABLE `StudyUpdates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studyId` INTEGER NOT NULL,
    `studyStatus` VARCHAR(191) NOT NULL,
    `plannedOpeningDate` DATETIME(3) NULL,
    `actualOpeningDate` DATETIME(3) NULL,
    `plannedClosureToRecruitmentDate` DATETIME(3) NULL,
    `actualClosureToRecruitmentDate` DATETIME(3) NULL,
    `estimatedReopeningDate` DATETIME(3) NULL,
    `ukRecruitmentTarget` INTEGER NULL,
    `studyUpdateTypeId` INTEGER NOT NULL,
    `comment` VARCHAR(500) NULL,
    `isDeleted` BOOLEAN NULL DEFAULT false,
    `LSN` BINARY(10) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdyById` INTEGER NOT NULL,
    `modifiedAt` DATETIME(3) NOT NULL,
    `modifiedById` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SysRefStudyUpdateType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudyUpdates` ADD CONSTRAINT `StudyUpdates_studyId_fkey` FOREIGN KEY (`studyId`) REFERENCES `Study`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyUpdates` ADD CONSTRAINT `StudyUpdates_studyUpdateTypeId_fkey` FOREIGN KEY (`studyUpdateTypeId`) REFERENCES `SysRefStudyUpdateType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyUpdates` ADD CONSTRAINT `StudyUpdates_createdyById_fkey` FOREIGN KEY (`createdyById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyUpdates` ADD CONSTRAINT `StudyUpdates_modifiedById_fkey` FOREIGN KEY (`modifiedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
