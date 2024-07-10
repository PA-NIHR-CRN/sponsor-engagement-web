/*
  Warnings:

  - A unique constraint covering the columns `[userId,organisationId]` on the table `UserOrganisation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `UserOrganisation_userId_organisationId_key` ON `UserOrganisation`(`userId`, `organisationId`);
