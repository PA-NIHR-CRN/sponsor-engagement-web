import type { Prisma } from 'database'

import { StudyUpdateState, StudyUpdateType } from '@/constants'
import { constructDateObjFromParts } from '@/utils/date'
import type { EditStudy, EditStudyInputs } from '@/utils/schemas'

import { prismaClient } from './prisma'
import { mapCPMSStatusToFormStatus } from './studies'

export const logStudyUpdate = async (
  studyId: number,
  transactionId: string,
  originalStudyValues: EditStudy['originalValues'],
  newStudyValues: EditStudyInputs,
  isDirectUpdate: boolean,
  userId: number,
  beforeLSN?: string,
  afterLSN?: string
) => {
  const studyUpdateBefore: Prisma.StudyUpdatesCreateManyInput = {
    studyId,
    studyStatus: originalStudyValues.status,
    studyStatusGroup: mapCPMSStatusToFormStatus(originalStudyValues.status),
    plannedOpeningDate: constructDateObjFromParts(originalStudyValues.plannedOpeningDate),
    actualOpeningDate: constructDateObjFromParts(originalStudyValues.actualOpeningDate),
    plannedClosureToRecruitmentDate: constructDateObjFromParts(originalStudyValues.plannedClosureDate),
    actualClosureToRecruitmentDate: constructDateObjFromParts(originalStudyValues.actualClosureDate),
    estimatedReopeningDate: constructDateObjFromParts(originalStudyValues.estimatedReopeningDate),
    ukRecruitmentTarget: originalStudyValues.recruitmentTarget
      ? Number(originalStudyValues.recruitmentTarget)
      : undefined,
    comment: originalStudyValues.furtherInformation,
    transactionId,
    LSN: beforeLSN ? Buffer.from(beforeLSN, 'base64') : null,
    studyUpdateStateId: StudyUpdateState.Before,
    studyUpdateTypeId: isDirectUpdate ? StudyUpdateType.Direct : StudyUpdateType.Proposed,
    createdById: userId,
    modifiedById: userId,
  }

  const studyUpdateAfter: Prisma.StudyUpdatesCreateManyInput = {
    studyId,
    // For proposed changes, we do not know which CPMS status to map to based on the status the user sees
    // Therefore, this is only saved if it is a direct update. But studyStatusGroup is always set.
    studyStatus: isDirectUpdate ? newStudyValues.status : null,
    studyStatusGroup: mapCPMSStatusToFormStatus(newStudyValues.status),
    plannedOpeningDate: constructDateObjFromParts(newStudyValues.plannedOpeningDate),
    actualOpeningDate: constructDateObjFromParts(newStudyValues.actualOpeningDate),
    plannedClosureToRecruitmentDate: constructDateObjFromParts(newStudyValues.plannedClosureDate),
    actualClosureToRecruitmentDate: constructDateObjFromParts(newStudyValues.actualClosureDate),
    estimatedReopeningDate: constructDateObjFromParts(newStudyValues.estimatedReopeningDate),
    ukRecruitmentTarget: newStudyValues.recruitmentTarget ? Number(newStudyValues.recruitmentTarget) : undefined,
    comment: newStudyValues.furtherInformation,
    transactionId,
    LSN: afterLSN ? Buffer.from(afterLSN, 'base64') : null,
    studyUpdateStateId: StudyUpdateState.After,
    studyUpdateTypeId: isDirectUpdate ? StudyUpdateType.Direct : StudyUpdateType.Proposed,
    createdById: userId,
    modifiedById: userId,
  }

  await prismaClient.studyUpdates.createMany({
    data: [studyUpdateBefore, studyUpdateAfter],
  })
}
