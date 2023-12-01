import assert from 'assert'
import { logger } from '@nihr-ui/logger'
import { emailService } from '@nihr-ui/email'
import { config as dotEnvConfig } from 'dotenv'
import { emailTemplates } from '@nihr-ui/templates/sponsor-engagement'
import { prismaClient } from './lib/prisma'
import { arrayChunks, getAbsoluteUrl } from './utils'
import {
  EXTERNAL_CRN_TERMS_CONDITIONS_URL,
  EXTERNAL_CRN_URL,
  MAX_RECIPIENTS,
  SIGN_IN_PAGE,
  SUPPORT_PAGE,
} from './constants'

dotEnvConfig()

const sendNotifications = async () => {
  assert(process.env.APP_ENV)

  const allowList = process.env.NOTIFY_ALLOW_LIST?.split(',')

  if (process.env.APP_ENV !== 'prod' && !allowList?.length) {
    logger.error('No allow list provided for non-prod environment')
    return
  }

  const usersWithStudiesDueAssessment = await prismaClient.user.findMany({
    where: {
      ...(allowList && { email: { in: allowList } }),
      organisations: {
        some: {
          organisation: { studies: { some: { study: { isDueAssessment: true } } } },
        },
      },
    },
  })

  if (usersWithStudiesDueAssessment.length === 0) {
    logger.info('No assessment notifications required')
    return
  }

  const usersWithStudiesDueAssessmentByEmail = Object.fromEntries(
    usersWithStudiesDueAssessment.map((user) => [user.email, user])
  )

  const onSuccess = async (recipients: string[]) => {
    await prismaClient.assessmentReminder.createMany({
      data: recipients.map((email) => ({ userId: usersWithStudiesDueAssessmentByEmail[email].id })),
    })
  }

  const recipientChunks = arrayChunks(usersWithStudiesDueAssessment, MAX_RECIPIENTS)

  const emailInputs = recipientChunks
    .map((recipients) => ({
      to: recipients.map(({ email }) => email),
      subject: `Assess the progress of your studies`,
      htmlTemplate: emailTemplates['assessment-reminder.html.hbs'],
      textTemplate: emailTemplates['assessment-reminder.text.hbs'],
      templateData: {
        crnLink: EXTERNAL_CRN_URL,
        termsAndConditionsLink: EXTERNAL_CRN_TERMS_CONDITIONS_URL,
        signInLink: getAbsoluteUrl(SIGN_IN_PAGE),
        requestSupportLink: getAbsoluteUrl(SUPPORT_PAGE),
        iconUrl: getAbsoluteUrl('/assets/images/exclamation-icon.png'),
      },
    }))
    .flat()

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
