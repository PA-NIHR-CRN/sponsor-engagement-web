import { emailService } from '@nihr-ui/email'
import type { Prisma } from 'database'
import { Mock } from 'ts-mockery'
import { notify } from '../notify'
import { prismaClient } from '../lib/prisma'

jest.mock('@nihr-ui/logger')
jest.mock('@nihr-ui/email')

const mockUsers = [
  Mock.of<Prisma.UserGetPayload<undefined>>({ id: 1, email: 'user1@test.com' }),
  Mock.of<Prisma.UserGetPayload<undefined>>({ id: 2, email: 'user2@test.com' }),
]

describe('notify', () => {
  it('it should send assessment reminder emails to the appropriate users', async () => {
    jest.mocked(prismaClient.user.findMany).mockResolvedValueOnce(mockUsers)

    jest
      .mocked(emailService.sendBulkEmail)
      .mockImplementationOnce((_, onSuccess) => onSuccess(mockUsers.map(({ email }) => email)))

    await notify()

    expect(emailService.sendBulkEmail).toHaveBeenCalledWith(
      [
        {
          subject: `Assess the progress of your studies`,
          to: ['user1@test.com', 'user2@test.com'],
          templateData: {
            crnLink: 'https://www.nihr.ac.uk/explore-nihr/support/clinical-research-network.htm',
            iconUrl: 'http://localhost:3000/assets/images/exclamation-icon.png',
            requestSupportLink: 'http://localhost:3000/request-support',
            signInLink: 'http://localhost:3000/auth/signin',
            termsAndConditionsLink:
              'https://www.nihr.ac.uk/documents/researchers/i-need-help-to-deliver-my-research/terms-and-conditions-for-nihr-crn-support.pdf',
          },
          htmlTemplate: expect.any(Function),
          textTemplate: expect.any(Function),
        },
      ],
      expect.any(Function)
    )

    expect(prismaClient.assessmentReminder.createMany).toHaveBeenCalledWith({
      data: [{ userId: 1 }, { userId: 2 }],
    })
  })
})
