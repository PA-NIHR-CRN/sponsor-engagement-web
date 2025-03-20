import type { Prisma } from '@prisma/client'

export const generateAssessmentDueLogic = (studyIds: number[], date: Date): Prisma.StudyWhereInput => {
  return {
    id: { in: studyIds },
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
