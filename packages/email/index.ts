import * as aws from 'aws-sdk'
import { EmailService } from './email-service'

// Ensure sandbox is used in non prod environments
const region = process.env.APP_ENV === 'prod' ? 'eu-west-2' : 'eu-west-1'

aws.config.update({ region })

const ses = new aws.SES()

export const emailService = new EmailService(ses)
