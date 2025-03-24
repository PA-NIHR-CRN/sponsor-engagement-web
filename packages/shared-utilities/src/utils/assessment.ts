import type { Prisma } from '@prisma/client'

export const generateAssessmentDueLogic = (date: Date): Prisma.StudyWhereInput => {
  return {
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
  }
}
