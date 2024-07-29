import { emailService } from '@nihr-ui/email'
import type { Prisma } from 'database'
import { Mock } from 'ts-mockery'
import { logger } from '@nihr-ui/logger'
import { notify } from '../notify'
import { prismaMock } from '../mocks/prisma'

jest.mock('@nihr-ui/logger')
jest.mock('@nihr-ui/email')
jest.mock('dotenv')

jest.useFakeTimers().setSystemTime(new Date('2023-01-01'))

beforeEach(() => {
  jest.clearAllMocks()
})

const mockUsers = [
  Mock.of<Prisma.UserGetPayload<undefined>>({ id: 1, email: 'user1@test.com' }),
  Mock.of<Prisma.UserGetPayload<undefined>>({ id: 2, email: 'user2@test.com' }),
  Mock.of<Prisma.UserGetPayload<undefined>>({ id: 3, email: 'user3@test.com' }),
]

const mockAssessmentReminders = [Mock.of<Prisma.AssessmentReminderGetPayload<undefined>>({ id: 123 })]

describe('notify', () => {
  it('should send assessment reminder emails to the appropriate users in prod', async () => {
    const originalEnv = process.env.APP_ENV
    process.env.APP_ENV = 'prod'
    jest.mocked(emailService.sendBulkEmail).mockImplementationOnce(async (emails, onSuccess) => {
      await Promise.all(
        emails.map(({ to }) =>
          onSuccess({
            recipients: Array.isArray(to) ? to : [to],
            messageId: '123',
          })
        )
      )
    })

    prismaMock.user.findMany.mockResolvedValueOnce(mockUsers)
    prismaMock.assessmentReminder.findMany.mockResolvedValue(mockAssessmentReminders)

    await notify()

    expect(emailService.sendBulkEmail).toHaveBeenCalledWith(
      mockUsers.map(({ email }) => ({
        subject: `Assess the progress of your studies`,
        to: email,
        templateData: {
          rdnLink: 'https://www.nihr.ac.uk/explore-nihr/support/clinical-research-network.htm',
          iconUrl: 'https://assessmystudy.nihr.ac.uk/assets/images/exclamation-icon.png',
          requestSupportLink: 'https://assessmystudy.nihr.ac.uk/request-support',
          signInLink: 'https://assessmystudy.nihr.ac.uk/auth/signin',
          termsAndConditionsLink:
            'https://www.nihr.ac.uk/documents/researchers/i-need-help-to-deliver-my-research/terms-and-conditions-for-nihr-crn-support.pdf',
        },
        htmlTemplate: expect.any(Function),
        textTemplate: expect.any(Function),
      })),
      expect.any(Function)
    )

    expect(prismaMock.assessmentReminder.createMany).toHaveBeenCalledWith({
      data: [{ userId: 1 }, { userId: 2 }, { userId: 3 }],
    })

    expect(prismaMock.assessmentReminder.update).toHaveBeenCalledWith({
      where: { id: 123 },
      data: {
        sentAt: new Date('2023-01-01'),
        messageId: '123',
      },
    })

    process.env.APP_ENV = originalEnv
  })

  it('should only send reminders to emails within the allow list if specified', async () => {
    const allowList = ['user1@test.com', 'user3@test.com']
    process.env.NOTIFY_ALLOW_LIST = allowList.join(',')

    prismaMock.user.findMany.mockResolvedValueOnce(mockUsers)

    await notify()

    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: expect.objectContaining({ email: { in: allowList } }),
    })
  })

  it('should exit if no users have studies due assessment', async () => {
    prismaMock.user.findMany.mockResolvedValueOnce([])

    await notify()

    expect(emailService.sendBulkEmail).not.toHaveBeenCalled()

    expect(logger.info).toHaveBeenCalledWith('No assessment notifications required')
  })

  it('should not run on non-production environments unless allow list is set', async () => {
    const originalAllowList = process.env.NOTIFY_ALLOW_LIST

    delete process.env.NOTIFY_ALLOW_LIST

    prismaMock.user.findMany.mockResolvedValueOnce(mockUsers)

    await notify()

    expect(emailService.sendBulkEmail).not.toHaveBeenCalled()

    expect(logger.error).toHaveBeenCalledWith('No allow list provided for non-prod environment')

    process.env.NOTIFY_ALLOW_LIST = originalAllowList
  })

  it('should log unhandled exceptions', async () => {
    prismaMock.user.findMany.mockResolvedValueOnce(mockUsers)
    jest.mocked(emailService.sendBulkEmail).mockRejectedValueOnce('Error sending email')

    await notify()

    expect(logger.error).toHaveBeenCalledWith('Error sending email')
  })
})
