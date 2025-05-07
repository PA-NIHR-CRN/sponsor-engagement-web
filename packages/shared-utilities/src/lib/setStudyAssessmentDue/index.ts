import assert from 'assert'
import { logger } from '@nihr-ui/logger'
import dayjs from 'dayjs'
import { prismaClient } from '../../utils/prisma'
import { getAssessmentDueCriteria } from '../../utils/assessment'

export const setStudyAssessmentDue = async (studyIds: number[]): Promise<{ count: number }> => {
  const { ASSESSMENT_LAPSE_MONTHS } = process.env

  assert(ASSESSMENT_LAPSE_MONTHS)
  const lapsePeriodMonths = Number(ASSESSMENT_LAPSE_MONTHS)

  const threeMonthsAgo = dayjs().subtract(lapsePeriodMonths, 'month').toDate()
  const assessmentDueResult = await prismaClient.study.updateMany({
    data: {
      dueAssessmentAt: new Date(),
    },
    where: {
      id: { in: studyIds },
      ...getAssessmentDueCriteria(threeMonthsAgo),
      dueAssessmentAt: null,
    },
  })

  logger.info(`Flagged ${assessmentDueResult.count} studies as being due an assessment`)

  return { count: assessmentDueResult.count }
}
