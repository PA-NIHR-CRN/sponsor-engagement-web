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

  it('should send a bulk email with the correct parameters', async () => {
    // Mock SES sendEmail
    const sendEmailMock = jest.fn().mockResolvedValue({})
    sesClientMock.sendEmail = jest.fn().mockReturnValue({ promise: sendEmailMock })

    const templateData = { name: 'John Doe' }

    const emails: EmailArgs[] = [
      {
        to: ['recipient1@example.com', 'recipient2@example.com'],
        subject: 'Test Subject 1',
        htmlTemplate: jest.fn(() => 'html'),
        textTemplate: jest.fn(() => 'text'),
        templateData,
      },
      {
        to: ['recipient3@example.com', 'recipient4@example.com'],
        subject: 'Test Subject 2',
        htmlTemplate: jest.fn(() => 'html'),
        textTemplate: jest.fn(() => 'text'),
        templateData,
      },
    ]

    const onSuccessSpy = jest.fn()

    await emailService.sendBulkEmail(emails, onSuccessSpy)

    expect(sesClientMock.sendEmail).toHaveBeenCalledTimes(2)

    expect(sesClientMock.sendEmail).toHaveBeenCalledWith({
      Source: '"Assessmystudy" <noreply-assessmystudy@nihr.ac.uk>',
      Destination: { ToAddresses: ['recipient1@example.com', 'recipient2@example.com'] },
      Message: {
        Subject: { Data: 'Test Subject 1', Charset: 'utf-8' },
        Body: {
          Text: { Data: 'text', Charset: 'utf-8' },
          Html: { Data: 'html', Charset: 'utf-8' },
        },
      },
    })

    expect(sesClientMock.sendEmail).toHaveBeenCalledWith({
      Source: '"Assessmystudy" <noreply-assessmystudy@nihr.ac.uk>',
      Destination: { ToAddresses: ['recipient3@example.com', 'recipient4@example.com'] },
      Message: {
        Subject: { Data: 'Test Subject 2', Charset: 'utf-8' },
        Body: {
          Text: { Data: 'text', Charset: 'utf-8' },
          Html: { Data: 'html', Charset: 'utf-8' },
        },
      },
    })

    expect(logger.info).toHaveBeenCalledWith(
      'Email notification sent to %s with subject %s',
      ['recipient1@example.com', 'recipient2@example.com'],
      'Test Subject 1'
    )

    expect(logger.info).toHaveBeenCalledWith(
      'Email notification sent to %s with subject %s',
      ['recipient3@example.com', 'recipient4@example.com'],
      'Test Subject 2'
    )
  })
})
