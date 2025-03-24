import { prismaMock } from '../../mocks/prisma'
import { setStudyAssessmentNotDue } from './index'

jest.mock('@nihr-ui/logger')

const mockStudyIds = [12, 32, 23]

describe('setStudyAssessmentNotDue()', () => {
  it('should set the "dueAssessmentAt" field to null', async () => {
    prismaMock.study.updateMany.mockResolvedValueOnce({ count: mockStudyIds.length })

    const response = await setStudyAssessmentNotDue(mockStudyIds)

    expect(response).toEqual({ count: mockStudyIds.length })
    expect(prismaMock.study.updateMany).toHaveBeenCalledTimes(1)

    expect(prismaMock.study.updateMany).toHaveBeenCalledWith({
      data: {
        dueAssessmentAt: null,
      },
      where: {
        id: { in: mockStudyIds },
        NOT: {
          evaluationCategories: {
            some: { isDeleted: false },
          },
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
      },
    })
  })
})
