import { prismaMock } from '../../mocks/prisma'
import { setStudyAssessmentDue } from './index'

jest.mock('@nihr-ui/logger')

const mockStudyIds = [12, 32, 23]

const date = new Date('2002-02-02')

describe('setStudyAssessmentDue()', () => {
  it('should set the "dueAssessmentAt` field to the correct date', async () => {
    jest.useFakeTimers().setSystemTime(date)
    prismaMock.study.updateMany.mockResolvedValueOnce({ count: mockStudyIds.length })

    const response = await setStudyAssessmentDue(mockStudyIds)

    expect(response).toEqual({ count: mockStudyIds.length })
    expect(prismaMock.study.updateMany).toHaveBeenCalledTimes(1)

    expect(prismaMock.study.updateMany).toHaveBeenCalledWith({
      data: {
        dueAssessmentAt: date,
      },
      where: {
        id: { in: mockStudyIds },
        evaluationCategories: {
          some: { isDeleted: false },
        },
        dueAssessmentAt: null,
        assessments: {
          every: {
            createdAt: {
              lte: expect.any(Date),
            },
          },
        },
        OR: [
          { actualOpeningDate: null },
          {
            actualOpeningDate: {
              lte: expect.any(Date),
            },
          },
        ],
      },
    })

    jest.useRealTimers()
  })
})
