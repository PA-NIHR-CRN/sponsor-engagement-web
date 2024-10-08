import { setStudyAssessmentDue } from './index'
import { prismaMock } from '../../mocks/prisma'

jest.mock('@nihr-ui/logger')

const mockStudyIds = [12, 32, 23]

describe('setStudyAssessmentDue()', () => {
  it('should update the study `isDueAssessment` flag', async () => {
    prismaMock.study.updateMany.mockResolvedValueOnce({ count: 1 })

    await setStudyAssessmentDue(mockStudyIds)

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
