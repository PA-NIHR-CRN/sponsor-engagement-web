import type { Prisma } from 'database'

import { StudyUpdateState, StudyUpdateType } from '@/constants'
import { constructDateStrFromParts } from '@/utils/date'
import type { EditStudy, EditStudyInputs } from '@/utils/schemas'

import { prismaClient } from './prisma'
import { mapCPMSStatusToFormStatus } from './studies'

export const logStudyUpdate = async (
  studyId: number,
  transactionId: string,
  originalStudyValues: EditStudy['originalValues'],
  newStudyValues: Omit<EditStudyInputs, 'studyId' | 'cpmsId'>,
  isDirectUpdate: boolean,
  userId: number,
  beforeLSN?: string | null,
  afterLSN?: string | null
) => {
  const studyUpdateBefore: Prisma.StudyUpdatesCreateManyInput = {
    studyId,
    studyStatus: originalStudyValues.status,
    studyStatusGroup: mapCPMSStatusToFormStatus(originalStudyValues.status),
    plannedOpeningDate: constructDateStrFromParts(originalStudyValues.plannedOpeningDate, false),
    actualOpeningDate: constructDateStrFromParts(originalStudyValues.actualOpeningDate, false),
    plannedClosureToRecruitmentDate: constructDateStrFromParts(originalStudyValues.plannedClosureDate, false),
    actualClosureToRecruitmentDate: constructDateStrFromParts(originalStudyValues.actualClosureDate, false),
    estimatedReopeningDate: constructDateStrFromParts(originalStudyValues.estimatedReopeningDate, false),
    ukRecruitmentTarget: originalStudyValues.recruitmentTarget
      ? Number(originalStudyValues.recruitmentTarget)
      : undefined,
    comment: originalStudyValues.furtherInformation,
    transactionId,
    LSN: beforeLSN ? Buffer.from(beforeLSN, 'hex') : null,
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
    plannedOpeningDate: constructDateStrFromParts(newStudyValues.plannedOpeningDate, false),
    actualOpeningDate: constructDateStrFromParts(newStudyValues.actualOpeningDate, false),
    plannedClosureToRecruitmentDate: constructDateStrFromParts(newStudyValues.plannedClosureDate, false),
    actualClosureToRecruitmentDate: constructDateStrFromParts(newStudyValues.actualClosureDate, false),
    estimatedReopeningDate: constructDateStrFromParts(newStudyValues.estimatedReopeningDate, false),
    ukRecruitmentTarget: newStudyValues.recruitmentTarget ? Number(newStudyValues.recruitmentTarget) : undefined,
    comment: newStudyValues.furtherInformation,
    transactionId,
    LSN: afterLSN ? Buffer.from(afterLSN, 'hex') : null,
    studyUpdateStateId: StudyUpdateState.After,
    studyUpdateTypeId: isDirectUpdate ? StudyUpdateType.Direct : StudyUpdateType.Proposed,
    createdById: userId,
    modifiedById: userId,
  }

  await prismaClient.studyUpdates.createMany({
    data: [studyUpdateBefore, studyUpdateAfter],
  })
}
