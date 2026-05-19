-- CreateTable
CREATE TABLE `StudyFirst` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `studyId` INTEGER NOT NULL,
    `type` ENUM('global', 'european') NOT NULL,
    `firstAt` DATETIME(3) NOT NULL,
    `siteName` VARCHAR(191) NOT NULL,
    `piTitle` VARCHAR(191) NULL,
    `piFullName` VARCHAR(191) NOT NULL,
    `piEmail` VARCHAR(191) NOT NULL,
    `createdById` INTEGER NOT NULL,
    `modifiedById` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `StudyFirst_studyId_key`(`studyId`),
    INDEX `StudyFirst_createdById_fkey`(`createdById`),
    INDEX `StudyFirst_modifiedById_fkey`(`modifiedById`),
    INDEX `StudyFirst_studyId_fkey`(`studyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StudyFirst` ADD CONSTRAINT `StudyFirst_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyFirst` ADD CONSTRAINT `StudyFirst_modifiedById_fkey` FOREIGN KEY (`modifiedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudyFirst` ADD CONSTRAINT `StudyFirst_studyId_fkey` FOREIGN KEY (`studyId`) REFERENCES `Study`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
