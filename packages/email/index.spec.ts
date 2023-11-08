import { emailService } from '.'

jest.mock('aws-sdk')

describe('EmailService', () => {
  it('should export the email service', () => {
    expect(emailService.sendEmail).toBeDefined()
  })
})
