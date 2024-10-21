import { prismaMock } from '../__mocks__/prisma'
import { StudyUpdateState, StudyUpdateType } from '../constants'
import { mapCPMSStatusToFormStatus } from './studies'
import { logStudyUpdate } from './studyUpdates'

const studyId = 1212
const transactionId = '3423'
const userId = 434
const beforeLSN = '999'
const afterLSN = '888'
const mockStatus = 'Open'

const newStudyValues = {
  status: 'Closed',
  plannedOpeningDate: {
    day: '28',
    month: '02',
    year: '2003',
  },
  actualClosureDate: {
    day: '28',
    month: '02',
    year: '2003',
  },
  actualOpeningDate: {
    day: '01',
    month: '09',
    year: '1991',
  },
  plannedClosureDate: {
    day: '28',
    month: '02',
    year: '2004',
  },
  estimatedReopeningDate: {
    day: '28',
    month: '02',
    year: '2024',
  },
  recruitmentTarget: '121',
  furtherInformation: '',
  LSN: beforeLSN,
}
const originalValues = {
  status: 'Open to Recruitment',
  plannedOpeningDate: {
    day: '27',
    month: '02',
    year: '2003',
  },
  actualClosureDate: {
    day: '27',
    month: '02',
    year: '2003',
  },
  actualOpeningDate: {
    day: '02',
    month: '09',
    year: '1991',
  },
  plannedClosureDate: {
    day: '27',
    month: '02',
    year: '2004',
  },
  estimatedReopeningDate: {
    day: '27',
    month: '02',
    year: '2021',
  },
  recruitmentTarget: '122',
  furtherInformation: '',
}
const getMockBeforeStudyUpdate = (isDirectUpdate = true) => ({
  studyId,
  studyStatus: originalValues.status,
  studyStatusGroup: mockStatus,
  plannedOpeningDate: new Date('2003-02-27T00:00:00.000').toISOString(),
  actualOpeningDate: new Date('1991-09-02T00:00:00.000').toISOString(),
  plannedClosureToRecruitmentDate: new Date('2004-02-27T00:00:00.000').toISOString(),
  actualClosureToRecruitmentDate: new Date('2003-02-27T00:00:00.000').toISOString(),
  estimatedReopeningDate: new Date('2021-02-27T00:00:00.000').toISOString(),
  ukRecruitmentTarget: originalValues.recruitmentTarget ? Number(originalValues.recruitmentTarget) : undefined,
  comment: originalValues.furtherInformation,
  transactionId,
  LSN: Buffer.from(beforeLSN, 'hex'),
  studyUpdateStateId: StudyUpdateState.Before,
  studyUpdateTypeId: isDirectUpdate ? StudyUpdateType.Direct : StudyUpdateType.Proposed,
  createdById: userId,
  modifiedById: userId,
})

const getMockAfterStudyUpdate = (isDirectUpdate = true) => ({
  studyId,
  studyStatus: isDirectUpdate ? newStudyValues.status : null,
  studyStatusGroup: mockStatus,
  plannedOpeningDate: new Date('2003-02-28T00:00:00.000').toISOString(),
  actualOpeningDate: new Date('1991-09-01T00:00:00.000').toISOString(),
  plannedClosureToRecruitmentDate: new Date('2004-02-28T00:00:00.000').toISOString(),
  actualClosureToRecruitmentDate: new Date('2003-02-28T00:00:00.000').toISOString(),
  estimatedReopeningDate: new Date('2024-02-28T00:00:00.000').toISOString(),
  ukRecruitmentTarget: newStudyValues.recruitmentTarget ? Number(newStudyValues.recruitmentTarget) : undefined,
  comment: newStudyValues.furtherInformation,
  transactionId,
  LSN: Buffer.from(afterLSN, 'hex'),
  studyUpdateStateId: StudyUpdateState.After,
  studyUpdateTypeId: isDirectUpdate ? StudyUpdateType.Direct : StudyUpdateType.Proposed,
  createdById: userId,
  modifiedById: userId,
})

jest.mock('./studies')
const mockMapCPMSStatusToFormStatus = mapCPMSStatusToFormStatus as jest.MockedFunction<typeof mapCPMSStatusToFormStatus>

describe('logStudyUpdate', () => {
  it.each([StudyUpdateType.Direct, StudyUpdateType.Proposed])(
    'when study update type is %s, should correctly create two entries, with correct attributes, in the studyUpdates table',
    async (studyUpdateType: StudyUpdateType) => {
      const isDirectUpdate = studyUpdateType === StudyUpdateType.Direct
      mockMapCPMSStatusToFormStatus.mockReturnValue(mockStatus)
      prismaMock.studyUpdates.createMany.mockResolvedValueOnce({ count: 2 })
      await logStudyUpdate(
        studyId,
        transactionId,
        originalValues,
        newStudyValues,
        isDirectUpdate,
        userId,
        beforeLSN,
        afterLSN
      )
      expect(prismaMock.studyUpdates.createMany).toHaveBeenCalledTimes(1)
      expect(prismaMock.studyUpdates.createMany).toHaveBeenCalledWith({
        data: [getMockBeforeStudyUpdate(isDirectUpdate), getMockAfterStudyUpdate(isDirectUpdate)],
      })
    }
  )

  it('when beforeLSN and/or afterLSN is undefined, should correctly log studyUpdates wih LSN as null', async () => {
    mockMapCPMSStatusToFormStatus.mockReturnValue(mockStatus)
    prismaMock.studyUpdates.createMany.mockResolvedValueOnce({ count: 2 })
    await logStudyUpdate(studyId, transactionId, originalValues, newStudyValues, true, userId, undefined, undefined)
    expect(prismaMock.studyUpdates.createMany).toHaveBeenCalledTimes(1)
    expect(prismaMock.studyUpdates.createMany).toHaveBeenCalledWith({
      data: [
        { ...getMockBeforeStudyUpdate(), LSN: null },
        { ...getMockAfterStudyUpdate(), LSN: null },
      ],
    })
  })
})
