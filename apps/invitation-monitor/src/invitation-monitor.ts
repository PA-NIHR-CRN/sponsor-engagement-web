import { Prisma } from 'database'
import { emailDeliverabilityService, emailService } from '@nihr-ui/email'
import { config as dotEnvConfig } from 'dotenv'
import { BounceType, EventType } from '@aws-sdk/client-sesv2'
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs'
import { logger } from '@nihr-ui/logger'
import type { EmailStatusResult } from '@nihr-ui/email/email-deliverability-service'
import { emailTemplates } from '@nihr-ui/templates/sponsor-engagement'
import { retry } from '@lifeomic/attempt'
import { PERMANENT_EMAIL_FAILURES, RETRYABLE_SES_ERRORS, UserOrganisationInviteStatus } from './lib/constants'
import { prismaClient } from './lib/prisma'
import type { UserOrganisationInvitations } from './types'
import { getSponsorEngagementUrl } from './utils'

dotEnvConfig()
// eslint-disable-next-line import/no-named-as-default-member -- intentional to use this extend from dayjs obj
dayjs.extend(utc)

const fetchPendingEmails = async (pendingStatusId: number): Promise<UserOrganisationInvitations> => {
  return prismaClient.userOrganisationInvitation.findMany({
    where: { statusId: pendingStatusId, isDeleted: false },
    distinct: ['userOrganisationId'],
    orderBy: {
      createdAt: Prisma.SortOrder.desc,
    },
    select: {
      id: true,
      messageId: true,
      timestamp: true,
      sentBy: true,
      userOrganisation: {
        include: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  })
}

const updateEmailStatus = async (statusId: number, idsToUpdate: number[]) => {
  if (idsToUpdate.length === 0) return { count: 0 }

  return prismaClient.userOrganisationInvitation.updateMany({
    data: {
      statusId,
    },
    where: { id: { in: idsToUpdate } },
  })
}

const fetchEmailStatusInner = async (emailMessageId: string): Promise<EmailStatusResult> => {
  const { messageId, insights } = await emailDeliverabilityService.getEmailInsights(emailMessageId)

  return { messageId, insights }
}

const fetchEmailStatus = async (
  emailMessageId: string,
  maxDelay: number,
  maxAttempts = 3
): Promise<EmailStatusResult> => {
  return retry(
    async () => {
      return fetchEmailStatusInner(emailMessageId)
    },
    {
      delay: 3000,
      maxAttempts,
      jitter: true,
      minDelay: 1000,
      maxDelay,
      factor: 2,
      handleError: (error, context) => {
        const enableRetry = RETRYABLE_SES_ERRORS.includes(error instanceof Error ? error.name : '')

        logger.error(
          'Error occurred fetching email status for messageId: %s, %s, error: %s',
          emailMessageId,
          context.attemptsRemaining > 0 && enableRetry
            ? `retrying... , ${context.attemptNum + 1}/${maxAttempts - 1} retries`
            : 'aborting...',
          error
        )

        if (!enableRetry) {
          context.abort()
        }
      },
    }
  )
}

export const monitorInvitationEmails = async () => {
  const EMAIL_DELIVERY_THRESHOLD_HOURS = process.env.INVITE_EMAIL_DELIVERY_THRESHOLD_HOURS
    ? Number(process.env.INVITE_EMAIL_DELIVERY_THRESHOLD_HOURS)
    : 72

  const RETRY_MAX_DELAY_MS = process.env.FETCH_EMAIL_RETRY_MAX_DELAY_MS
    ? Number(process.env.FETCH_EMAIL_RETRY_MAX_DELAY_MS)
    : 6000

  // Fetch status ids for each email status
  const refInvitationStatusResponse = await prismaClient.sysRefInvitationStatus.findMany()
  const invitationStatuses: Record<string, number> = refInvitationStatusResponse.reduce((dictionary, { id, name }) => {
    return { ...dictionary, [name]: id }
  }, {})

  const pendingEmails = await fetchPendingEmails(invitationStatuses[UserOrganisationInviteStatus.PENDING])

  logger.info('Succesfully fetched %s pending emails', pendingEmails.length)

  if (pendingEmails.length === 0) {
    return
  }

  const emailStatusResults: EmailStatusResult[] = []

  for (const email of pendingEmails) {
    // eslint-disable-next-line no-await-in-loop -- intentional to prevent rate limiting of 1 request per second
    await fetchEmailStatus(email.messageId, RETRY_MAX_DELAY_MS)
      .then((res) => emailStatusResults.push(res))
      .catch((_err) => null)
  }

  const successIds = []
  const failedEmailDetails: { id: number; userEmail: string; sentByEmail: string }[] = []
  const todayUTCDate = dayjs.utc()

  for (const email of pendingEmails) {
    const id = email.id
    const emailDetails = emailStatusResults.find((statusResult) => statusResult.messageId === email.messageId)

    if (!emailDetails) {
      logger.info('No information from AWS for email with messageId %s', email.messageId)
    }

    const insights = emailDetails?.insights ?? []

    const events = insights[0]?.Events ?? []

    const hoursSinceEmailSent = todayUTCDate.diff(email.timestamp.toISOString(), 'hours', true)

    if (events.some((event) => event.Type === EventType.DELIVERY)) {
      successIds.push(id)
    } else if (
      events.some(
        (event) => event.Type === EventType.BOUNCE && event.Details?.Bounce?.BounceType === BounceType.PERMANENT
      )
    ) {
      failedEmailDetails.push({
        id,
        userEmail: email.userOrganisation.user.email,
        sentByEmail: email.sentBy.email,
      })
    } else if (events.some((event) => PERMANENT_EMAIL_FAILURES.includes(event.Type ?? ''))) {
      failedEmailDetails.push({
        id,
        userEmail: email.userOrganisation.user.email,
        sentByEmail: email.sentBy.email,
      })
    } else if (hoursSinceEmailSent > EMAIL_DELIVERY_THRESHOLD_HOURS) {
      failedEmailDetails.push({
        id,
        userEmail: email.userOrganisation.user.email,
        sentByEmail: email.sentBy.email,
      })
    }
  }

  const failedIds = failedEmailDetails.map((details) => details.id)

  const updateEmailStatusPromises = [
    updateEmailStatus(invitationStatuses[UserOrganisationInviteStatus.SUCCESS], successIds),
    updateEmailStatus(invitationStatuses[UserOrganisationInviteStatus.FAILURE], failedIds),
  ]

  const [numOfSuccessfulEmailsUpdated, numOfFailedEmailsUpdated] = await Promise.all(updateEmailStatusPromises)

  logger.info(
    'Successfully updated invitation statuses. Set %s/%s emails to success and %s/%s to failed',
    numOfSuccessfulEmailsUpdated.count,
    successIds.length,
    numOfFailedEmailsUpdated.count,
    failedIds.length
  )

  if (failedEmailDetails.length > 0) {
    const emailInputs = failedEmailDetails.map(({ id, sentByEmail, userEmail }) => ({
      to: sentByEmail,
      subject: `The invitation email for a new Sponsor Contact has not been delivered successfully`,
      htmlTemplate: emailTemplates['invitation-email-unsuccessful.html.hbs'],
      textTemplate: emailTemplates['invitation-email-unsuccessful.text.hbs'],
      templateData: {
        recipientEmailAddress: userEmail,
        sponsorEngagementToolLink: getSponsorEngagementUrl(),
      },
      identifier: id,
    }))

    const successfullySentIds: number[] = []

    await emailService.sendBulkEmail(emailInputs, (_, identifier) => {
      if (identifier) successfullySentIds.push(identifier)
    })

    logger.info('Successfully sent %s/%s emails', successfullySentIds.length, failedEmailDetails.length)

    // Log `failureNotifiedAt` in DB for emails sent successfully
    if (successfullySentIds.length > 0) {
      await prismaClient.userOrganisationInvitation.updateMany({
        where: {
          id: { in: successfullySentIds },
        },
        data: {
          failureNotifiedAt: todayUTCDate.toDate(),
        },
      })
    }
  }
}
