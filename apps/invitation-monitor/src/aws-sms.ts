import { emailDeliverabilityService } from '@nihr-ui/email'
import { config as dotEnvConfig } from 'dotenv'
import type { InsightsEvent } from '@aws-sdk/client-sesv2'
import { BounceType, EventType } from '@aws-sdk/client-sesv2'
import utc from 'dayjs/plugin/utc'
import dayjs from 'dayjs'
import { logger } from '@nihr-ui/logger'
import type { EmailStatusResult } from '@nihr-ui/email/email-deliverability-service'
import { retry } from '@lifeomic/attempt'
import {
  AWS_GET_MESSAGE_INSIGHTS_RATE_LIMIT_MS,
  PERMANENT_EMAIL_FAILURES,
  RETRYABLE_SES_ERRORS,
} from './lib/constants'

dotEnvConfig()
// eslint-disable-next-line import/no-named-as-default-member -- intentional to use this extend from dayjs obj
dayjs.extend(utc)

const fetchEmailStatusInner = async (emailMessageId: string): Promise<EmailStatusResult> => {
  const { messageId, insights } = await emailDeliverabilityService.getEmailInsights(emailMessageId)

  return { messageId, insights }
}

export const fetchEmailStatus = async (
  emailMessageId: string,
  maxDelay: number,
  maxAttempts = 3,
  previousRequestTime = 0
): Promise<{ data: EmailStatusResult | null } & { requestedAt: number }> => {
  const timeSinceLastRequest = Date.now() - previousRequestTime
  const initialDelay =
    timeSinceLastRequest < AWS_GET_MESSAGE_INSIGHTS_RATE_LIMIT_MS
      ? AWS_GET_MESSAGE_INSIGHTS_RATE_LIMIT_MS - timeSinceLastRequest
      : 0

  let requestTime = 0

  try {
    const result = await retry(
      async () => {
        requestTime = Date.now()
        const emailStatusResult = await fetchEmailStatusInner(emailMessageId)
        return { data: emailStatusResult, requestedAt: requestTime }
      },
      {
        delay: 3000,
        maxAttempts,
        jitter: true,
        minDelay: 1000,
        maxDelay,
        factor: 2,
        initialDelay,
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

    return result
  } catch (error) {
    return { data: null, requestedAt: requestTime }
  }
}

export const hasEmailFailed = (events: InsightsEvent[], hoursSinceEmailSent: number) => {
  const EMAIL_DELIVERY_THRESHOLD_HOURS = process.env.INVITE_EMAIL_DELIVERY_THRESHOLD_HOURS
    ? Number(process.env.INVITE_EMAIL_DELIVERY_THRESHOLD_HOURS)
    : 72

  return (
    events.some(
      (event) => event.Type === EventType.BOUNCE && event.Details?.Bounce?.BounceType === BounceType.PERMANENT // Permanent bounce
    ) ||
    events.some((event) => PERMANENT_EMAIL_FAILURES.includes(event.Type ?? '')) || // Permanent failure
    hoursSinceEmailSent > EMAIL_DELIVERY_THRESHOLD_HOURS // Undelivered after expected threshold
  )
}