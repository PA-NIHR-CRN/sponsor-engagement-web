import { logger } from '@nihr-ui/logger'
import dayjs from 'dayjs'
import { prismaClient } from '../../utils/prisma'

export const setAssessmentDue = async (studyIds: number[], lapsePeriodMonths: number): Promise<void> => {
  const threeMonthsAgo = dayjs().subtract(lapsePeriodMonths, 'month').toDate()
  const assessmentDueResult = await prismaClient.study.updateMany({
    data: {
      isDueAssessment: true,
    },
    where: {
      id: { in: studyIds },
      evaluationCategories: {
        some: { isDeleted: false },
      },
      assessments: {
        every: {
          createdAt: {
            lte: threeMonthsAgo,
          },
        },
      },
      OR: [{ actualOpeningDate: null }, { actualOpeningDate: { lte: threeMonthsAgo } }],
    },
  })

  logger.info(`Flagged ${assessmentDueResult.count} studies as being due assessment`)
}
