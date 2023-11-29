import { SES } from 'aws-sdk'
import { logger } from '@nihr-ui/logger'
import { EmailService, type EmailArgs } from './email-service'

// Mock dependencies
jest.mock('aws-sdk')
jest.mock('node:fs')
jest.mock('@nihr-ui/logger')

describe('EmailService', () => {
  let sesClientMock: jest.Mocked<SES>
  let emailService: EmailService

  beforeEach(() => {
    sesClientMock = new SES() as jest.Mocked<SES>
    emailService = new EmailService(sesClientMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should send an email with the correct parameters', async () => {
    // Mock SES sendEmail
    const sendEmailMock = jest.fn().mockResolvedValue({})
    sesClientMock.sendEmail = jest.fn().mockReturnValueOnce({ promise: sendEmailMock })

    const templateData = { name: 'John Doe' }

    const emailData: EmailArgs = {
      to: 'recipient@example.com',
      subject: 'Test Subject',
      htmlTemplate: jest.fn(() => 'html'),
      textTemplate: jest.fn(() => 'text'),
      templateData,
    }

    await emailService.sendEmail(emailData)

    expect(emailData.htmlTemplate).toHaveBeenCalledWith(templateData)
    expect(emailData.textTemplate).toHaveBeenCalledWith(templateData)

    expect(sesClientMock.sendEmail).toHaveBeenCalledTimes(1)
    expect(sesClientMock.sendEmail).toHaveBeenCalledWith({
      Source: '"NIHR CRN" <noreply-assessmystudy@nihr.ac.uk>',
      Destination: { ToAddresses: ['recipient@example.com'] },
      Message: {
        Subject: { Data: 'Test Subject', Charset: 'utf-8' },
        Body: {
          Text: { Data: 'text', Charset: 'utf-8' },
          Html: { Data: 'html', Charset: 'utf-8' },
        },
      },
    })

    expect(logger.info).toHaveBeenCalledWith(
      'Email notification sent to %s with subject %s',
      'recipient@example.com',
      'Test Subject'
    )
  })
})
