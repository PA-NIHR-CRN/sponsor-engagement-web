import { emailDeliverabilityService, emailService } from '@nihr-ui/email'
import { BounceType, EventType, TooManyRequestsException } from '@aws-sdk/client-sesv2'
import { monitorInvitationEmails } from '../invitation-monitor'
import { prismaMock } from '../mocks/prisma'
import { pendingEmails } from '../mocks/user-organisation-invitations'
import { mockAWSDeliveredInsight, mockAWSBouncePermanentInsight, mockAWSSentInsight } from '../mocks/insights'

const mockFetchStatusIds = () => {
  prismaMock.sysRefInvitationStatus.findMany.mockResolvedValueOnce([
    { id: 1, name: 'Success' },
    { id: 2, name: 'Pending' },
    { id: 3, name: 'Failure' },
  ])
}

const mockEmailDeliverabilityService = emailDeliverabilityService as jest.Mocked<typeof emailDeliverabilityService>
const mockEmailService = emailService as jest.Mocked<typeof emailService>

const mockGetCurrentDate = (numOfDaysToAdjust: number) => {
  const today = new Date(pendingEmails[0].timestamp)

  today.setUTCDate(pendingEmails[0].timestamp.getUTCDate() + numOfDaysToAdjust)

  return today
}

const originalEnv = { ...process.env }

const mockUserOrgInvitationFindMany = () => {
  prismaMock.userOrganisationInvitation.findMany.mockImplementation(jest.fn().mockResolvedValueOnce(pendingEmails))
}

describe('monitorInvitationEmails', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockFetchStatusIds()

    process.env.INVITE_EMAIL_DELIVERY_THRESHOLD_HOURS = '72'
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('should not make any AWS requests to fetch status when there are no pending emails', async () => {
    prismaMock.userOrganisationInvitation.findMany.mockResolvedValueOnce([])

    await monitorInvitationEmails()

    expect(prismaMock.userOrganisationInvitation.findMany).toHaveBeenCalledTimes(1)

    expect(mockEmailDeliverabilityService.getEmailInsights).not.toHaveBeenCalled()
  })

  it(`should correctly set status of email in DB to 'Success' when AWS email status is 'Delivery'`, async () => {
    mockUserOrgInvitationFindMany()

    mockEmailDeliverabilityService.getEmailInsights.mockResolvedValueOnce({
      messageId: pendingEmails[0].messageId,
      insights: [mockAWSDeliveredInsight],
    })
    prismaMock.userOrganisationInvitation.updateMany.mockResolvedValueOnce({ count: 1 })

    await monitorInvitationEmails()

    expect(prismaMock.userOrganisationInvitation.findMany).toHaveBeenCalledTimes(1)

    expect(mockEmailDeliverabilityService.getEmailInsights).toHaveBeenCalledTimes(1)
    expect(mockEmailDeliverabilityService.getEmailInsights).toHaveBeenCalledWith(pendingEmails[0].messageId)

    expect(prismaMock.userOrganisationInvitation.updateMany).toHaveBeenCalledTimes(1)
    expect(prismaMock.userOrganisationInvitation.updateMany).toHaveBeenCalledWith({
      data: {
        statusId: 1,
      },
      where: { id: { in: [pendingEmails[0].id] } },
    })
  })

  it('should not throw an error when request to fetch status from AWS fails', async () => {
    mockUserOrgInvitationFindMany()

    mockEmailDeliverabilityService.getEmailInsights.mockRejectedValueOnce(new Error())
    prismaMock.userOrganisationInvitation.updateMany.mockResolvedValue({ count: 1 })

    await expect(monitorInvitationEmails()).resolves.not.toThrow()

    expect(mockEmailDeliverabilityService.getEmailInsights).toHaveBeenCalledTimes(3) // Retries two times
  })

  it('should throw an error when DB request throws an error', async () => {
    mockUserOrgInvitationFindMany()
    mockEmailDeliverabilityService.getEmailInsights.mockResolvedValueOnce({
      messageId: pendingEmails[0].messageId,
      insights: [mockAWSDeliveredInsight],
    })
    prismaMock.userOrganisationInvitation.updateMany.mockRejectedValueOnce(new Error('Oh no, an error!'))

    await expect(monitorInvitationEmails()).rejects.toThrow()

    expect(prismaMock.userOrganisationInvitation.findMany).toHaveBeenCalledTimes(1)

    expect(mockEmailDeliverabilityService.getEmailInsights).toHaveBeenCalledTimes(1)

    expect(prismaMock.userOrganisationInvitation.updateMany).toHaveBeenCalledTimes(1)
  })

  it(`should send an email when email status is updated to 'Failure' within the DB`, async () => {
    const todaysDate = mockGetCurrentDate(0)
    jest.useFakeTimers().setSystemTime(todaysDate)

    mockUserOrgInvitationFindMany()
    mockEmailDeliverabilityService.getEmailInsights.mockResolvedValueOnce({
      messageId: pendingEmails[0].messageId,
      insights: [mockAWSBouncePermanentInsight],
    })
    mockEmailService.sendBulkEmail.mockImplementationOnce(async (_, onSuccess) => {
      await onSuccess(
        {
          recipients: [pendingEmails[0].sentBy.email],
          messageId: pendingEmails[0].messageId,
        },
        pendingEmails[0].id
      )
    })
    prismaMock.userOrganisationInvitation.updateMany.mockResolvedValue({ count: 1 })

    await monitorInvitationEmails()

    // Send email
    expect(mockEmailService.sendBulkEmail).toHaveBeenCalledTimes(1)
    expect(mockEmailService.sendBulkEmail).toHaveBeenCalledWith(
      [
        {
          to: pendingEmails[0].sentBy.email,
          subject: `The invitation email for a new Sponsor Contact has not been delivered successfully`,
          htmlTemplate: expect.any(Function),
          textTemplate: expect.any(Function),
          templateData: {
            recipientEmailAddress: pendingEmails[0].userOrganisation.user.email,
            sponsorEngagementToolLink: 'http://localhost:3000',
          },
          identifier: pendingEmails[0].id,
        },
      ],
      expect.any(Function)
    )

    expect(prismaMock.userOrganisationInvitation.updateMany).toHaveBeenCalledTimes(2)

    // Log failureNotifiedAt in DB
    expect(prismaMock.userOrganisationInvitation.updateMany).toHaveBeenNthCalledWith(2, {
      where: {
        id: {
          in: [pendingEmails[0].id],
        },
      },
      data: {
        failureNotifiedAt: todaysDate,
      },
    })

    jest.useRealTimers()
  })

  it(`should not log 'failureNotifiedAt' field in DB when email status is updated to 'Failure' within the DB AND new email was not successfully sent`, async () => {
    const todaysDate = mockGetCurrentDate(0)
    jest.useFakeTimers().setSystemTime(todaysDate)

    mockUserOrgInvitationFindMany()
    mockEmailDeliverabilityService.getEmailInsights.mockResolvedValueOnce({
      messageId: pendingEmails[0].messageId,
      insights: [mockAWSBouncePermanentInsight],
    })
    mockEmailService.sendBulkEmail.mockResolvedValueOnce()
    prismaMock.userOrganisationInvitation.updateMany.mockResolvedValue({ count: 1 })

    await monitorInvitationEmails()

    // Send email
    expect(mockEmailService.sendBulkEmail).toHaveBeenCalledTimes(1)
    expect(prismaMock.userOrganisationInvitation.updateMany).toHaveBeenCalledTimes(1) // Only once to update status
    expect(prismaMock.userOrganisationInvitation.updateMany).toHaveBeenCalledWith({
      data: {
        statusId: 3,
      },
      where: { id: { in: [pendingEmails[0].id] } },
    })
  })

  describe('given email was sent within 72 hours', () => {
    beforeAll(() => {
      jest.useFakeTimers().setSystemTime(mockGetCurrentDate(1))
    })

    afterEach(() => {
      jest.runOnlyPendingTimers()
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    it('should not throw an error when when insights array is empty', async () => {
      mockUserOrgInvitationFindMany()

      mockEmailDeliverabilityService.getEmailInsights.mockResolvedValueOnce({
        messageId: pendingEmails[0].messageId,
        insights: [],
      })

      await expect(monitorInvitationEmails()).resolves.not.toThrow()

      expect(prismaMock.userOrganisationInvitation.updateMany).not.toHaveBeenCalled()
    })

    it('should retry if initial request to fetch status from AWS fails due to too many requests', async () => {
      mockUserOrgInvitationFindMany()

      mockEmailDeliverabilityService.getEmailInsights.mockRejectedValueOnce(
        new TooManyRequestsException({ message: 'Oh no an error', $metadata: {} })
      )

      mockEmailDeliverabilityService.getEmailInsights.mockResolvedValueOnce({
        messageId: pendingEmails[0].messageId,
        insights: [mockAWSDeliveredInsight],
      })

      prismaMock.userOrganisationInvitation.updateMany.mockResolvedValueOnce({ count: 1 })

      const promise = monitorInvitationEmails()

      await jest.advanceTimersByTimeAsync(2000)

      await promise

      expect(mockEmailDeliverabilityService.getEmailInsights).toHaveBeenCalledTimes(2)
    })

    it(`should correctly set status of email in DB to 'Failure' when AWS email status is 'BOUNCE' and it has a 'PERMANENT' subtype`, async () => {
      mockUserOrgInvitationFindMany()
      mockEmailDeliverabilityService.getEmailInsights.mockResolvedValueOnce({
        messageId: pendingEmails[0].messageId,
        insights: [mockAWSBouncePermanentInsight],
      })
      prismaMock.userOrganisationInvitation.updateMany.mockResolvedValueOnce({ count: 1 })

      await monitorInvitationEmails()

      expect(prismaMock.userOrganisationInvitation.findMany).toHaveBeenCalledTimes(1)

      expect(mockEmailDeliverabilityService.getEmailInsights).toHaveBeenCalledTimes(1)
      expect(mockEmailDeliverabilityService.getEmailInsights).toHaveBeenCalledWith(pendingEmails[0].messageId)

      expect(prismaMock.userOrganisationInvitation.updateMany).toHaveBeenCalledTimes(1)
      expect(prismaMock.userOrganisationInvitation.updateMany).toHaveBeenCalledWith({
        data: {
          statusId: 3,
        },
        where: { id: { in: [pendingEmails[0].id] } },
      })
    })

    it(`should not set status of email in DB to 'Failure' when AWS email status is 'BOUNCE' and it does not have a  'PERMANENT' subtype`, async () => {
      mockUserOrgInvitationFindMany()
      mockEmailDeliverabilityService.getEmailInsights.mockResolvedValueOnce({
        messageId: pendingEmails[0].messageId,
        insights: [
          {
            ...mockAWSBouncePermanentInsight,
            Events: [
              {
                Type: EventType.BOUNCE,
                Details: {
                  Bounce: {
                    BounceType: BounceType.TRANSIENT,
                  },
                },
              },
            ],
          },
        ],
      })
      prismaMock.userOrganisationInvitation.updateMany.mockResolvedValueOnce({ count: 1 })

      await monitorInvitationEmails()

      expect(prismaMock.userOrganisationInvitation.findMany).toHaveBeenCalledTimes(1)

      expect(mockEmailDeliverabilityService.getEmailInsights).toHaveBeenCalledTimes(1)
      expect(mockEmailDeliverabilityService.getEmailInsights).toHaveBeenCalledWith(pendingEmails[0].messageId)

      expect(prismaMock.userOrganisationInvitation.updateMany).not.toHaveBeenCalled()
    })

    it.each([EventType.REJECT, EventType.RENDERING_FAILURE])(
      `should correctly set status of email in DB to 'Failure' when AWS email status is %s`,
      async (failedEmailStatus: string) => {
        mockUserOrgInvitationFindMany()
        mockEmailDeliverabilityService.getEmailInsights.mockResolvedValueOnce({
          messageId: pendingEmails[0].messageId,
          insights: [
            {
              ...mockAWSSentInsight,
              Events: [mockAWSSentInsight.Events![0], { Type: failedEmailStatus, Timestamp: new Date('2025-04-03') }],
            },
          ],
        })
        prismaMock.userOrganisationInvitation.updateMany.mockResolvedValueOnce({ count: 1 })

        await monitorInvitationEmails()

        expect(prismaMock.userOrganisationInvitation.findMany).toHaveBeenCalledTimes(1)

        expect(mockEmailDeliverabilityService.getEmailInsights).toHaveBeenCalledTimes(1)
        expect(mockEmailDeliverabilityService.getEmailInsights).toHaveBeenCalledWith(pendingEmails[0].messageId)

        expect(prismaMock.userOrganisationInvitation.updateMany).toHaveBeenCalledTimes(1)
        expect(prismaMock.userOrganisationInvitation.updateMany).toHaveBeenCalledWith({
          data: {
            statusId: 3,
          },
          where: { id: { in: [pendingEmails[0].id] } },
        })
      }
    )

    it(`should not update the status of email in DB when AWS email status is not 'Delivery' or in our pre-defined failed list`, async () => {
      mockUserOrgInvitationFindMany()
      mockEmailDeliverabilityService.getEmailInsights.mockResolvedValueOnce({
        messageId: pendingEmails[0].messageId,
        insights: [mockAWSSentInsight],
      })
      prismaMock.userOrganisationInvitation.updateMany.mockResolvedValueOnce({ count: 1 })

      await monitorInvitationEmails()

      expect(prismaMock.userOrganisationInvitation.findMany).toHaveBeenCalledTimes(1)

      expect(mockEmailDeliverabilityService.getEmailInsights).toHaveBeenCalledTimes(1)
      expect(mockEmailDeliverabilityService.getEmailInsights).toHaveBeenCalledWith(pendingEmails[0].messageId)

      expect(prismaMock.userOrganisationInvitation.updateMany).not.toHaveBeenCalled()
    })
  })

  describe('email sent after 72 hours', () => {
    beforeAll(() => {
      jest.useFakeTimers().setSystemTime(mockGetCurrentDate(4))
    })

    afterAll(() => {
      jest.useRealTimers()
    })

    it(`should correctly set status of email in DB to 'Failure' when AWS email status is not 'Delivery' or in our pre-defined failed list`, async () => {
      mockUserOrgInvitationFindMany()
      mockEmailDeliverabilityService.getEmailInsights.mockResolvedValueOnce({
        messageId: pendingEmails[0].messageId,
        insights: [mockAWSSentInsight],
      })
      prismaMock.userOrganisationInvitation.updateMany.mockResolvedValueOnce({ count: 1 })

      await monitorInvitationEmails()

      expect(prismaMock.userOrganisationInvitation.findMany).toHaveBeenCalledTimes(1)

      expect(mockEmailDeliverabilityService.getEmailInsights).toHaveBeenCalledTimes(1)
      expect(mockEmailDeliverabilityService.getEmailInsights).toHaveBeenCalledWith(pendingEmails[0].messageId)

      expect(prismaMock.userOrganisationInvitation.updateMany).toHaveBeenCalledTimes(1)
      expect(prismaMock.userOrganisationInvitation.updateMany).toHaveBeenCalledWith({
        data: {
          statusId: 3,
        },
        where: { id: { in: [pendingEmails[0].id] } },
      })
    })
  })
})
