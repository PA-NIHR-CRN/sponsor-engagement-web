import type { SES } from 'aws-sdk'
import { logger } from '@nihr-ui/logger'
import Bottleneck from 'bottleneck'
import type { EmailInsightsList } from 'aws-sdk/clients/sesv2'
import { EMAIL_CHARSET, EMAIL_FROM_ADDRESS } from '../constants'

export interface EmailArgs {
  to: string | string[]
  subject: string
  htmlTemplate: (data: Record<string, unknown>) => string
  textTemplate: (data: Record<string, unknown>) => string
  templateData: Record<string, unknown>
}

export interface EmailResult {
  messageId: string
  recipients: string[]
}

export interface EmailStatusResult {
  messageId: string
  insights: EmailInsightsList
}

export class EmailService {
  constructor(private sesClient: SES) {}

  sendEmail = async (data: EmailArgs, retries = 3): Promise<EmailResult> => {
    const { subject, to, htmlTemplate, textTemplate, templateData } = data

    const htmlBody = htmlTemplate(templateData)
    const textBody = textTemplate(templateData)

    const recipients = Array.isArray(to) ? to : [to]

    const message: SES.Types.SendEmailRequest = {
      Source: `"NIHR RDN" <${EMAIL_FROM_ADDRESS}>`,
      Destination: {
        ToAddresses: recipients,
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: EMAIL_CHARSET,
        },
        Body: {
          Text: {
            Data: textBody,
            Charset: EMAIL_CHARSET,
          },
          Html: {
            Data: htmlBody,
            Charset: EMAIL_CHARSET,
          },
        },
      },
    }

    try {
      const { MessageId: messageId } = await this.sesClient.sendEmail(message).promise()
      logger.info('Email notification sent to %s with subject %s', to, subject)
      return {
        messageId,
        recipients,
      }
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'Throttling' && retries > 0) {
        logger.info(`Rate limit exceeded. Retrying... (%s retries left)`, retries)
        await new Promise((resolve) => {
          setTimeout(resolve, 1000) // Delay 1 second
        })
        return this.sendEmail(data, retries - 1)
      }
      logger.error('Error occurred sending email notification to %s with subject %s', to, subject)
      throw error
    }
  }

  sendBulkEmail = async (emails: EmailArgs[], onSuccess: (result: EmailResult) => Promise<void>) => {
    const { MaxSendRate } = await this.sesClient.getSendQuota().promise()

    if (!MaxSendRate) {
      throw new Error('Unable to determine maximum send rate')
    }

    const sendRate = MaxSendRate / 2

    const limiter = new Bottleneck({
      reservoir: sendRate, // Maximum number of tokens available in the reservoir
      reservoirRefreshAmount: sendRate, // Refill the tokens at the given rate
      reservoirRefreshInterval: 1000, // Refill rate in milliseconds (tokens per second)
      maxConcurrent: 3, // Maximum number of concurrent requests
    })

    const emailPromises = emails.map((email) =>
      limiter.schedule(async () => {
        try {
          const result = await this.sendEmail(email)
          return onSuccess(result)
        } catch (error) {
          logger.error(error)
        }
      })
    )

    logger.info('Sending bulk email with maximum send rate: %s', sendRate)

    await Promise.all(emailPromises)
  }
}
