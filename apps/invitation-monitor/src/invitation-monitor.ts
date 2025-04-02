import { Prisma } from 'database'
import { emailService } from '@nihr-ui/email'
import { config as dotEnvConfig } from 'dotenv'
import { BounceType, EventType, NotFoundException, TooManyRequestsException } from '@aws-sdk/client-sesv2'
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs'
import { logger } from '@nihr-ui/logger'
import type { EmailStatusResult } from '@nihr-ui/email/email-service'
import { EMAIL_DELIVERY_THRESHOLD_HOURS, EMAIL_FAILURES, UserOrganisationInviteStatus } from './lib/constants'
import { prismaClient } from './lib/prisma'

dotEnvConfig()
dayjs.extend(utc)

const fetchPendingEmails = async (pendingStatusId: number) => {
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

const updateEmailStatus = async (statusId: number, idsToUpdate: string[]) => {
  return prismaClient.userOrganisationInvitation.updateMany({
    data: {
      statusId,
    },
    where: { messageId: { in: idsToUpdate } },
  })
}

const fetchEmailStatus = async (
  emailMessageId: string,
  retryCount: number,
  maxRetries = 2
): Promise<EmailStatusResult | null> => {
  if (retryCount === maxRetries) return null

  try {
    const { messageId, insights } = await emailService.getEmailInsights(emailMessageId)

    return { messageId, insights }
  } catch (error) {
    logger.error('Error occurred fetching email status for messageId %s, retry count %s', emailMessageId, retryCount)

    if (error instanceof TooManyRequestsException && retryCount !== maxRetries) {
      logger.error('Rate limit exceeded. Trying again... ')

      await new Promise((resolve) => {
        setTimeout(resolve, 1000) // Delay 1 second
      })

      return fetchEmailStatus(emailMessageId, 2)
    }

    if (error instanceof NotFoundException) {
      logger.error('Email with messageId %s does not exist', emailMessageId)

      return null
    }

    return null
  }
}

const processEmails = async () => {
  // Fetch status ids for each email status
  const { id: pendingStatusId } = await prismaClient.sysRefInvitationStatus.findFirstOrThrow({
    where: { name: UserOrganisationInviteStatus.PENDING },
  })

  const { id: successStatusId } = await prismaClient.sysRefInvitationStatus.findFirstOrThrow({
    where: { name: UserOrganisationInviteStatus.SUCCESS },
  })

  const { id: failedStatusId } = await prismaClient.sysRefInvitationStatus.findFirstOrThrow({
    where: { name: UserOrganisationInviteStatus.FAILURE },
  })

  const pendingEmails = await fetchPendingEmails(pendingStatusId)

  logger.info('Succesfully fetched %s pending emails', pendingEmails.length)

  if (pendingEmails.length === 0) {
    return
  }

  const getEmailStatusPromises = pendingEmails.map((email) => fetchEmailStatus(email.messageId, 1))
  const emailStatusDetails = await Promise.all(getEmailStatusPromises)

  const successfulMessageIds = []
  const failedMessageIds = []

  for (const email of pendingEmails) {
    const messageId = email.messageId

    const emailDetails = emailStatusDetails.find((details) => details?.messageId === email.messageId)

    if (!emailDetails) {
      logger.info('No details for email with messageId %s', email.messageId)

      continue
    }

    const { insights } = emailDetails

    const events = insights[0].Events ?? [] // TODO: are we safe to only fetch the first item in the Insights array

    events.sort((a, b) => new Date(b.Timestamp ?? 0).getTime() - new Date(a.Timestamp ?? 0).getTime())

    const latestEvent = events[0]
    const hoursSinceEmailSent = dayjs.utc().diff(latestEvent.Timestamp, 'hours')

    if (latestEvent.Type === EventType.DELIVERY) {
      successfulMessageIds.push(messageId)
    } else if (
      latestEvent.Type === EventType.BOUNCE &&
      latestEvent.Details?.Bounce?.BounceType === BounceType.PERMANENT
    ) {
      failedMessageIds.push(messageId)
    } else if (EMAIL_FAILURES.includes(latestEvent.Type ?? '')) {
      failedMessageIds.push(messageId)
    } else if (hoursSinceEmailSent > EMAIL_DELIVERY_THRESHOLD_HOURS) {
      failedMessageIds.push(messageId)
    }
  }

  const updateEmailStatusPromises = [
    updateEmailStatus(successStatusId, successfulMessageIds),
    updateEmailStatus(failedStatusId, failedMessageIds),
  ]

  const [numOfSuccessfulEmailsUpdated, numOfFailedEmailsUpdated] = await Promise.all(updateEmailStatusPromises)

  logger.info(
    'Successfully set %s emails to success and %s to failed',
    numOfSuccessfulEmailsUpdated.count,
    numOfFailedEmailsUpdated.count
  )
}

export const monitorInvitationEmails = async () => {
  try {
    await processEmails()
  } catch (error) {
    logger.error(error)
  }
}
