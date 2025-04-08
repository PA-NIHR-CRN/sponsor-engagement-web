import assert from 'assert'
import { Prisma } from 'database'
import { emailService } from '@nihr-ui/email'
import { config as dotEnvConfig } from 'dotenv'
import { BounceType, EventType, TooManyRequestsException } from '@aws-sdk/client-sesv2'
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs'
import { logger } from '@nihr-ui/logger'
import type { EmailStatusResult } from '@nihr-ui/email/email-service'
import { retry } from '@lifeomic/attempt'
import { PERMANENT_EMAIL_FAILURES, UserOrganisationInviteStatus } from './lib/constants'
import { prismaClient } from './lib/prisma'
import type { UserOrgnaisationInvitations } from './types'

dotEnvConfig()
// eslint-disable-next-line import/no-named-as-default-member -- intentional to use this extend from dayjs obj
dayjs.extend(utc)

const fetchPendingEmails = async (pendingStatusId: number): Promise<UserOrgnaisationInvitations> => {
  return prismaClient.userOrganisationInvitation.findMany({
    where: { statusId: pendingStatusId },
    distinct: ['userOrganisationId'],
    orderBy: {
      createdAt: Prisma.SortOrder.desc,
    },
    select: {
      id: true,
      messageId: true,
      timestamp: true,
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

const fetchEmailStatus = async (emailMessageId: string): Promise<EmailStatusResult | null> => {
  const { messageId, insights } = await emailService.getEmailInsights(emailMessageId)

  return { messageId, insights }
}

const fetchEmailStatusWithRetries = async (
  emailMessageId: string,
  maxAttempts = 3
): Promise<EmailStatusResult | null> => {
  try {
    return await retry(
      async () => {
        return fetchEmailStatus(emailMessageId)
      },
      {
        delay: 1000,
        maxAttempts,
        handleError: (error, context) => {
          logger.error('Error occurred fetching email status for messageId: %s, error: %s', emailMessageId, error)

          // Only retry if error is 'TooManyRequestsException'
          if (!(error instanceof TooManyRequestsException)) {
            context.abort()
          } else if (context.attemptsRemaining > 0) {
            logger.error(
              'Attempting to fetch email status again for messageId: %s, %s/%s retries, error: %s',
              emailMessageId,
              context.attemptNum + 1,
              maxAttempts - 1,
              error
            )
          }
        },
      }
    )
  } catch (error) {
    return null
  }
}

export const monitorInvitationEmails = async () => {
  assert(
    process.env.INVITE_EMAIL_DELIVERY_THRESHOLD_HOURS,
    'INVITE_EMAIL_DELIVERY_THRESHOLD_HOURS env var is not defined'
  )
  const EMAIL_DELIVERY_THRESHOLD_HOURS = process.env.INVITE_EMAIL_DELIVERY_THRESHOLD_HOURS
    ? Number(process.env.INVITE_EMAIL_DELIVERY_THRESHOLD_HOURS)
    : 72

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

  const getEmailStatusPromises = pendingEmails.map((email) => fetchEmailStatusWithRetries(email.messageId))
  const emailStatusResults = await Promise.all(getEmailStatusPromises)
  const successIds = []
  const failedIds = []
  const todayUTCDate = dayjs.utc()

  for (const email of pendingEmails) {
    const id = email.id
    const emailDetails = emailStatusResults.find((results) => results?.messageId === email.messageId)

    if (!emailDetails) {
      logger.info('No information for email with messageId %s', email.messageId)

      continue
    }

    const { insights } = emailDetails
    const events = insights[0]?.Events ?? []

    const hoursSinceEmailSent = todayUTCDate.diff(email.timestamp.toISOString(), 'hours', true)

    if (events.some((event) => event.Type === EventType.DELIVERY)) {
      successIds.push(id)
    } else if (
      events.some(
        (event) => event.Type === EventType.BOUNCE && event.Details?.Bounce?.BounceType === BounceType.PERMANENT
      )
    ) {
      failedIds.push(id)
    } else if (events.some((event) => PERMANENT_EMAIL_FAILURES.includes(event.Type ?? ''))) {
      failedIds.push(id)
    } else if (hoursSinceEmailSent > EMAIL_DELIVERY_THRESHOLD_HOURS) {
      failedIds.push(id)
    }
  }

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
}
