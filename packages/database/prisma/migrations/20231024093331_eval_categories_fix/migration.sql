/*
  Warnings:

  - A unique constraint covering the columns `[studyId,indicatorValue]` on the table `StudyEvaluationCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `StudyEvaluationCategory_studyId_indicatorType_key` ON `StudyEvaluationCategory`;

-- CreateIndex
CREATE UNIQUE INDEX `StudyEvaluationCategory_studyId_indicatorValue_key` ON `StudyEvaluationCategory`(`studyId`, `indicatorValue`);
