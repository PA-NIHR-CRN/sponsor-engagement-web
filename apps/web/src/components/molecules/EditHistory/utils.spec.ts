import { StudyUpdateState, StudyUpdateType } from '@/constants'
import { getMockEditHistoryFromCPMS, mockCPMSStudy, mockProposedEditHistory, mockStudyUpdates } from '@/mocks/studies'

import { prismaMock } from '../../../__mocks__/prisma'
import {
  createChangeHistoryForCPMSChanges,
  createChangeHistoryForProposedChanges,
  getEditHistory,
  getTenMostRecentUpdates,
  transformValue,
} from './utils'

describe('transformValue()', () => {
  it.each([null, ''])('should return null for input is a falsy value', (inputValue: string | null) => {
    expect(transformValue(inputValue)).toBeNull()
  })

  it('should return the input value if it is a valid number', () => {
    expect(transformValue('123')).toBe('123')
  })

  it('should return formatted date if the value is a valid date', () => {
    const validDate = '2023-01-01'
    expect(transformValue(validDate)).toBe('1 January 2023')
  })

  it('should return the input value if no special case matches', () => {
    const inputValue = 'unknownValue'
    expect(transformValue(inputValue)).toBe(inputValue)
  })
})

describe('createChangeHistoryForProposedChanges()', () => {
  it('should return an empty array, if no proposed updates found with given transaction ids', async () => {
    prismaMock.studyUpdates.findMany.mockResolvedValueOnce([])

    const result = await createChangeHistoryForProposedChanges(['id-1', 'id-2'])
    expect(result).toEqual([])
  })

  it('should return the correct edit history when proposed updates exist', async () => {
    prismaMock.studyUpdates.findMany.mockResolvedValueOnce(mockStudyUpdates)

    const result = await createChangeHistoryForProposedChanges(['id-1'])
    expect(result).toEqual(mockProposedEditHistory)
  })
})

describe('createChangeHistoryForCPMSChanges()', () => {
  it.each([true, false])('should correctly return change history for CPMS changes', async (existInSE: boolean) => {
    const mockFindManyResponse = existInSE
      ? mockStudyUpdates.map((studyUpdate) => ({
          ...studyUpdate,
          studyUpdateStateId: StudyUpdateState.After,
          studyUpdateTypeId: StudyUpdateType.Direct,
          LSN: studyUpdate.LSN ?? Buffer.from(mockCPMSStudy.ChangeHistory[1].LSN, 'hex'),
        }))
      : []

    prismaMock.studyUpdates.findMany.mockResolvedValueOnce(mockFindManyResponse)

    const result = await createChangeHistoryForCPMSChanges(mockCPMSStudy.ChangeHistory, [
      mockCPMSStudy.ChangeHistory[0].LSN,
      mockCPMSStudy.ChangeHistory[1].LSN,
    ])

    expect(result).toEqual(getMockEditHistoryFromCPMS([existInSE, existInSE]).slice(0, 2))
  })

  it('should not return any updates when corresponding LSN does not exist within the provided list', async () => {
    prismaMock.studyUpdates.findMany.mockResolvedValueOnce(
      mockStudyUpdates.map((studyUpdate) => ({
        ...studyUpdate,
        studyUpdateStateId: StudyUpdateState.After,
        studyUpdateTypeId: StudyUpdateType.Direct,
        LSN: studyUpdate.LSN ?? Buffer.from('000065E200005848000A', 'hex'),
      }))
    )

    const result = await createChangeHistoryForCPMSChanges(mockCPMSStudy.ChangeHistory, ['unknown-LSN'])
    expect(result).toEqual([])
  })
})

describe('getTenMostRecentUpdates', () => {
  it('should return an empty array if both proposedUpdates and cpmsUpdates are empty', () => {
    const result = getTenMostRecentUpdates([], [])
    expect(result).toEqual([])
  })

  it('should return the most recent updates from combined SE and CPMS updates', () => {
    const proposedUpdates = [
      { transactionId: 'se1', createdAt: new Date('2023-01-01T10:00:00Z') },
      { transactionId: 'se2', createdAt: new Date('2023-01-02T10:00:00Z') },
    ]

    const result = getTenMostRecentUpdates(proposedUpdates, mockCPMSStudy.ChangeHistory)

    expect(result).toHaveLength(5)
    expect(result).toEqual([
      ...mockCPMSStudy.ChangeHistory.map((update) => ({
        id: update.LSN,
        createdAt: update.Timestamp,
        type: 'CPMS',
      })),
      ...proposedUpdates.reverse().map((update) => ({
        id: update.transactionId,
        createdAt: update.createdAt.toISOString(),
        type: 'SE',
      })),
    ])
  })

  it('should return the 10 most recent updates when there are more than 10 combined updates', () => {
    const proposedUpdates = Array.from({ length: 8 }, (_, i) => ({
      transactionId: `se${i + 1}`,
      createdAt: new Date(`2023-01-${(i + 1).toString().padStart(2, '0')}`),
    }))

    const result = getTenMostRecentUpdates(proposedUpdates, mockCPMSStudy.ChangeHistory)

    expect(result).toHaveLength(10)
    expect(result).toEqual([
      ...mockCPMSStudy.ChangeHistory.map((update) => ({
        id: update.LSN,
        createdAt: update.Timestamp,
        type: 'CPMS',
      })),
      ...proposedUpdates
        .slice(1, 8)
        .reverse()
        .map((update) => ({
          id: update.transactionId,
          createdAt: update.createdAt.toISOString(),
          type: 'SE',
        })),
    ])
  })
})

describe('getEditHistory()', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return an empty array if there are no updates in CPMS and no proposed updates in SE', async () => {
    prismaMock.studyUpdates.groupBy.mockResolvedValueOnce([])
    prismaMock.studyUpdates.findMany.mockResolvedValue([])

    const result = await getEditHistory(mockStudyUpdates[0].studyId, [])
    expect(result).toEqual([])

    expect(prismaMock.studyUpdates.groupBy).toHaveBeenCalledTimes(1)
    expect(prismaMock.studyUpdates.groupBy).toHaveBeenCalledWith({
      by: ['transactionId', 'createdAt'],
      where: {
        studyUpdateTypeId: StudyUpdateType.Proposed,
        studyId: mockStudyUpdates[0].studyId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    })

    expect(prismaMock.studyUpdates.findMany).toHaveBeenCalledTimes(2)
    expect(prismaMock.studyUpdates.findMany).toHaveBeenCalledWith({
      where: { transactionId: { in: [] } },
      include: {
        createdBy: {
          select: {
            email: true,
          },
        },
      },
    })
    expect(prismaMock.studyUpdates.findMany).toHaveBeenCalledWith({
      where: {
        LSN: { in: [] },
        studyUpdateStateId: StudyUpdateState.After,
        studyUpdateTypeId: StudyUpdateType.Direct,
      },
      include: {
        createdBy: true,
      },
    })
  })

  it('should correctly combine both changes from CPMS and proposed changes in SE', async () => {
    prismaMock.studyUpdates.groupBy.mockResolvedValueOnce([
      {
        ...mockStudyUpdates[0],
        _count: true,
        _avg: undefined,
        _sum: undefined,
        _min: undefined,
        _max: undefined,
      },
      {
        ...mockStudyUpdates[1],
        _count: true,
        _avg: undefined,
        _sum: undefined,
        _min: undefined,
        _max: undefined,
      },
    ])
    prismaMock.studyUpdates.findMany.mockResolvedValueOnce(mockStudyUpdates)
    prismaMock.studyUpdates.findMany.mockResolvedValueOnce(
      mockStudyUpdates.map((studyUpdate) => ({
        ...studyUpdate,
        studyUpdateStateId: StudyUpdateState.After,
        studyUpdateTypeId: StudyUpdateType.Direct,
        LSN: studyUpdate.LSN ?? Buffer.from('000065E200005848000A', 'hex'),
      }))
    )

    const result = await getEditHistory(mockStudyUpdates[0].studyId, mockCPMSStudy.ChangeHistory)
    const sortedResult = [...getMockEditHistoryFromCPMS([true, true, false]), ...mockProposedEditHistory].sort(
      (a, b) => new Date(b.modifiedDate).getTime() - new Date(a.modifiedDate).getTime()
    )

    expect(result).toEqual(sortedResult)

    expect(prismaMock.studyUpdates.groupBy).toHaveBeenCalledTimes(1)
    expect(prismaMock.studyUpdates.groupBy).toHaveBeenCalledWith({
      by: ['transactionId', 'createdAt'],
      where: {
        studyUpdateTypeId: StudyUpdateType.Proposed,
        studyId: mockStudyUpdates[0].studyId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    })

    expect(prismaMock.studyUpdates.findMany).toHaveBeenCalledTimes(2)
    expect(prismaMock.studyUpdates.findMany).toHaveBeenCalledWith({
      where: {
        LSN: { in: mockCPMSStudy.ChangeHistory.map((update) => Buffer.from(update.LSN, 'hex')) },
        studyUpdateStateId: StudyUpdateState.After,
        studyUpdateTypeId: StudyUpdateType.Direct,
      },
      include: {
        createdBy: true,
      },
    })
    expect(prismaMock.studyUpdates.findMany).toHaveBeenCalledWith({
      where: { transactionId: { in: mockStudyUpdates.map((update) => update.transactionId) } },
      include: {
        createdBy: {
          select: {
            email: true,
          },
        },
      },
    })
  })
})
