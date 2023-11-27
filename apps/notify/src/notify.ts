import { logger } from '@nihr-ui/logger'
import { emailService } from '@nihr-ui/email'
import { prismaClient } from './lib/prisma'
import { arrayChunks, getAbsoluteUrl } from './utils'
import {
  EXTERNAL_CRN_TERMS_CONDITIONS_URL,
  EXTERNAL_CRN_URL,
  MAX_RECIPIENTS,
  SIGN_IN_PAGE,
  SUPPORT_PAGE,
} from './constants'
import emailTemplates from './templates/email'

export const notify = async () => {
  const usersWithStudiesDueAssessment = await prismaClient.user.findMany({
    where: {
      organisations: {
        some: {
          organisation: { studies: { some: { study: { isDueAssessment: true } } } },
        },
      },
    },
  })

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
