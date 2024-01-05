import type { SES } from 'aws-sdk'
import { logger } from '@nihr-ui/logger'
import { queue, type AsyncResultCallback } from 'async'
import { EMAIL_CHARSET, EMAIL_FROM_ADDRESS, SES_RATE_LIMIT } from './constants'

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

    try {
      const { MessageId: messageId } = await this.sesClient.sendEmail(message).promise()
      logger.info('Email notification sent to %s with subject %s', to, subject)
      return {
        messageId,
        recipients,
      }
    } catch (error) {
      logger.error('Error occurred sending email notification to %s with subject %s', to, subject)
      throw error
    }
  }

  sendBulkEmail = async (emails: EmailArgs[], onSuccess: (result: EmailResult) => Promise<void>) => {
    const emailQueue = queue((email: EmailArgs, callback: AsyncResultCallback<EmailResult>) => {
      this.sendEmail(email)
        .then((result) => {
          callback(undefined, result)
        })
        .catch(callback)
    }, SES_RATE_LIMIT)

    emailQueue.push(emails, (error, result) => {
      if (!error) {
        void onSuccess(result as EmailResult)
      } else {
        logger.error(error)
      }
    })

    await emailQueue.drain()
  }
}
