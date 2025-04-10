import * as aws from 'aws-sdk'
import { emailService, emailDeliverabilityService } from '.'

jest.mock('aws-sdk', () => ({
  SES: jest.fn(),
  SESV2: jest.fn(),
  config: {
    update: jest.fn(),
  },
}))

describe('EmailService', () => {
  it('should export the email service', () => {
    process.env.APP_ENV = 'prod'
    expect(aws.config.update).toHaveBeenCalledWith({ region: 'eu-west-2' })
    expect(emailService.sendEmail).toBeDefined()
  })
})

describe('EmailDeliverabilityService', () => {
  it('should export the email deliverability service', () => {
    process.env.APP_ENV = 'prod'
    expect(aws.config.update).toHaveBeenCalledWith({ region: 'eu-west-2' })
    expect(emailDeliverabilityService.getEmailInsights).toBeDefined()
  })
})
