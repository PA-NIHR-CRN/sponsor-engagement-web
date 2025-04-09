import type { SESV2 } from 'aws-sdk'
import { logger } from '@nihr-ui/logger'
import type { EmailInsightsList } from 'aws-sdk/clients/sesv2'

export interface EmailStatusResult {
  messageId: string
  insights: EmailInsightsList
}

export class EmailDeliverabilityService {
  constructor(private sesClient: SESV2) {}

  getEmailInsights = async (messageId: string): Promise<EmailStatusResult> => {
    try {
      const { MessageId, Insights } = await this.sesClient.getMessageInsights({ MessageId: messageId }).promise()

      if (!MessageId) {
        throw new Error('MessageId does not exist within the response')
      }

      return { messageId: MessageId, insights: Insights ?? [] }
    } catch (error) {
      logger.error('Error occurred fetching email status with messageId %s', messageId)

      throw error
    }
  }
}
