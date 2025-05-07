import * as aws from 'aws-sdk'
import { config as dotEnvConfig } from 'dotenv'
import { EmailService } from './email-service'
import { EmailDeliverabilityService } from './email-deliverability-service'

export type { EmailResult } from './email-service'

dotEnvConfig()
aws.config.update({ region: 'eu-west-2' })

const ses = new aws.SES()
const sesV2 = new aws.SESV2()

export const emailService = new EmailService(ses)

export const emailDeliverabilityService = new EmailDeliverabilityService(sesV2)
