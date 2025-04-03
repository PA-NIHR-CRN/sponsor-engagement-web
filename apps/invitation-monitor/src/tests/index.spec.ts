import { emailService } from '@nihr-ui/email'
import { TooManyRequestsException } from '@aws-sdk/client-sesv2'
import { monitorInvitationEmails } from '../invitation-monitor'
import { prismaMock } from '../mocks/prisma'
import { pendingEmails } from '../mocks/user-organisation-invitations'
import { mockAWSDeliveredInsight, mockAWSBouncePermanentInsight, mockAWSRejectedInsight } from '../mocks/insights'

const mockFetchStatusIds = () => {
  prismaMock.sysRefInvitationStatus.findFirstOrThrow.mockResolvedValueOnce({ id: 2, name: 'Pending' })
  prismaMock.sysRefInvitationStatus.findFirstOrThrow.mockResolvedValueOnce({ id: 1, name: 'Success' })
  prismaMock.sysRefInvitationStatus.findFirstOrThrow.mockResolvedValueOnce({ id: 3, name: 'Failure' })
}

const mockEmailService = emailService as jest.Mocked<typeof emailService>

const mockGetCurrentDate = (numOfDaysToAdjust: number) => {
  const today = new Date()

  today.setUTCDate(pendingEmails[0].timestamp.getUTCDate() + numOfDaysToAdjust)
  today.setUTCMonth(pendingEmails[0].timestamp.getUTCMonth())
  today.setUTCFullYear(pendingEmails[0].timestamp.getUTCFullYear())

  return today
}
describe('monitorInvitationEmails', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockFetchStatusIds()
  })

  it('should not make any AWS requests to fetch status when there are no pending emails', async () => {
    prismaMock.userOrganisationInvitation.findMany.mockResolvedValueOnce([])

    await monitorInvitationEmails()

    expect(prismaMock.sysRefInvitationStatus.findFirstOrThrow).toHaveBeenCalledTimes(3)
    expect(prismaMock.userOrganisationInvitation.findMany).toHaveBeenCalledTimes(1)

    expect(mockEmailService.getEmailInsights).not.toHaveBeenCalled()
  })

  it(`should correctly set status of email in SE DB to 'Success' when AWS email status is 'Delivery'`, async () => {
    prismaMock.userOrganisationInvitation.findMany.mockResolvedValueOnce(pendingEmails)
    mockEmailService.getEmailInsights.mockResolvedValueOnce({
      messageId: pendingEmails[0].messageId,
      insights: [mockAWSDeliveredInsight],
    })
    prismaMock.userOrganisationInvitation.updateMany.mockResolvedValueOnce({ count: 1 })

    await monitorInvitationEmails()

    expect(prismaMock.sysRefInvitationStatus.findFirstOrThrow).toHaveBeenCalledTimes(3)
    expect(prismaMock.userOrganisationInvitation.findMany).toHaveBeenCalledTimes(1)

    expect(mockEmailService.getEmailInsights).toHaveBeenCalledTimes(1)
    expect(mockEmailService.getEmailInsights).toHaveBeenCalledWith(pendingEmails[0].messageId)

    expect(prismaMock.userOrganisationInvitation.updateMany).toHaveBeenCalledTimes(1)
    expect(prismaMock.userOrganisationInvitation.updateMany).toHaveBeenCalledWith({
      data: {
        statusId: 1,
      },
      where: { messageId: { in: [pendingEmails[0].messageId] } },
    })
  })

  it(`should correctly set status of email in SE DB to 'Failure' when AWS email status is 'BOUNCE' and it has a 'PERMANENT' subtype`, async () => {
    prismaMock.userOrganisationInvitation.findMany.mockResolvedValueOnce(pendingEmails)
    mockEmailService.getEmailInsights.mockResolvedValueOnce({
      messageId: pendingEmails[0].messageId,
      insights: [mockAWSBouncePermanentInsight],
    })
    prismaMock.userOrganisationInvitation.updateMany.mockResolvedValueOnce({ count: 1 })

    await monitorInvitationEmails()

    expect(prismaMock.sysRefInvitationStatus.findFirstOrThrow).toHaveBeenCalledTimes(3)
    expect(prismaMock.userOrganisationInvitation.findMany).toHaveBeenCalledTimes(1)

    expect(mockEmailService.getEmailInsights).toHaveBeenCalledTimes(1)
    expect(mockEmailService.getEmailInsights).toHaveBeenCalledWith(pendingEmails[0].messageId)

    expect(prismaMock.userOrganisationInvitation.updateMany).toHaveBeenCalledTimes(1)
    expect(prismaMock.userOrganisationInvitation.updateMany).toHaveBeenCalledWith({
      data: {
        statusId: 3,
      },
      where: { messageId: { in: [pendingEmails[0].messageId] } },
    })
  })

  it(`should correctly set status of email in SE DB to 'Failure' when AWS email status is in our predefined failure list`, async () => {
    prismaMock.userOrganisationInvitation.findMany.mockResolvedValueOnce(pendingEmails)
    mockEmailService.getEmailInsights.mockResolvedValueOnce({
      messageId: pendingEmails[0].messageId,
      insights: [mockAWSRejectedInsight],
    })
    prismaMock.userOrganisationInvitation.updateMany.mockResolvedValueOnce({ count: 1 })

    await monitorInvitationEmails()

    expect(prismaMock.sysRefInvitationStatus.findFirstOrThrow).toHaveBeenCalledTimes(3)
    expect(prismaMock.userOrganisationInvitation.findMany).toHaveBeenCalledTimes(1)

    expect(mockEmailService.getEmailInsights).toHaveBeenCalledTimes(1)
    expect(mockEmailService.getEmailInsights).toHaveBeenCalledWith(pendingEmails[0].messageId)

    expect(prismaMock.userOrganisationInvitation.updateMany).toHaveBeenCalledTimes(1)
    expect(prismaMock.userOrganisationInvitation.updateMany).toHaveBeenCalledWith({
      data: {
        statusId: 3,
      },
      where: { messageId: { in: [pendingEmails[0].messageId] } },
    })
  })

  it(`should correctly set status of email in SE DB to 'Failure' when AWS email status is not 'Delivery' or in our pre-defined failed list AND it has been greater than 72 hours since email was sent`, async () => {
    const mockInsight = { ...mockAWSDeliveredInsight, Events: [mockAWSDeliveredInsight.Events![1]] } //  Only include 'SEND' event

    jest.useFakeTimers().setSystemTime(mockGetCurrentDate(4))

    prismaMock.userOrganisationInvitation.findMany.mockResolvedValueOnce(pendingEmails)
    mockEmailService.getEmailInsights.mockResolvedValueOnce({
      messageId: pendingEmails[0].messageId,
      insights: [mockInsight],
    })
    prismaMock.userOrganisationInvitation.updateMany.mockResolvedValueOnce({ count: 1 })

    await monitorInvitationEmails()

    expect(prismaMock.sysRefInvitationStatus.findFirstOrThrow).toHaveBeenCalledTimes(3)
    expect(prismaMock.userOrganisationInvitation.findMany).toHaveBeenCalledTimes(1)

    expect(mockEmailService.getEmailInsights).toHaveBeenCalledTimes(1)
    expect(mockEmailService.getEmailInsights).toHaveBeenCalledWith(pendingEmails[0].messageId)

    expect(prismaMock.userOrganisationInvitation.updateMany).toHaveBeenCalledTimes(1)
    expect(prismaMock.userOrganisationInvitation.updateMany).toHaveBeenCalledWith({
      data: {
        statusId: 3,
      },
      where: { messageId: { in: [pendingEmails[0].messageId] } },
    })

    jest.useRealTimers()
  })

  it(`should not update the status of email in SE DB when AWS email status is not 'Delivery' or in our pre-defined failed list AND it has been less than 72 hours since email was sent`, async () => {
    const mockInsight = { ...mockAWSDeliveredInsight, Events: [mockAWSDeliveredInsight.Events![1]] } //  Only include 'SEND' event

    jest.useFakeTimers().setSystemTime(mockGetCurrentDate(1))

    prismaMock.userOrganisationInvitation.findMany.mockResolvedValueOnce(pendingEmails)
    mockEmailService.getEmailInsights.mockResolvedValueOnce({
      messageId: pendingEmails[0].messageId,
      insights: [mockInsight],
    })
    prismaMock.userOrganisationInvitation.updateMany.mockResolvedValueOnce({ count: 1 })

    await monitorInvitationEmails()

    expect(prismaMock.sysRefInvitationStatus.findFirstOrThrow).toHaveBeenCalledTimes(3)
    expect(prismaMock.userOrganisationInvitation.findMany).toHaveBeenCalledTimes(1)

    expect(mockEmailService.getEmailInsights).toHaveBeenCalledTimes(1)
    expect(mockEmailService.getEmailInsights).toHaveBeenCalledWith(pendingEmails[0].messageId)

    expect(prismaMock.userOrganisationInvitation.updateMany).not.toHaveBeenCalled()

    jest.useRealTimers()
  })

  it('should retry once if initial request to fetch status from AWS fails due to too many requests', async () => {
    prismaMock.userOrganisationInvitation.findMany.mockResolvedValueOnce(pendingEmails)

    mockEmailService.getEmailInsights.mockRejectedValueOnce(
      new TooManyRequestsException({ message: 'Oh no an error', $metadata: {} })
    )
    mockEmailService.getEmailInsights.mockResolvedValueOnce({
      messageId: pendingEmails[0].messageId,
      insights: [mockAWSDeliveredInsight],
    })

    await monitorInvitationEmails()

    expect(mockEmailService.getEmailInsights).toHaveBeenCalledTimes(2)
  })

  it('should not throw an error when request to fetch status from AWS fails', async () => {
    prismaMock.userOrganisationInvitation.findMany.mockResolvedValueOnce(pendingEmails)

    mockEmailService.getEmailInsights.mockRejectedValueOnce(new Error())

    await monitorInvitationEmails()

    expect(mockEmailService.getEmailInsights).toHaveBeenCalledTimes(1)
    expect(prismaMock.userOrganisationInvitation.updateMany).not.toHaveBeenCalled()
  })
})
