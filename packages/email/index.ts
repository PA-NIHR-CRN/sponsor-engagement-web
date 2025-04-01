import * as aws from 'aws-sdk'
import { EmailService } from './email-service'

export type { EmailResult } from './email-service'

aws.config.update({ region: 'eu-west-2' })

const ses = new aws.SES()
const sesV2 = new aws.SESV2()

export const emailService = new EmailService(ses, sesV2)
