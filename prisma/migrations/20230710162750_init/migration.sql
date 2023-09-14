-- CreateTable
CREATE TABLE `SupportRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `enquiryType` VARCHAR(191) NOT NULL,
    `supportDescription` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `emailAddress` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `jobRole` VARCHAR(191) NOT NULL,
    `organisationName` VARCHAR(191) NOT NULL,
    `organisationType` VARCHAR(191) NOT NULL,
    `lcrn` VARCHAR(191) NOT NULL,
    `studyTitle` VARCHAR(191) NULL,
    `protocolReference` VARCHAR(191) NULL,
    `cpmsId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
