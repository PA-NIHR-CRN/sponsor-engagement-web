import { prismaMock } from '../../mocks/prisma'
import { setStudyAssessmentDue } from './index'

jest.mock('@nihr-ui/logger')

const mockStudyIds = [12, 32, 23]

describe('setStudyAssessmentDue()', () => {
  it('should update the study `isDueAssessment` flag', async () => {
    prismaMock.study.updateMany.mockResolvedValueOnce({ count: mockStudyIds.length })

    const response = await setStudyAssessmentDue(mockStudyIds)

    expect(response).toEqual({ count: mockStudyIds.length })
    expect(prismaMock.study.updateMany).toHaveBeenCalledTimes(1)

    expect(prismaMock.study.updateMany).toHaveBeenCalledWith({
      data: {
        isDueAssessment: true,
      },
      where: {
        id: { in: mockStudyIds },
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
    })
  })
})
