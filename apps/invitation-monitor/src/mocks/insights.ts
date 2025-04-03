import type { EmailInsights } from '@aws-sdk/client-sesv2'

export const mockAWSDeliveredInsight: EmailInsights = {
  Destination: 'test.user@nihr.com',
  Isp: 'UNKNOWN_ISP',
  Events: [
    { Timestamp: new Date('2025-04-02'), Type: 'SEND' },
    { Timestamp: new Date('2025-04-03'), Type: 'DELIVERY' },
  ],
}

export const mockAWSBouncePermanentInsight: EmailInsights = {
  Destination: 'test.user@nihr.com',
  Isp: 'UNKNOWN_ISP',
  Events: [
    { Timestamp: new Date('2025-04-02'), Type: 'SEND' },
    {
      Timestamp: new Date('2025-04-03'),
      Type: 'BOUNCE',
      Details: {
        Bounce: {
          BounceType: 'PERMANENT',
          BounceSubType: 'GENERAL',
        },
      },
    },
  ],
}

export const mockAWSSentInsight: EmailInsights = {
  Destination: 'test.user@nihr.com',
  Isp: 'UNKNOWN_ISP',
  Events: [{ Timestamp: new Date('2025-04-02'), Type: 'SEND' }],
}
