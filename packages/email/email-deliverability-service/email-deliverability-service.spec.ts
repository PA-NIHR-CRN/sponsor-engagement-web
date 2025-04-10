import { SESV2 } from 'aws-sdk'
import { EmailDeliverabilityService } from '.'

jest.mock('aws-sdk')
jest.mock('node:fs')
jest.mock('@nihr-ui/logger')

describe('EmailDeliverabilityService', () => {
  let sesClientMock: jest.Mocked<SESV2>
  let emailDeliverabilityService: EmailDeliverabilityService

  beforeEach(() => {
    sesClientMock = new SESV2() as jest.Mocked<SESV2>
    emailDeliverabilityService = new EmailDeliverabilityService(sesClientMock)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should fetch email details with the correct parameters', async () => {
    const mockMessageId = '1212121'
    const mockGetMessageInsights = jest.fn().mockResolvedValue({ MessageId: mockMessageId })
    sesClientMock.getMessageInsights = jest.fn().mockReturnValueOnce({ promise: mockGetMessageInsights })

    const result = await emailDeliverabilityService.getEmailInsights(mockMessageId)
    expect(result).toEqual({ messageId: mockMessageId, insights: [] })

    expect(sesClientMock.getMessageInsights).toHaveBeenCalledTimes(1)
    expect(sesClientMock.getMessageInsights).toHaveBeenCalledWith({ MessageId: mockMessageId })
  })

  it('should throw an error when request to fetch email details fails', async () => {
    const mockMessageId = '1212121'
    const error = new Error('Oh no, an error!')
    const mockGetMessageInsights = jest.fn().mockRejectedValueOnce(error)
    sesClientMock.getMessageInsights = jest.fn().mockReturnValueOnce({ promise: mockGetMessageInsights })

    await expect(emailDeliverabilityService.getEmailInsights(mockMessageId)).rejects.toThrow(error)

    expect(sesClientMock.getMessageInsights).toHaveBeenCalledTimes(1)
  })

  it(`should throw an error when 'MessageId' does not exist within the fetch email details response`, async () => {
    const mockMessageId = '1212121'
    const mockGetMessageInsights = jest.fn().mockResolvedValue({})
    sesClientMock.getMessageInsights = jest.fn().mockReturnValueOnce({ promise: mockGetMessageInsights })

    await expect(emailDeliverabilityService.getEmailInsights(mockMessageId)).rejects.toThrow(
      new Error('MessageId does not exist within the response')
    )

    expect(sesClientMock.getMessageInsights).toHaveBeenCalledTimes(1)
  })
})
