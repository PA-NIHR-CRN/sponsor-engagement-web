import * as fs from 'node:fs'
import path from 'node:path'
import type { SES } from 'aws-sdk'
import handlebars from 'handlebars'
import { logger } from '@nihr-ui/logger'
import { EMAIL_CHARSET, EMAIL_FROM_ADDRESS } from './constants'

handlebars.registerHelper('eq', (a, b) => a === b)

export interface EmailArgs {
  to: string
  subject: string
  templateName: 'contact-assigned' | 'contact-removed' | 'assessment-due'
  templateData: Record<string, unknown>
}

export class EmailService {
  constructor(private sesClient: SES) {}

  sendEmail = async (data: EmailArgs) => {
    const { subject, to, templateName, templateData } = data

    const htmlSource = fs.readFileSync(path.resolve(process.cwd(), `src/templates/emails/${templateName}.html.hbs`), {
      encoding: EMAIL_CHARSET,
    })
    const textSource = fs.readFileSync(path.resolve(process.cwd(), `src/templates/emails/${templateName}.text.hbs`), {
      encoding: EMAIL_CHARSET,
    })
    const htmlBody = handlebars.compile(htmlSource)(templateData)
    const textBody = handlebars.compile(textSource)(templateData)

    const message: SES.Types.SendEmailRequest = {
      Source: `"CRNCC Study Assessments" <${EMAIL_FROM_ADDRESS}>`,
      Destination: {
        ToAddresses: [to],
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
  }
}
