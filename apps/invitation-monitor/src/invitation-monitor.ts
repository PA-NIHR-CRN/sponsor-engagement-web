import { Prisma } from 'database'
import { emailService } from '@nihr-ui/email'
import { config as dotEnvConfig } from 'dotenv'
import { BounceType, EventType, TooManyRequestsException } from '@aws-sdk/client-sesv2'
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs'
import { logger } from '@nihr-ui/logger'
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

const processEmails = async () => {
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

  const successfulMessageIds = []
  const failedMessageIds = []

  for (const email of pendingEmails) {
    try {
      // eslint-disable-next-line no-await-in-loop -- generator loop and to prevent getting rate limited
      const { messageId, insights } = await emailService.getEmailInsights(email.messageId)

      const events = insights[0].Events ?? [] // TODO: are we safe to only fetch the first item in the Insights array

      // console.log({ messageId, insights })
      // console.log({ events })

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
    } catch (error) {
      if (error instanceof TooManyRequestsException) {
        logger.error('Rate limit exceeded. Trying to  ')
      }

      logger.error('Error occurred whilst fetching email status')

      // Log error
      // See what the error is. If it's a retry error, wait a second and try again ?
    }
  }

  const emailPromises = [
    updateEmailStatus(successStatusId, successfulMessageIds),
    updateEmailStatus(failedStatusId, failedMessageIds),
  ]

  const [numOfSuccessfulEmailsUpdated, numOfFailedEmailsUpdated] = await Promise.all(emailPromises)

  logger.info(
    'Successfully set %s email statuses to success and %s to failed',
    numOfSuccessfulEmailsUpdated,
    numOfFailedEmailsUpdated
  )
}

export const monitorInvitationEmails = async () => {
  try {
    await processEmails()
  } catch (error) {
    logger.error(error)
  }
}
