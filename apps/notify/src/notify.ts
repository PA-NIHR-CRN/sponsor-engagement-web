import assert from 'assert'
import { logger } from '@nihr-ui/logger'
import { emailService, type EmailResult } from '@nihr-ui/email'
import { config as dotEnvConfig } from 'dotenv'
import { emailTemplates } from '@nihr-ui/templates/sponsor-engagement'
import dayjs from 'dayjs'
import { Prisma } from 'database'
import { prismaClient } from './lib/prisma'
import { getAbsoluteUrl } from './utils'
import { EXTERNAL_CRN_TERMS_CONDITIONS_URL, EXTERNAL_CRN_URL, SIGN_IN_PAGE, SUPPORT_PAGE } from './constants'

dotEnvConfig()

const sendNotifications = async () => {
  assert(process.env.APP_ENV)

  const allowList = process.env.NOTIFY_ALLOW_LIST?.split(',')

  if (process.env.APP_ENV !== 'prod' && !allowList?.length) {
    logger.error('No allow list provided for non-prod environment')
    return
  }

  const resendDelay = process.env.NOTIFY_RESEND_DELAY ? Number(process.env.NOTIFY_RESEND_DELAY) : 7

  const usersWithStudiesDueAssessment = await prismaClient.user.findMany({
    where: {
      ...(allowList && { email: { in: allowList } }),
      organisations: {
        some: {
          organisation: { studies: { some: { study: { isDueAssessment: true, isDeleted: false }, isDeleted: false } } },
          isDeleted: false,
        },
      },
      // Check for recent successful sends to prevent duplicate emails being sent on re-runs
      assessmentReminders: {
        none: {
          AND: [{ sentAt: { not: null } }, { sentAt: { gte: dayjs().subtract(resendDelay, 'days').toDate() } }],
        },
      },
    },
  })

  if (usersWithStudiesDueAssessment.length === 0) {
    logger.info('No assessment notifications required')
    return
  }

  await prismaClient.assessmentReminder.createMany({
    data: usersWithStudiesDueAssessment.map((user) => ({
      userId: user.id,
    })),
  })

  const onSuccess = async ({ messageId, recipients }: EmailResult) => {
    const recipient = recipients[0]

    const assessmentReminder = await prismaClient.assessmentReminder.findMany({
      where: { user: { email: recipient } },
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
      take: 1,
    })

    await prismaClient.assessmentReminder.update({
      where: { id: assessmentReminder[0].id },
      data: {
        sentAt: new Date(),
        messageId,
      },
    })
  }

  const emailInputs = usersWithStudiesDueAssessment.map(({ email }) => ({
    to: email,
    subject: `Assess the progress of your studies`,
    htmlTemplate: emailTemplates['assessment-reminder.html.hbs'],
    textTemplate: emailTemplates['assessment-reminder.text.hbs'],
    templateData: {
      rdnLink: EXTERNAL_CRN_URL,
      termsAndConditionsLink: EXTERNAL_CRN_TERMS_CONDITIONS_URL,
      signInLink: getAbsoluteUrl(SIGN_IN_PAGE),
      requestSupportLink: getAbsoluteUrl(SUPPORT_PAGE),
      iconUrl: getAbsoluteUrl('/assets/images/exclamation-icon.png'),
    },
  }))

  await emailService.sendBulkEmail(emailInputs, onSuccess)

  logger.info('Finished sending assessment notifications')
}

export const notify = async () => {
  try {
    await sendNotifications()
  } catch (error) {
    logger.error(error)
  }
}
