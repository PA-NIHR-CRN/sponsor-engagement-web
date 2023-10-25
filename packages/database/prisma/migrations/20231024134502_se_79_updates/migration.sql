/*
  Warnings:

  - You are about to drop the column `name` on the `Study` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Study` table. All the data in the column will be lost.
  - Added the required column `shortTitle` to the `Study` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studyStatus` to the `Study` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Study` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Study` DROP COLUMN `name`,
    DROP COLUMN `status`,
    ADD COLUMN `shortTitle` VARCHAR(191) NOT NULL,
    ADD COLUMN `studyStatus` VARCHAR(191) NOT NULL,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    ADD COLUMN `totalRecruitmentToDate` INTEGER NULL;
