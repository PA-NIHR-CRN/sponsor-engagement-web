import { PrismaClient } from '@prisma/client'
import { logger } from '@nihr-ui/logger'

const prisma = new PrismaClient()

async function main() {
  logger.info('⧗ Database seed start ✓')

  await prisma.sysRefRole.createMany({
    data: [
      {
        id: 1,
        name: 'SponsorContact',
        description: 'Sponsor contact role',
      },
      {
        id: 2,
        name: 'ContactManager',
        description: 'Contact manager role',
      },
    ],
    skipDuplicates: true,
  })

  logger.info('→ Roles created ✓')

  await prisma.sysRefAssessmentStatus.createMany({
    data: [
      {
        id: 1,
        name: 'On track',
        description: 'The sponsor or delegate is satisfied the study is progressing as planned.',
      },
      {
        id: 2,
        name: 'Off track',
        description:
          'The sponsor or delegate has some concerns about the study and is taking action where appropriate.',
      },
    ],
    skipDuplicates: true,
  })

  logger.info('→ Assessment statuses created ✓')

  const assessmentFurtherInformationFields = [
    'Study no longer going ahead in the UK [withdrawn during setup]',
    'Waiting for HRA or MHRA approvals',
    'Waiting for site approval or activation',
    'In process of seeking an extension or protocol amendment',
    'Work in progress with CRN to update key milestones and recruitment activity',
    'In discussion with stakeholders to agree next steps',
    'No recruitment expected within the last 90 days, in line with the study plan',
    'Study closed to recruitment, in follow up',
    'Follow up complete or none required',
    'Work in progress to close study in the UK',
  ]

  await prisma.sysRefAssessmentFurtherInformation.createMany({
    data: assessmentFurtherInformationFields.map((name, index) => ({
      id: index + 1,
      name,
      sortOrder: index + 1,
      description: '',
    })),
    skipDuplicates: true,
  })

  logger.info('→ Assessment further information created ✓')

  logger.info('✓ Database seed end')
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    logger.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
