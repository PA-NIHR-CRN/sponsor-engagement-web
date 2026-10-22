import { Prisma } from 'database'
import { config as dotEnvConfig } from 'dotenv'
import { EventType } from '@aws-sdk/client-sesv2'
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs'
import { logger } from '@nihr-ui/logger'
import { UserOrganisationInviteStatus } from './lib/constants'
import { prismaClient } from './lib/prisma'
import type {Notification} from './types'
import {fetchEmailStatus, hasEmailFailed} from "./aws-sms"

dotEnvConfig()
// eslint-disable-next-line import/no-named-as-default-member -- intentional to use this extend from dayjs obj
dayjs.extend(utc)

const fetchPendingNotifications = async (pendingStatusId: number): Promise<Notification> => {
  return prismaClient.notification.findMany({
    where: { statusId: pendingStatusId },
    orderBy: {
      createdAt: Prisma.SortOrder.desc,
    },
    select: {
      id: true,
      messageId: true,
      timestamp: true    
    },
  })
}

const updateNotificationStatus = async (statusId: number, idsToUpdate: number[]) => {
  if (idsToUpdate.length === 0) return { count: 0 }

  return prismaClient.notification.updateMany({
    data: {
      statusId,
    },
    where: { id: { in: idsToUpdate } },
  })
}


export const monitorNotifications = async () => {
  const RETRY_MAX_DELAY_MS = process.env.FETCH_EMAIL_RETRY_MAX_DELAY_MS
    ? Number(process.env.FETCH_EMAIL_RETRY_MAX_DELAY_MS)
    : 6000

  // Fetch status ids for each email status
  const refInvitationStatusResponse = await prismaClient.sysRefInvitationStatus.findMany()
  const invitationStatuses: Record<string, number> = refInvitationStatusResponse.reduce((dictionary, { id, name }) => {
    return { ...dictionary, [name]: id }
  }, {})

  const pendingEmails = await fetchPendingNotifications(invitationStatuses[UserOrganisationInviteStatus.PENDING])

  logger.info('Succesfully fetched %s pending emails', pendingEmails.length)

  if (pendingEmails.length === 0) {
    return
  }

  const successIds: number[] = []
  const failedIds: number[] = []
  
  const todayUTCDate = dayjs.utc()

  let previousRequestTime

  for (const email of pendingEmails) {
    const id = email.id

    // eslint-disable-next-line no-await-in-loop -- intentional to prevent rate limiting of 1 request per second
    const result = await fetchEmailStatus(email.messageId, RETRY_MAX_DELAY_MS, 3, previousRequestTime)

    const emailDetails = result.data

    const insights = emailDetails?.insights ?? []

    const events = insights[0]?.Events ?? []

    const hoursSinceEmailSent = todayUTCDate.diff(email.timestamp.toISOString(), 'hours', true)

    if (events.some((event) => event.Type === EventType.DELIVERY)) {
      successIds.push(id)
    } else if (hasEmailFailed(events, hoursSinceEmailSent)) {
      failedIds.push(id)
    }

    previousRequestTime = result.requestedAt
  }

  const updateEmailStatusPromises = [
    updateNotificationStatus(invitationStatuses[UserOrganisationInviteStatus.SUCCESS], successIds),
    updateNotificationStatus(invitationStatuses[UserOrganisationInviteStatus.FAILURE], failedIds),
  ]

  const [numOfSuccessfulEmailsUpdated, numOfFailedEmailsUpdated] = await Promise.all(updateEmailStatusPromises)

  logger.info(
    'Successfully updated notification statuses. Set %s/%s emails to success and %s/%s to failed',
    numOfSuccessfulEmailsUpdated.count,
    successIds.length,
    numOfFailedEmailsUpdated.count,
    failedIds.length
  )
}
