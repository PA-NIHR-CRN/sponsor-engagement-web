import * as fs from 'node:fs'
import path from 'node:path'
import { SES } from 'aws-sdk'
import handlebars from 'handlebars'
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
    const readFileSyncMock = jest.mocked(fs.readFileSync)

    // Mock file system readFileSync
    readFileSyncMock.mockReturnValueOnce('HTML_CONTENT')
    readFileSyncMock.mockReturnValueOnce('TEXT_CONTENT')

    // Mock handlebars compile
    const compileMock = jest.spyOn(handlebars, 'compile')
    compileMock.mockReturnValueOnce((data) => `COMPILED_HTML(${JSON.stringify(data)})`)
    compileMock.mockReturnValueOnce((data) => `COMPILED_TEXT(${JSON.stringify(data)})`)

    // Mock SES sendEmail
    const sendEmailMock = jest.fn().mockResolvedValue({})
    sesClientMock.sendEmail = jest.fn().mockReturnValueOnce({ promise: sendEmailMock })

    const emailData: EmailArgs = {
      to: 'recipient@example.com',
      subject: 'Test Subject',
      templateName: 'contact-assigned',
      templateData: { name: 'John Doe' },
    }

    await emailService.sendEmail(emailData)

    expect(readFileSyncMock).toHaveBeenCalledTimes(2)
    expect(readFileSyncMock).toHaveBeenNthCalledWith(
      1,
      path.resolve(process.cwd(), 'public/email/templates/contact-assigned.html.hbs'),
      { encoding: 'utf-8' }
    )
    expect(readFileSyncMock).toHaveBeenNthCalledWith(
      2,
      path.resolve(process.cwd(), 'public/email/templates/contact-assigned.text.hbs'),
      { encoding: 'utf-8' }
    )

    expect(compileMock).toHaveBeenCalledTimes(2)
    expect(compileMock).toHaveBeenNthCalledWith(1, 'HTML_CONTENT')
    expect(compileMock).toHaveBeenNthCalledWith(2, 'TEXT_CONTENT')

    expect(sesClientMock.sendEmail).toHaveBeenCalledTimes(1)
    expect(sesClientMock.sendEmail).toHaveBeenCalledWith({
      Source: '"CRNCC Study Assessments" <crncc-study-assessments@nihr.ac.uk>',
      Destination: { ToAddresses: ['recipient@example.com'] },
      Message: {
        Subject: { Data: 'Test Subject', Charset: 'utf-8' },
        Body: {
          Text: { Data: 'COMPILED_TEXT({"name":"John Doe"})', Charset: 'utf-8' },
          Html: { Data: 'COMPILED_HTML({"name":"John Doe"})', Charset: 'utf-8' },
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
