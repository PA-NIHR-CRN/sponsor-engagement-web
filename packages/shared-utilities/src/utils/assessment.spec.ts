import { getAssessmentDueCriteria } from './assessment'

describe('getAssessmentDueCriteria()', () => {
  it('should generate the correct where clause based on the provided date', () => {
    const date = new Date('2025-03-20T00:00:00.000Z')

    const result = getAssessmentDueCriteria(date)

    expect(result).toEqual({
      evaluationCategories: {
        some: { isDeleted: false },
      },
      assessments: {
        every: {
          createdAt: {
            lte: date,
          },
        },
      },
      OR: [{ actualOpeningDate: null }, { actualOpeningDate: { lte: date } }],
    })
  })
})
