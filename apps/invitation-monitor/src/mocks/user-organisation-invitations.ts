import { Mock } from 'ts-mockery'
import type { UserOrganisationInvitations } from '../types'

export const pendingEmails = Mock.of<UserOrganisationInvitations>([
  {
    id: 1,
    messageId: '1-1-1',
    timestamp: new Date('2025-03-31'),
    sentBy: {
      email: 'sender@test.nihr.ac.uk',
    },
    userOrganisation: {
      user: {
        email: 'receiver@test.nihr.ac.uk',
      },
    },
  },
])
