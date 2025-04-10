import { SES } from 'aws-sdk'
import { logger } from '@nihr-ui/logger'
import { EmailService, type EmailArgs } from '.'

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
    const sendEmailMock = jest.fn().mockResolvedValue({ MessageId: '123' })
    sesClientMock.sendEmail = jest.fn().mockReturnValueOnce({ promise: sendEmailMock })

    const templateData = { name: 'John Doe' }

    const emailData: EmailArgs = {
      to: 'recipient@example.com',
      subject: 'Test Subject',
      htmlTemplate: jest.fn(() => 'html'),
      textTemplate: jest.fn(() => 'text'),
      templateData,
    }

    const result = await emailService.sendEmail(emailData)

    expect(result).toStrictEqual({
      messageId: '123',
      recipients: ['recipient@example.com'],
    })

    expect(emailData.htmlTemplate).toHaveBeenCalledWith(templateData)
    expect(emailData.textTemplate).toHaveBeenCalledWith(templateData)

    expect(sesClientMock.sendEmail).toHaveBeenCalledTimes(1)
    expect(sesClientMock.sendEmail).toHaveBeenCalledWith({
      Source: '"NIHR RDN" <noreply-assessmystudy@nihr.ac.uk>',
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

  it('should handle errors when sending an email', async () => {
    // Mock SES sendEmail
    const sendEmailMock = jest.fn().mockRejectedValueOnce(new Error('test error'))
    sesClientMock.sendEmail = jest.fn().mockReturnValueOnce({ promise: sendEmailMock })

    const templateData = { name: 'John Doe' }

    const emailData: EmailArgs = {
      to: 'recipient@example.com',
      subject: 'Test Subject',
      htmlTemplate: jest.fn(() => 'html'),
      textTemplate: jest.fn(() => 'text'),
      templateData,
    }

    await expect(emailService.sendEmail(emailData)).rejects.toThrow('test error')

    expect(logger.error).toHaveBeenCalledWith(
      'Error occurred sending email notification to %s with subject %s',
      'recipient@example.com',
      'Test Subject'
    )
  })

  it('should perform a set number of retries if SES returns a rate limit error', async () => {
    jest.useFakeTimers()

    // Mock SES sendEmail
    const sesError: Error & { code?: string } = new Error('Rate limit error')
    sesError.code = 'Throttling'
    const sendEmailMock = jest.fn().mockRejectedValue(sesError)
    sesClientMock.sendEmail = jest.fn().mockReturnValue({ promise: sendEmailMock })

    const email: EmailArgs = {
      to: ['recipient1@example.com', 'recipient2@example.com'],
      subject: 'Test Subject 1',
      htmlTemplate: jest.fn(() => 'html'),
      textTemplate: jest.fn(() => 'text'),
      templateData: { name: 'John Doe' },
    }

    const promise = emailService.sendEmail(email)

    await jest.runOnlyPendingTimersAsync()

    expect(logger.info).toHaveBeenNthCalledWith(1, 'Rate limit exceeded. Retrying... (%s retries left)', 3)

    await jest.runOnlyPendingTimersAsync()

    expect(logger.info).toHaveBeenNthCalledWith(2, 'Rate limit exceeded. Retrying... (%s retries left)', 2)

    jest.runOnlyPendingTimers()

    expect(logger.info).toHaveBeenNthCalledWith(3, 'Rate limit exceeded. Retrying... (%s retries left)', 1)

    await expect(promise).rejects.toThrow('Rate limit error')

    expect(sesClientMock.sendEmail).toHaveBeenCalledTimes(4)

    jest.useRealTimers()
  })

  it('should send a bulk email with the correct parameters', async () => {
    // Mock SES sendEmail
    const sendEmailMock = jest.fn().mockResolvedValue({ MessageId: 123 })
    sesClientMock.sendEmail = jest.fn().mockReturnValue({ promise: sendEmailMock })

    // Mock SES getSendQuota
    const getSendQuotaMock = jest.fn().mockResolvedValue({ MaxSendRate: 14 })
    sesClientMock.getSendQuota = jest.fn().mockReturnValueOnce({ promise: getSendQuotaMock })

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
      Source: '"NIHR RDN" <noreply-assessmystudy@nihr.ac.uk>',
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
      Source: '"NIHR RDN" <noreply-assessmystudy@nihr.ac.uk>',
      Destination: { ToAddresses: ['recipient3@example.com', 'recipient4@example.com'] },
      Message: {
        Subject: { Data: 'Test Subject 2', Charset: 'utf-8' },
        Body: {
          Text: { Data: 'text', Charset: 'utf-8' },
          Html: { Data: 'html', Charset: 'utf-8' },
        },
      },
    })

    expect(onSuccessSpy).toHaveBeenCalledTimes(2)

    expect(onSuccessSpy).toHaveBeenCalledWith({
      messageId: 123,
      recipients: ['recipient1@example.com', 'recipient2@example.com'],
    })

    expect(onSuccessSpy).toHaveBeenLastCalledWith({
      messageId: 123,
      recipients: ['recipient3@example.com', 'recipient4@example.com'],
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

  it('should handle errors when sending a bulk email', async () => {
    // Mock SES sendEmail
    const sendEmailMock = jest.fn()

    sesClientMock.sendEmail = jest.fn().mockReturnValue({ promise: sendEmailMock })

    sendEmailMock.mockRejectedValueOnce('test error')
    sendEmailMock.mockResolvedValueOnce({ MessageId: '123' })

    // Mock SES getSendQuota
    const getSendQuotaMock = jest.fn().mockResolvedValue({ MaxSendRate: 14 })
    sesClientMock.getSendQuota = jest.fn().mockReturnValueOnce({ promise: getSendQuotaMock })

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

    expect(onSuccessSpy).toHaveBeenCalledTimes(1)

    expect(onSuccessSpy).toHaveBeenLastCalledWith({
      messageId: '123',
      recipients: ['recipient3@example.com', 'recipient4@example.com'],
    })

    expect(logger.info).toHaveBeenCalledWith(
      'Email notification sent to %s with subject %s',
      ['recipient3@example.com', 'recipient4@example.com'],
      'Test Subject 2'
    )

    expect(logger.error).toHaveBeenCalledWith('test error')
  })

  it('should rate limit according to the SES maximum send rate', async () => {
    jest.useFakeTimers()

    // Mock SES sendEmail
    const sendEmailMock = jest.fn().mockResolvedValue({ MessageId: 123 })
    sesClientMock.sendEmail = jest.fn().mockReturnValue({ promise: sendEmailMock })

    // Mock SES getSendQuota
    const getSendQuotaMock = jest.fn().mockResolvedValue({ MaxSendRate: 2 }) // MaxSendRate will be halved so we expect 1 email per second
    sesClientMock.getSendQuota = jest.fn().mockReturnValueOnce({ promise: getSendQuotaMock })

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

    void emailService.sendBulkEmail(emails, jest.fn())

    expect(sesClientMock.sendEmail).toHaveBeenCalledTimes(0)

    await jest.advanceTimersByTimeAsync(1000)

    expect(sesClientMock.sendEmail).toHaveBeenCalledTimes(1)

    await jest.advanceTimersByTimeAsync(1000)

    expect(sesClientMock.sendEmail).toHaveBeenCalledTimes(2)

    jest.useRealTimers()
  })

  it('should throw an error if the maximum send rate is not obtainable', async () => {
    // Mock SES getSendQuota
    const getSendQuotaMock = jest.fn().mockResolvedValue({})
    sesClientMock.getSendQuota = jest.fn().mockReturnValueOnce({ promise: getSendQuotaMock })

    await expect(emailService.sendBulkEmail([], jest.fn())).rejects.toThrow('Unable to determine maximum send rate')
  })
})
