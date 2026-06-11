-- AlterTable
ALTER TABLE `Study` RENAME COLUMN `HraApprovalDate` TO `hraApprovalDate`;

-- AlterTable
ALTER TABLE `StudyFirst` MODIFY `siteName` TEXT NOT NULL;
