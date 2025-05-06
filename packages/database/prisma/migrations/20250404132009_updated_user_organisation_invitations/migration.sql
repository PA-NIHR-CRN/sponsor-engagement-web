-- AlterTable
ALTER TABLE `UserOrganisationInvitation` ADD COLUMN `isDeleted` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `sentById` INTEGER  NULL;


-- Set `sentById` field to the 'Adminstrator' User id
UPDATE `UserOrganisationInvitation` userOrgInvitation 
JOIN  (
  SELECT `id`
  FROM `User`
  WHERE `email` = 'administrator@nihr.ac.uk'
  LIMIT 1
) AS adminUser
SET userOrgInvitation.`sentById` = adminUser.`id`;

-- Update `sentById` field to be required
ALTER TABLE `UserOrganisationInvitation` MODIFY COLUMN `sentById` INT NOT NULL;

-- AddForeignKey
ALTER TABLE `UserOrganisationInvitation` ADD CONSTRAINT `UserOrganisationInvitation_sentById_fkey` FOREIGN KEY (`sentById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
