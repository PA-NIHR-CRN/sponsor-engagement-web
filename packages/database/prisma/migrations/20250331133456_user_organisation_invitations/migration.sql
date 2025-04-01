-- CreateTable
CREATE TABLE `UserOrganisationInvitation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userOrganisationId` INTEGER NOT NULL,
    `messageId` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `statusId` INTEGER NOT NULL,
    `failureNotifiedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SysRefInvitationStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserOrganisationInvitation` ADD CONSTRAINT `UserOrganisationInvitation_userOrganisationId_fkey` FOREIGN KEY (`userOrganisationId`) REFERENCES `UserOrganisation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserOrganisationInvitation` ADD CONSTRAINT `UserOrganisationInvitation_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `SysRefInvitationStatus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Seed data
INSERT INTO `SysRefInvitationStatus` (`id`, `name`) VALUES
  (1, 'Success'),
  (2, 'Pending'),
  (3, 'Failure')