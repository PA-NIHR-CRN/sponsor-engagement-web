import * as aws from 'aws-sdk'
import { EmailService } from './email-service'

aws.config.update({ region: 'eu-west-1' })

const ses = new aws.SES()

export const emailService = new EmailService(ses)
