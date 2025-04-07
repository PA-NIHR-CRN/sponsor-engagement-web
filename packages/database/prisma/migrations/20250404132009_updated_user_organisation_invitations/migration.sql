/*
  Warnings:

  - Added the required column `sentById` to the `UserOrganisationInvitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserOrganisationInvitation` ADD COLUMN `isDeleted` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `sentById` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `UserOrganisationInvitation` ADD CONSTRAINT `UserOrganisationInvitation_sentById_fkey` FOREIGN KEY (`sentById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
