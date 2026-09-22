-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `messageId` VARCHAR(191) NOT NULL,
    `notificationEvent` VARCHAR(127) NOT NULL,
    `NotificationRef` VARCHAR(127) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `failureNotifiedAt` DATETIME(3) NULL,
    `statusId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Notification_statusId_fkey`(`statusId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
