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
          DiagnosticCode:
            'smtp; 550 4.4.7 Message expired: unable to deliver in 840 minutes.<421 4.4.0 Unable to lookup DNS for paconsuling.com>',
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
