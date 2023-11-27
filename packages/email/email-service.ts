import type { SES } from 'aws-sdk'
import { logger } from '@nihr-ui/logger'
import asyncPool from 'tiny-async-pool'
import { EMAIL_CHARSET, EMAIL_FROM_ADDRESS, SES_RATE_LIMIT } from './constants'

export interface EmailArgs {
  to: string | string[]
  subject: string
  htmlTemplate: (data: Record<string, unknown>) => string
  textTemplate: (data: Record<string, unknown>) => string
  templateData: Record<string, unknown>
}

export class EmailService {
  constructor(private sesClient: SES) {}

  sendEmail = async (data: EmailArgs) => {
    const { subject, to, htmlTemplate, textTemplate, templateData } = data

    const htmlBody = htmlTemplate(templateData)
    const textBody = textTemplate(templateData)

    const recipients = Array.isArray(to) ? to : [to]

    const message: SES.Types.SendEmailRequest = {
      Source: `"NIHR CRN" <${EMAIL_FROM_ADDRESS}>`,
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

    await this.sesClient.sendEmail(message).promise()

    logger.info('Email notification sent to %s with subject %s', to, subject)

    return recipients
  }

  sendBulkEmail = async (emails: readonly EmailArgs[], onSuccess: (recipients: string[]) => Promise<void>) => {
    for await (const recipients of asyncPool(SES_RATE_LIMIT, emails, this.sendEmail)) {
      await onSuccess(recipients)
    }
  }
}
