-- CreateTable
CREATE TABLE `Feedback` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `referenceNumber` VARCHAR(191) NOT NULL DEFAULT '',
    `helpfulness` VARCHAR(191) NOT NULL,
    `suggestions` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NULL,
    `emailAddress` VARCHAR(191) NULL,
    `organisationName` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
