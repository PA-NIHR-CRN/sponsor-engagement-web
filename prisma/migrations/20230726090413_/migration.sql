-- CreateTable
CREATE TABLE `DataServiceProviderRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `referenceNumber` VARCHAR(191) NOT NULL DEFAULT '',
    `fullName` VARCHAR(191) NOT NULL,
    `emailAddress` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `jobRole` VARCHAR(191) NOT NULL,
    `organisationName` VARCHAR(191) NOT NULL,
    `studyDescription` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
