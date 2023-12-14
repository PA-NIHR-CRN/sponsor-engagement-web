import { Prisma, PrismaClient } from '@prisma/client'
import { logger } from '@nihr-ui/logger'

const prisma = new PrismaClient()

const seedAssessments = async () => {
  const studiesWithLastAssessment = await prisma.study.findMany({
    where: {
      assessments: { some: {} },
    },
    select: {
      id: true,
      assessments: {
        include: {
          status: true,
        },
        orderBy: {
          createdAt: Prisma.SortOrder.desc,
        },
        take: 1,
      },
    },
  })

  await prisma.$transaction(
    studiesWithLastAssessment.map((study) =>
      prisma.study.update({
        where: {
          id: study.id,
        },
        data: {
          lastAssessmentId: study.assessments[0].id,
        },
      })
    )
  )
}

seedAssessments()
  .then(async () => {
    logger.info(`Updated the last assessment for studies`)
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    logger.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
